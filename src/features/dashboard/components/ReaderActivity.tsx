import { useEffect, useState } from "react";

const timeRanges = ["7D", "30D", "90D", "1Y"] as const;

type TimeRange = (typeof timeRanges)[number];

const chartData: Record<TimeRange, number[]> = {
  "7D": [42, 48, 44, 58, 52, 67, 62],
  "30D": [38, 45, 51, 48, 58, 63, 67],
  "90D": [32, 41, 38, 52, 48, 61, 67],
  "1Y": [24, 31, 38, 34, 46, 55, 67],
};

const chartLabels: Record<TimeRange, string[]> = {
  "7D": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "30D": ["W1", "W2", "W3", "W4", "W5", "W6", "W7"],
  "90D": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  "1Y": ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2", "Q3"],
};

const rangeStats: Record<
  TimeRange,
  {
    views: string;
    change: string;
    readers: string;
  }
> = {
  "7D": {
    views: "12.8K",
    change: "+8.4%",
    readers: "8.2K",
  },
  "30D": {
    views: "48.6K",
    change: "+12.7%",
    readers: "31.4K",
  },
  "90D": {
    views: "124.8K",
    change: "+18.4%",
    readers: "82.6K",
  },
  "1Y": {
    views: "482.4K",
    change: "+24.8%",
    readers: "318.2K",
  },
};

function createChartPoints(values: number[]) {
  const width = 700;
  const height = 220;
  const paddingX = 16;
  const paddingY = 20;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values.map((value, index) => {
    const x = paddingX + (index / (values.length - 1)) * (width - paddingX * 2);

    const y =
      height - paddingY - ((value - min) / range) * (height - paddingY * 2);

    return {
      x,
      y,
      value,
    };
  });
}

function createPath(points: Array<{ x: number; y: number }>) {
  return points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }

      const previous = points[index - 1];

      const controlPoint1X = previous.x + (point.x - previous.x) / 2;

      const controlPoint2X = point.x - (point.x - previous.x) / 2;

      return [
        `C`,
        `${controlPoint1X}`,
        `${previous.y}`,
        `${controlPoint2X}`,
        `${point.y}`,
        `${point.x}`,
        `${point.y}`,
      ].join(" ");
    })
    .join(" ");
}

