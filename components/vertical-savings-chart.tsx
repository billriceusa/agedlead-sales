/**
 * Server-rendered SVG horizontal bar chart: how much cheaper aged leads are
 * than real-time, per vertical. Zero dependencies, fully in the SSR HTML
 * (crawlable, no client JS). Honest by construction: the savings % is computed
 * from the same median prices shown in the cards/tables; each bar is labeled
 * with the underlying real-time → aged medians so the percentage is auditable.
 */

export interface SavingsRow {
  vertical: string;
  realTimeMedian: number;
  agedMedian: number;
  /** 0-100, percent cheaper aged is vs real-time */
  savingsPercent: number;
}

interface Props {
  rows: SavingsRow[];
}

function money(v: number): string {
  if (v >= 10 || Number.isInteger(v)) return `$${v.toFixed(0)}`;
  if (v >= 1) return `$${v.toFixed(2)}`;
  return `$${v.toFixed(2)}`;
}

export function VerticalSavingsChart({ rows }: Props) {
  const data = [...rows]
    .filter(
      (r) =>
        typeof r.savingsPercent === "number" &&
        r.realTimeMedian > 0 &&
        r.agedMedian > 0
    )
    .sort((a, b) => b.savingsPercent - a.savingsPercent);

  if (data.length < 3) return null;

  const rowH = 38;
  const padT = 16;
  const padB = 28;
  const padL = 150; // vertical name column
  const padR = 56; // % label
  const W = 680;
  const plotW = W - padL - padR;
  const H = padT + padB + data.length * rowH;
  const maxPct = 100;
  const barW = (p: number) => (Math.max(0, Math.min(maxPct, p)) / maxPct) * plotW;

  const gridPcts = [0, 25, 50, 75, 100];

  return (
    <figure className="my-10 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <figcaption className="mb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          How much cheaper are aged leads?
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Savings per lead buying aged (31–85 days, shared) vs real-time, by
          vertical. Source: Work Aged Leads Lead Price Index.
        </p>
      </figcaption>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full text-zinc-400 dark:text-zinc-500"
        role="img"
        aria-label={`Horizontal bar chart of aged-lead savings vs real-time by vertical: ${data
          .map((d) => `${d.vertical} ${d.savingsPercent}% cheaper`)
          .join(", ")}.`}
      >
        {/* Vertical gridlines + % axis */}
        {gridPcts.map((p) => {
          const x = padL + barW(p);
          return (
            <g key={p}>
              <line
                x1={x}
                x2={x}
                y1={padT}
                y2={H - padB}
                stroke="currentColor"
                strokeOpacity={p === 0 ? 0.35 : 0.15}
                strokeDasharray={p === 0 ? undefined : "3 3"}
              />
              <text
                x={x}
                y={H - padB + 18}
                textAnchor="middle"
                fontSize="11"
                fill="currentColor"
              >
                {p}%
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const y = padT + i * rowH;
          const bh = rowH - 14;
          const w = barW(d.savingsPercent);
          return (
            <g key={d.vertical}>
              <text
                x={padL - 10}
                y={y + bh / 2 + 4}
                textAnchor="end"
                fontSize="12"
                fontWeight="600"
                fill="currentColor"
                className="text-zinc-700 dark:text-zinc-300"
              >
                {d.vertical}
              </text>
              <rect
                x={padL}
                y={y}
                width={Math.max(w, 1)}
                height={bh}
                rx={3}
                fill="#2563eb"
                fillOpacity={0.85}
              />
              {/* real-time → aged median, inside or after the bar */}
              <text
                x={padL + w - 8}
                y={y + bh / 2 + 4}
                textAnchor="end"
                fontSize="10"
                fill="#ffffff"
              >
                {money(d.realTimeMedian)} → {money(d.agedMedian)}
              </text>
              <text
                x={padL + w + 8}
                y={y + bh / 2 + 4}
                textAnchor="start"
                fontSize="12"
                fontWeight="700"
                fill="#2563eb"
              >
                {d.savingsPercent}%
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
