/**
 * Generates a displacement map for a refractive "glass lens" shaped like a
 * rounded rectangle, for use with SVG's <feDisplacementMap>.
 *
 * The lens is modeled as a thin curved rim wrapped around a flat center —
 * pixels in the middle of the shape pass straight through undisturbed, and
 * the bend grows only as you approach the edge, peaking right at the rim.
 * That's the same way a real bevelled piece of glass behaves: optically
 * flat in the middle, all of the refraction concentrated at the edge.
 *
 * For each pixel we estimate how steep the lens surface is at that point
 * (modeled as a quarter-circle bevel: steep at the rim, flat at the
 * center), refract a straight-on view ray through that slope using Snell's
 * law at an index of 1.5 (ordinary glass), and write the resulting sideways
 * shift into the map's red/green channels, aimed along the rounded
 * rectangle's outward normal. That's exactly what <feDisplacementMap>
 * expects: a value of 128 means "no shift"; higher or lower pushes the
 * sampled pixel right/left (red channel) or down/up (green channel).
 */

const REFRACTIVE_INDEX = 1.5;

/**
 * Signed distance from (px, py) — measured from the shape's center — to the
 * boundary of a `w` x `h` rounded rectangle with corner radius `r`.
 * Negative = inside the shape, 0 = on the boundary, positive = outside.
 */
function roundedRectDistance(px: number, py: number, w: number, h: number, r: number) {
  const qx = Math.abs(px) - (w / 2 - r);
  const qy = Math.abs(py) - (h / 2 - r);
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(ax, ay) - r;
}

/** Outward unit normal of the rounded rectangle at (px, py), in closed form. */
function roundedRectNormal(px: number, py: number, w: number, h: number, r: number): [number, number] {
  const hw = w / 2 - r;
  const hh = h / 2 - r;
  const qx = Math.abs(px) - hw;
  const qy = Math.abs(py) - hh;
  const sx = px < 0 ? -1 : 1;
  const sy = py < 0 ? -1 : 1;

  if (qx > 0 && qy > 0) {
    // Inside the rounded-corner arc: normal points straight out from the
    // corner's arc center.
    const len = Math.hypot(qx, qy) || 1;
    return [(qx / len) * sx, (qy / len) * sy];
  }
  if (qx > qy) {
    return [sx, 0];
  }
  return [0, sy];
}

export type LensMapOptions = {
  width: number;
  height: number;
  /** Corner radius of the lens shape, in CSS pixels. */
  radius: number;
  /** How wide the curved rim band is, in CSS pixels. */
  rimWidth?: number;
  /** Devicepixel scale for the generated bitmap (sharper on hi-DPI). */
  pixelRatio?: number;
};

export type LensMap = {
  url: string;
  revoke: () => void;
};

/** Renders a lens displacement map to a canvas and returns it as a blob URL. */
export function generateLensDisplacementMap({
  width,
  height,
  radius,
  rimWidth,
  pixelRatio = 1,
}: LensMapOptions): Promise<LensMap> {
  if (width <= 0 || height <= 0) {
    return Promise.reject(new Error("generateLensDisplacementMap: invalid size"));
  }

  const canvas = document.createElement("canvas");
  const w = Math.max(1, Math.round(width * pixelRatio));
  const h = Math.max(1, Math.round(height * pixelRatio));
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return Promise.reject(new Error("generateLensDisplacementMap: 2D canvas unavailable"));
  }

  const r = Math.min(radius, Math.min(w, h) / 2) * pixelRatio;
  const rim = Math.max(1, (rimWidth ?? Math.min(width, height) * 0.4) * pixelRatio);

  const image = ctx.createImageData(w, h);
  const data = image.data;

  for (let y = 0; y < h; y++) {
    const py = y - h / 2 + 0.5;
    for (let x = 0; x < w; x++) {
      const px = x - w / 2 + 0.5;
      const i = (y * w + x) * 4;
      const dist = roundedRectDistance(px, py, w, h, r);

      if (dist > 0) {
        // Outside the lens shape — neutral and transparent. CSS clips the
        // visible box to the same rounded shape, so this is just a clean
        // fallback in case anything ever samples past that edge.
        data[i] = 128;
        data[i + 1] = 128;
        data[i + 2] = 0;
        data[i + 3] = 0;
        continue;
      }

      // 0 right at the boundary, 1 once we're a full rim-width inside.
      const t = Math.min(1, -dist / rim);

      // Quarter-circle bevel profile: slope is steepest at the rim (t = 0)
      // and eases to flat at the center (t = 1).
      const slope = Math.cos((Math.PI / 2) * t);
      const thetaI = Math.atan(slope);
      const sinRefracted = Math.sin(thetaI) / REFRACTIVE_INDEX;
      const thetaT = Math.asin(Math.min(1, Math.max(-1, sinRefracted)));
      const bend = Math.sin(thetaI - thetaT); // 0 at center, largest at the rim

      const [nx, ny] = roundedRectNormal(px, py, w, h, r);

      data[i] = Math.max(0, Math.min(255, 128 + nx * bend * 127));
      data[i + 1] = Math.max(0, Math.min(255, 128 + ny * bend * 127));
      data[i + 2] = Math.round((1 - t) * 255); // specular height, brightest at the rim
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("generateLensDisplacementMap: toBlob failed"));
        return;
      }
      const url = URL.createObjectURL(blob);
      resolve({ url, revoke: () => URL.revokeObjectURL(url) });
    }, "image/png");
  });
}
