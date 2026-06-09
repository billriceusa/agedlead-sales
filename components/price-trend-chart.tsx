/**
 * Server-rendered SVG price-trend chart — zero dependencies, fully in the SSR
 * HTML (crawlable, no client JS). Plots the median aged-lead price across the
 * months we have tracked, with a low/high range band. Honest by construction:
 * - 0-baseline Y axis (no truncated axis to exaggerate moves)
 * - only the months that actually have observed data are plotted (no
 *   interpolation / no fabricated points)
 * - the caller decides whether enough history exists to render at all
 */

export interface PriceTrendPoint {
  month: string; // "YYYY-MM"
  low: number;
  median: number;
  high: number;
}

interface Props {
  points: PriceTrendPoint[];
  verticalName: string;
  /** Human description of the exact series plotted, e.g.
   *  "shared, 31–85-day aged internet-form leads". Keeps the caption honest
   *  since the best-covered series varies by vertical. */
  seriesLabel: string;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function shortMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const idx = parseInt(m, 10) - 1;
  return `${MONTHS[idx] ?? m} ’${y.slice(2)}`;
}

function money(v: number): string {
  return v >= 10 || Number.isInteger(v) ? `$${v.toFixed(0)}` : `$${v.toFixed(2)}`;
}

/** Round up to a clean axis maximum based on magnitude. */
function niceCeil(v: number): number {
  if (v <= 0) return 1;
  if (v <= 1) return Math.ceil(v * 4) / 4; // 0.25 steps
  if (v <= 5) return Math.ceil(v);
  if (v <= 20) return Math.ceil(v / 2) * 2;
  return Math.ceil(v / 10) * 10;
}

export function PriceTrendChart({ points, verticalName, seriesLabel }: Props) {
  // Need at least 3 real months to call it a trend.
  if (!points || points.length < 3) return null;

  const W = 640;
  const H = 280;
  const padL = 52;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const n = points.length;

  const yMax = niceCeil(Math.max(...points.map((p) => p.high)));
  const yMin = 0;

  const xAt = (i: number) =>
    n === 1 ? padL + plotW / 2 : padL + (i / (n - 1)) * plotW;
  const yAt = (v: number) =>
    padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const medianLine = points
    .map((p, i) => `${xAt(i).toFixed(1)},${yAt(p.median).toFixed(1)}`)
    .join(" ");

  // Range band polygon: across the highs, then back across the lows.
  const bandTop = points.map((p, i) => `${xAt(i).toFixed(1)},${yAt(p.high).toFixed(1)}`);
  const bandBottom = points
    .map((p, i) => `${xAt(i).toFixed(1)},${yAt(p.low).toFixed(1)}`)
    .reverse();
  const bandPath = `${bandTop.join(" ")} ${bandBottom.join(" ")}`;

  const gridVals = [0, yMax / 2, yMax];

  return (
    <figure className="my-10 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <figcaption className="mb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          {verticalName} aged-lead price trend
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Median price for {seriesLabel}, by month. Shaded band shows the
          tracked low–high range. Source: Aged Lead Sales Lead Price Index.
        </p>
      </figcaption>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full text-zinc-400 dark:text-zinc-500"
        role="img"
        aria-label={`Line chart of ${verticalName} aged lead median price over ${n} months, ranging from ${money(
          points[0].median
        )} to ${money(points[n - 1].median)}.`}
      >
        {/* Y gridlines + labels */}
        {gridVals.map((v, i) => (
          <g key={i}>
            <line
              x1={padL}
              x2={W - padR}
              y1={yAt(v)}
              y2={yAt(v)}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeDasharray={i === 0 ? undefined : "3 3"}
            />
            <text
              x={padL - 8}
              y={yAt(v) + 4}
              textAnchor="end"
              fontSize="12"
              fill="currentColor"
            >
              {money(v)}
            </text>
          </g>
        ))}

        {/* Low–high range band */}
        <polygon points={bandPath} fill="#2563eb" fillOpacity={0.12} />

        {/* Median line */}
        <polyline
          points={medianLine}
          fill="none"
          stroke="#2563eb"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points + value labels + x labels */}
        {points.map((p, i) => (
          <g key={p.month}>
            <circle cx={xAt(i)} cy={yAt(p.median)} r={4} fill="#2563eb" />
            <text
              x={xAt(i)}
              y={yAt(p.median) - 10}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              fill="#2563eb"
            >
              {money(p.median)}
            </text>
            <text
              x={xAt(i)}
              y={H - padB + 20}
              textAnchor="middle"
              fontSize="12"
              fill="currentColor"
            >
              {shortMonth(p.month)}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
