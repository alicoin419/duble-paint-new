import type { Point, Segment } from './types';

// ─── Color Math ────────────────────────────────────────────────────────────────

export function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    case b: h = ((r - g) / d + 4) / 6; break;
  }
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue = (t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [Math.round(hue(h + 1 / 3) * 255), Math.round(hue(h) * 255), Math.round(hue(h - 1 / 3) * 255)];
}

// ─── Segment Application ──────────────────────────────────────────────────────

export function applySegment(imageData: ImageData, seg: Segment): void {
  const [tr, tg, tb] = hexToRgb(seg.finish.hex);
  const [th, ts] = rgbToHsl(tr, tg, tb);
  const { data } = imageData;
  const { maskData, opacity } = seg;
  for (let i = 0; i < maskData.length; i += 4) {
    if (maskData[i] > 128) {
      const [, , l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
      const [nr, ng, nb] = hslToRgb(th, ts, l);
      data[i]     = Math.round(data[i]     * (1 - opacity) + nr * opacity);
      data[i + 1] = Math.round(data[i + 1] * (1 - opacity) + ng * opacity);
      data[i + 2] = Math.round(data[i + 2] * (1 - opacity) + nb * opacity);
    }
  }
}

// ─── Polygon Rasterization ─────────────────────────────────────────────────────

export function rasterizePolygon(
  polygon: Point[],
  obstructions: Point[][] | undefined,
  w: number,
  h: number,
): Uint8ClampedArray {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'white';
  ctx.beginPath();
  polygon.forEach((p, i) => i === 0 ? ctx.moveTo(p.x * w, p.y * h) : ctx.lineTo(p.x * w, p.y * h));
  ctx.closePath();
  ctx.fill();
  if (obstructions?.length) {
    ctx.fillStyle = 'black';
    obstructions.forEach(obs => {
      ctx.beginPath();
      obs.forEach((p, i) => i === 0 ? ctx.moveTo(p.x * w, p.y * h) : ctx.lineTo(p.x * w, p.y * h));
      ctx.closePath();
      ctx.fill();
    });
  }
  return ctx.getImageData(0, 0, w, h).data;
}

// ─── Magic Wand ───────────────────────────────────────────────────────────────

export function magicWand(imageData: ImageData, startX: number, startY: number, tolerance = 38): Uint8ClampedArray {
  const { width, height, data } = imageData;
  const mask = new Uint8ClampedArray(width * height * 4);
  const visited = new Uint8Array(width * height);
  const si = (startY * width + startX) * 4;
  const [sr, sg, sb] = [data[si], data[si + 1], data[si + 2]];
  const stack = [startY * width + startX];
  while (stack.length) {
    const idx = stack.pop()!;
    if (idx < 0 || idx >= width * height || visited[idx]) continue;
    visited[idx] = 1;
    const pi = idx * 4;
    const dr = data[pi] - sr, dg = data[pi + 1] - sg, db = data[pi + 2] - sb;
    if (Math.sqrt(dr * dr + dg * dg + db * db) > tolerance) continue;
    mask[pi] = mask[pi + 1] = mask[pi + 2] = mask[pi + 3] = 255;
    const x = idx % width, y = Math.floor(idx / width);
    if (x > 0) stack.push(idx - 1);
    if (x < width - 1) stack.push(idx + 1);
    if (y > 0) stack.push(idx - width);
    if (y < height - 1) stack.push(idx + width);
  }
  return mask;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function pixelInMask(seg: Segment, px: number, py: number): boolean {
  return (seg.maskData[(py * seg.width + px) * 4] ?? 0) > 128;
}

export function pointsToSvg(pts: Point[]): string {
  return pts.map(p => `${p.x},${p.y}`).join(' ');
}

/** Counts white pixels in a mask as a fraction of total */
export function maskCoverage(maskData: Uint8ClampedArray): number {
  let white = 0;
  const total = maskData.length / 4;
  for (let i = 0; i < maskData.length; i += 4) {
    if (maskData[i] > 128) white++;
  }
  return white / total;
}

/** Compress a canvas image to a base64 JPEG, capping dimensions */
export function canvasToJpeg(canvas: HTMLCanvasElement, maxSide = 1400, quality = 0.88): string {
  const scale = Math.min(1, maxSide / Math.max(canvas.width, canvas.height));
  if (scale >= 1) return canvas.toDataURL('image/jpeg', quality);
  const tmp = document.createElement('canvas');
  tmp.width  = Math.round(canvas.width  * scale);
  tmp.height = Math.round(canvas.height * scale);
  tmp.getContext('2d')!.drawImage(canvas, 0, 0, tmp.width, tmp.height);
  return tmp.toDataURL('image/jpeg', quality);
}
