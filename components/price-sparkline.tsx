interface PriceSparklineProps {
  /** Array of values to plot (e.g. monthly medians) */
  values: number[];
  width?: number;
  height?: number;
  className?: string;
}

export function PriceSparkline({
  values,
  width = 80,
  height = 24,
  className = "",
}: PriceSparklineProps) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 2;

  const points = values
    .map((v, i) => {
      const x = padding + (i / (values.length - 1)) * (width - padding * 2);
      const y = height - padding - ((v - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  // Determine trend color
  const isUp = values[values.length - 1] > values[0];
  const isFlat = values[values.length - 1] === values[0];
  const strokeColor = isFlat
    ? "stroke-zinc-400 dark:stroke-zinc-500"
    : isUp
      ? "stroke-red-500 dark:stroke-red-400"
      : "stroke-green-500 dark:stroke-green-400";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        className={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
