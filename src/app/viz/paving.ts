import { rng } from './random';

/**
 * Fitted polygonal paving, after the basalt blocks of the Via Appia.
 * A jittered lattice whose vertices are shared between neighbours, so stones
 * interlock; each stone is then inset slightly to leave a mortar joint.
 */
export function paving(width: number, height: number, cell: number, seed = 7, joint = 1.6): string[] {
  const rand = rng(seed);
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  const jitter = cell * 0.34;
  const grid: [number, number][][] = [];

  for (let r = 0; r <= rows; r++) {
    const row: [number, number][] = [];
    const offset = r % 2 ? cell * 0.5 : 0;
    for (let c = 0; c <= cols; c++) {
      const edgeY = r === 0 || r === rows;
      row.push([
        c * cell - offset + (rand() - 0.5) * jitter * 2,
        edgeY ? Math.min(height, r * cell) : r * cell + (rand() - 0.5) * jitter * 2,
      ]);
    }
    grid.push(row);
  }

  const stones: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Split some cells diagonally into two stones for irregularity.
      const a = grid[r][c];
      const b = grid[r][c + 1];
      const d = grid[r + 1][c];
      const e = grid[r + 1][c + 1];
      const shapes = rand() < 0.12 ? (rand() < 0.5 ? [[a, b, e], [a, e, d]] : [[a, b, d], [b, e, d]]) : [[a, b, e, d]];
      for (const poly of shapes) stones.push(inset(poly, joint));
    }
  }
  return stones;
}

function inset(poly: [number, number][], by: number): string {
  const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
  const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
  return poly
    .map(([x, y]) => {
      const dx = x - cx;
      const dy = y - cy;
      const len = Math.hypot(dx, dy) || 1;
      const k = Math.max(0, (len - by) / len);
      return `${(cx + dx * k).toFixed(1)},${(cy + dy * k).toFixed(1)}`;
    })
    .join(' ');
}