export function ReaderActivity() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("7D");

  const [activePoint, setActivePoint] = useState<number | null>(null);

  const values = chartData[selectedRange];
  const labels = chartLabels[selectedRange];
  const stats = rangeStats[selectedRange];

  const points = createChartPoints(values);
  const path = createPath(points);

  useEffect(() => {
    setActivePoint(null);
  }, [selectedRange]);

  return (
    <article
      className={[
        "overflow-hidden rounded-[var(--radius-md)]",
        "border border-[var(--color-outline-variant)]",
        "bg-[var(--color-surface)]",
        "shadow-[var(--shadow-xs)]",
        "transition-[transform,box-shadow,border-color]",
        "duration-[var(--motion-normal)]",
        "ease-[var(--ease-standard)]",
        "animate-[card-enter_500ms_var(--ease-standard)_both]",
        "delay-100",
        "hover:-translate-y-0.5",
        "hover:shadow-[var(--shadow-md)]",
        "hover:border-[var(--color-outline)]",
        "active:translate-y-0",
      ].join(" ")}
    >
      <div className="flex flex-col gap-4 border-b border-[var(--color-outline-variant)] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
            READER ACTIVITY
          </p>

          <h2 className="mt-1 font-display text-[25px] leading-tight tracking-[-0.02em] text-[var(--color-on-surface)]">
            Reader engagement
          </h2>
        </div>

        <div
          className={[
            "inline-flex w-fit items-center gap-1",
            "rounded-[var(--radius-md)]",
            "border border-[var(--color-outline-variant)]",
            "bg-[var(--color-surface-container-low)]",
            "p-1",
          ].join(" ")}
        >
          {timeRanges.map((range) => {
            const active = selectedRange === range;

            return (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                aria-pressed={active}
                className={[
                  "min-w-12 rounded-[var(--radius-sm)] px-3 py-1.5",
                  "font-body text-[11px] font-semibold",
                  "transition-[background-color,color,box-shadow,transform]",
                  "duration-[var(--motion-fast)]",
                  "ease-[var(--ease-standard)]",
                  "focus-visible:outline-2",
                  "focus-visible:outline-[var(--color-primary)]",
                  "focus-visible:outline-offset-1",
                  active
                    ? [
                        "!bg-[var(--color-primary)]",
                        "!text-[var(--color-on-primary)]",
                        "shadow-[var(--shadow-xs)]",
                      ].join(" ")
                    : [
                        "bg-transparent",
                        "text-[var(--color-on-surface-variant)]",
                        "hover:bg-[var(--color-surface)]",
                        "hover:text-[var(--color-on-surface)]",
                        "active:translate-y-px",
                      ].join(" "),
                ].join(" ")}
              >
                {range}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-6 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-on-surface-variant)]">
              {selectedRange} OVERVIEW
            </p>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-[28px] leading-none tracking-[-0.025em] text-[var(--color-on-surface)]">
                {stats.views}
              </span>

              <span className="font-body text-[12px] font-semibold text-[var(--color-success)]">
                {stats.change}
              </span>
            </div>

            <p className="mt-1 font-body text-[12px] text-[var(--color-on-surface-variant)]">
              Total views
            </p>
          </div>

          <div>
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-on-surface-variant)]">
              UNIQUE READERS
            </p>

            <div className="mt-1">
              <span className="font-display text-[28px] leading-none tracking-[-0.025em] text-[var(--color-on-surface)]">
                {stats.readers}
              </span>
            </div>

            <p className="mt-1 font-body text-[12px] text-[var(--color-on-surface-variant)]">
              Engaged readers
            </p>
          </div>

          <div>
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-on-surface-variant)]">
              TREND
            </p>

            <div className="mt-1">
              <span className="font-display text-[28px] leading-none tracking-[-0.025em] text-[var(--color-primary)]">
                Rising
              </span>
            </div>

            <p className="mt-1 font-body text-[12px] text-[var(--color-on-surface-variant)]">
              Compared with previous period
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="relative h-[220px] w-full overflow-hidden">
            <svg
              viewBox="0 0 700 220"
              preserveAspectRatio="none"
              className="h-full w-full"
              role="img"
              aria-label={`Reader activity chart for ${selectedRange}`}
            >
              <line
                x1="16"
                y1="20"
                x2="684"
                y2="20"
                stroke="var(--color-outline-variant)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />

              <line
                x1="16"
                y1="110"
                x2="684"
                y2="110"
                stroke="var(--color-outline-variant)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />

              <line
                x1="16"
                y1="200"
                x2="684"
                y2="200"
                stroke="var(--color-outline-variant)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />

              <path
                key={`${selectedRange}-line`}
                d={path}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength="1"
                className="reader-line-draw"
              />

              {points.map((point, index) => {
                const isActive = activePoint === index;

                return (
                  <circle
                    key={`${selectedRange}-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? 5 : 3.5}
                    fill="var(--color-surface)"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    className="reader-point cursor-pointer transition-[r] duration-[var(--motion-fast)]"
                    onMouseEnter={() => setActivePoint(index)}
                    onMouseLeave={() => setActivePoint(null)}
                  />
                );
              })}
            </svg>

            {activePoint !== null && (
              <div
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-[var(--radius-sm)] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-2.5 py-1.5 shadow-[var(--shadow-md)]"
                style={{
                  left: `${(points[activePoint].x / 700) * 100}%`,
                  top: `${(points[activePoint].y / 220) * 100}%`,
                }}
              >
                <p className="font-body text-[11px] font-semibold text-[var(--color-on-surface)]">
                  {values[activePoint]}K views
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 flex justify-between px-1">
            {labels.map((label) => (
              <span
                key={label}
                className="font-body text-[11px] text-[var(--color-on-surface-variant)]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ReaderActivity;
