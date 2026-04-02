import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import GlassCard from "./GlassCard.jsx";

const barGradientId = "featureBarGradient";
const activeBarGradientId = "featureBarGradientActive";
const barGlowId = "featureBarGlow";

const TooltipContent = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const dataPoint = payload[0]?.payload;

  return (
    <div className="scale-in rounded-2xl border border-cyan-400/25 bg-slate-950/90 px-4 py-3 text-xs shadow-2xl shadow-cyan-500/15 backdrop-blur-xl">
      <p className="font-bold tracking-wide text-cyan-300">{dataPoint.featureName}</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-lg font-bold text-white">{dataPoint.clicks.toLocaleString()}</span>
        <span className="text-slate-400">clicks</span>
      </div>
    </div>
  );
};

function FeatureBarChart({ data, selectedFeature, onBarClick }) {
  return (
    <GlassCard
      title="Feature Usage"
      subtitle="Select a bar to drill into the time-series trend for that signal."
      className="fade-up"
    >
      <div className="h-[340px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-indigo-300/25 bg-indigo-500/5">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 p-2.5">
              <svg className="h-full w-full text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No feature interactions found</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Try adjusting your filters</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 12, right: 10, left: -10, bottom: 18 }} barSize={36}>
              <defs>
                <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.95} />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id={activeBarGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e879f9" stopOpacity={1} />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.85} />
                </linearGradient>
                <filter id={barGlowId}>
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid strokeDasharray="3 6" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
              <XAxis
                dataKey="featureName"
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                axisLine={{ stroke: "rgba(129, 140, 248, 0.2)" }}
                tickLine={false}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={62}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip cursor={{ fill: "rgba(129, 140, 248, 0.08)", radius: 8 }} content={<TooltipContent />} />
              <Bar
                dataKey="clicks"
                radius={[14, 14, 4, 4]}
                onClick={(payload) => onBarClick(payload?.featureName)}
                cursor="pointer"
                animationDuration={900}
                animationEasing="ease-out"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.featureName}
                    fill={`url(#${entry.featureName === selectedFeature ? activeBarGradientId : barGradientId})`}
                    stroke={entry.featureName === selectedFeature ? "rgba(232, 121, 249, 0.6)" : "transparent"}
                    strokeWidth={entry.featureName === selectedFeature ? 2 : 0}
                    filter={entry.featureName === selectedFeature ? `url(#${barGlowId})` : undefined}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </GlassCard>
  );
}

export default FeatureBarChart;