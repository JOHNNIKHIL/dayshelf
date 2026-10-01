"use client";

type Point = { date: string; label: string; value: number | null };
type Metric = { key: string; label: string; value: number | null; points: Point[]; description: string; inverse?: boolean };

const moodValue: Record<string, number> = { VERY_LOW: 1, LOW: 2, OKAY: 3, GOOD: 4, GREAT: 5 };

function normalize(value: number | null, inverse = false) {
  if (value == null) return 0;
  const v = Math.max(1, Math.min(5, value));
  return inverse ? 6 - v : v;
}

function Sparkline({ points, inverse = false }: { points: Point[]; inverse?: boolean }) {
  const usable = points.filter((p) => p.value != null);
  if (!usable.length) return <div className="chart-empty">No data yet</div>;
  const values = points.map((p) => (p.value == null ? null : normalize(p.value, inverse)));
  const width = 240;
  const height = 76;
  const coords = values.map((v, i) => {
    if (v == null) return null;
    const x = points.length === 1 ? width / 2 : (i / (points.length - 1)) * width;
    const y = height - ((v - 1) / 4) * (height - 10) - 5;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).filter(Boolean) as string[];
  const lastIndex = [...values].map((v, i) => (v == null ? -1 : i)).filter((i) => i >= 0).pop() ?? 0;
  const lastValue = values[lastIndex] ?? 1;
  const lastX = points.length === 1 ? width / 2 : (lastIndex / (points.length - 1)) * width;
  const lastY = height - ((lastValue - 1) / 4) * (height - 10) - 5;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="metric-sparkline" role="img" aria-label="Trend chart">
      <path d={`M0 ${height - 5} H${width}`} className="chart-grid" />
      <path d={`M0 ${height / 2} H${width}`} className="chart-grid" />
      <polyline points={coords.join(" ")} fill="none" className="chart-line" />
      <circle cx={lastX} cy={lastY} r="4" className="chart-dot" />
    </svg>
  );
}

function Radar({ metrics }: { metrics: { label: string; value: number | null; inverse?: boolean }[] }) {
  const cx = 130, cy = 115, r = 84;
  const angle = (i: number) => (-Math.PI / 2) + (i * 2 * Math.PI) / metrics.length;
  const point = (i: number, radius: number) => `${cx + Math.cos(angle(i)) * radius},${cy + Math.sin(angle(i)) * radius}`;
  const polygon = metrics.map((m, i) => point(i, (normalize(m.value, m.inverse) / 5) * r)).join(" ");
  return (
    <svg viewBox="0 0 260 230" className="radar-chart" role="img" aria-label="Today's balance chart">
      {[1, .75, .5, .25].map((scale) => <polygon key={scale} points={metrics.map((_, i) => point(i, r * scale)).join(" ")} className="radar-grid" />)}
      {metrics.map((m, i) => <line key={m.label} x1={cx} y1={cy} x2={point(i, r).split(",")[0]} y2={point(i, r).split(",")[1]} className="radar-axis" />)}
      <polygon points={polygon} className="radar-value" />
      {metrics.map((m, i) => {
        const p = point(i, r + 20).split(",");
        return <text key={m.label} x={p[0]} y={p[1]} textAnchor="middle" className="radar-label">{m.label}</text>;
      })}
    </svg>
  );
}

export function DailyVisuals({ days }: { days: Array<{ date: string; mood: string | null; energy: number | null; stress: number | null; productivity: number | null; social: number | null; sleep: number | null; planTotal: number; planDone: number }> }) {
  const current = days.at(-1);
  const point = (key: keyof (typeof days)[number]): Point[] => days.map((d) => ({ date: d.date, label: d.date.slice(5), value: typeof d[key] === "number" ? d[key] as number : null }));
  const planPoints: Point[] = days.map((d) => ({ date: d.date, label: d.date.slice(5), value: d.planTotal ? Math.round((d.planDone / d.planTotal) * 5) : null }));
  const metrics: Metric[] = [
    { key: "mood", label: "Mood", value: current?.mood ? moodValue[current.mood] : null, points: days.map((d) => ({ date: d.date, label: d.date.slice(5), value: d.mood ? moodValue[d.mood] : null })), description: "Emotional tone" },
    { key: "energy", label: "Energy", value: current?.energy ?? null, points: point("energy"), description: "How charged you felt" },
    { key: "stress", label: "Stress", value: current?.stress ?? null, points: point("stress"), description: "Pressure you noticed", inverse: true },
    { key: "productivity", label: "Productivity", value: current?.productivity ?? null, points: point("productivity"), description: "Useful progress" },
    { key: "social", label: "Social", value: current?.social ?? null, points: point("social"), description: "Connection and interaction" },
    { key: "sleep", label: "Sleep", value: current?.sleep ?? null, points: point("sleep"), description: "Sleep quality" },
    { key: "plans", label: "Plans", value: current?.planTotal ? Math.round((current.planDone / current.planTotal) * 5) : null, points: planPoints, description: "Intentions completed" },
  ];
  const radarMetrics = metrics.slice(0, 6);
  const recorded = metrics.filter((m) => m.value != null).length;
  const average = recorded ? metrics.reduce((sum, m) => sum + normalize(m.value, m.inverse), 0) / recorded : 0;
  return (
    <section className="space-y-4 motion-stagger">
      <div className="section-heading">
        <div><p className="eyebrow">Your daily pulse</p><h2>See the shape of your day</h2><p>Quick visual feedback without turning your journal into a spreadsheet.</p></div>
        <span className="pill">{recorded}/7 tracked</span>
      </div>
      <div className="grid gap-4 xl:grid-cols-[.85fr_1.15fr]">
        <div className="card chart-hero">
          <div><p className="text-sm font-semibold">Today's balance</p><p className="mt-1 text-sm text-[var(--muted)]">{recorded ? `${average.toFixed(1)} / 5 overall signal` : "Add a few ratings to reveal your pattern."}</p></div>
          <Radar metrics={radarMetrics} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {metrics.map((m) => <div key={m.key} className="metric-card card">
            <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{m.label}</p><p className="mt-1 text-xs text-[var(--muted)]">{m.description}</p></div><strong className="metric-value">{m.value == null ? "—" : `${m.value}/5`}</strong></div>
            <Sparkline points={m.points} inverse={m.inverse} />
          </div>)}
        </div>
      </div>
    </section>
  );
}
