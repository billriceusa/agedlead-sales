/**
 * Server-rendered SVG radar/spider chart of a provider's six rating dimensions
 * (each scored 1-10). Zero dependencies, fully in the SSR HTML (crawlable, no
 * client JS). Honest by construction: fixed 0-10 axis on every spoke, no
 * truncation, plots only the real dimension scores.
 */

export interface RadarDimension {
  /** Short axis label, e.g. "Value" */
  label: string;
  /** Score 0-10 */
  score: number;
}

interface Props {
  dimensions: RadarDimension[];
  providerName: string;
}

const MAX = 10;

export function ProviderRatingRadar({ dimensions, providerName }: Props) {
  const n = dimensions.length;
  if (n < 3) return null; // a radar needs at least 3 axes

  const W = 360;
  const H = 340;
  const cx = W / 2;
  const cy = 168;
  const maxR = 116;

  // Axis i starts at the top (12 o'clock) and goes clockwise.
  const angleAt = (i: number) => (-90 + (i * 360) / n) * (Math.PI / 180);
  const pointAt = (score: number, i: number) => {
    const r = (Math.max(0, Math.min(MAX, score)) / MAX) * maxR;
    const a = angleAt(i);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };

  const rings = [2, 4, 6, 8, 10];

  const ringPolygon = (level: number) =>
    dimensions
      .map((_, i) => {
        const [x, y] = pointAt(level, i);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  const scorePolygon = dimensions
    .map((d, i) => {
      const [x, y] = pointAt(d.score, i);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <figure className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full text-zinc-400 dark:text-zinc-600"
        role="img"
        aria-label={`Radar chart of ${providerName} ratings across ${n} dimensions, each scored out of 10: ${dimensions
          .map((d) => `${d.label} ${d.score}`)
          .join(", ")}.`}
      >
        {/* Grid rings */}
        {rings.map((level) => (
          <polygon
            key={level}
            points={ringPolygon(level)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={level === MAX ? 0.4 : 0.18}
          />
        ))}

        {/* Axis spokes + labels */}
        {dimensions.map((d, i) => {
          const [ex, ey] = pointAt(MAX, i);
          const a = angleAt(i);
          const lx = cx + (maxR + 14) * Math.cos(a);
          const ly = cy + (maxR + 14) * Math.sin(a);
          const cos = Math.cos(a);
          const anchor =
            cos > 0.2 ? "start" : cos < -0.2 ? "end" : "middle";
          const dy = Math.sin(a) > 0.5 ? 10 : Math.sin(a) < -0.5 ? -4 : 4;
          return (
            <g key={d.label}>
              <line
                x1={cx}
                y1={cy}
                x2={ex}
                y2={ey}
                stroke="currentColor"
                strokeOpacity={0.18}
              />
              <text
                x={lx}
                y={ly + dy}
                textAnchor={anchor}
                fontSize="11"
                fill="currentColor"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Score polygon */}
        <polygon
          points={scorePolygon}
          fill="#2563eb"
          fillOpacity={0.18}
          stroke="#2563eb"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Vertices + score values */}
        {dimensions.map((d, i) => {
          const [x, y] = pointAt(d.score, i);
          return (
            <g key={`v-${d.label}`}>
              <circle cx={x} cy={y} r={3} fill="#2563eb" />
              <text
                x={x}
                y={y - 7}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#2563eb"
              >
                {d.score}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
        {providerName} ratings across six dimensions (each scored out of 10).
      </figcaption>
    </figure>
  );
}
