import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import GlassCard from "./GlassCard.jsx";

const trendAreaGradientId = "trendAreaGradient";
const trendLineGradientId = "trendLineGradient";

const formatBucketTick = (value, interval) => {
  if (!value) {
    return "";
  }

  if (interval === "hour") {
    const [datePart, timePart] = value.split(" ");
    return `${datePart.slice(5)} ${timePart}`;
  }

  return value.slice(5);
};

const TooltipContent = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0]?.payload;

  return (
    <div className="scale-in rounded-2xl border border-indigo-400/25 bg-slate-950/90 px-4 py-3 text-xs shadow-2xl shadow-indigo-500/15 backdrop-blur-xl">
      <p className="font-bold tracking-wide text-indigo-300">{point.bucket}</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-lg font-bold text-white">{point.clicks.toLocaleString()}</span>
        <span className="text-slate-400">clicks</span>
      </div>
    </div>
  );
};

const CustomDot = (props) => {
  const { cx, cy, index } = props;
  if (index % 3 !== 0) return null;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill="#a855f7"
      stroke="#1e293b"
      strokeWidth={1.5}
      style={{ filter: "drop-shadow(0 0 3px rgba(168, 85, 247, 0.5))" }}
    />
  );
};

const CustomActiveDot = (props) => {
  const { cx, cy } = props;

  return (
    <g>
      <circle cx={cx} cy={cy} r={12} fill="rgba(34, 211, 238, 0.12)" />
      <circle cx={cx} cy={cy} r={7} fill="rgba(34, 211, 238, 0.2)" stroke="rgba(34, 211, 238, 0.6)" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={3.5} fill="#22d3ee" stroke="#0f172a" strokeWidth={1.5} />
    </g>
  );
};

function TrendLineChart({ data, selectedFeature, interval, onChartClick }) {
  return (
    <GlassCard
      title="Time Trend"
      subtitle={
        selectedFeature
          ? `Trend for "${selectedFeature}" · ${interval} interval`
          : `All feature interactions over time · ${interval} interval`
      }
    >
      <div className="h-[340px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-indigo-300/25 bg-indigo-500/5">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 p-2.5">
              <svg className="h-full w-full text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No trend data available</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Try adjusting your filters</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 12, right: 10, left: -10, bottom: 18 }}>
              <defs>
                <linearGradient id={trendAreaGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                  <stop offset="40%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id={trendLineGradientId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 6" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
              <XAxis
                dataKey="bucket"
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                axisLine={{ stroke: "rgba(129, 140, 248, 0.2)" }}
                tickLine={false}
                tickFormatter={(value) => formatBucketTick(value, interval)}
                minTickGap={16}
                height={62}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ stroke: "rgba(99, 102, 241, 0.4)", strokeWidth: 1, strokeDasharray: "4 4" }}
                content={<TooltipContent />}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke={`url(#${trendLineGradientId})`}
                strokeWidth={2.5}
                fill={`url(#${trendAreaGradientId})`}
                dot={<CustomDot />}
                activeDot={<CustomActiveDot />}
                cursor="pointer"
                onClick={() => onChartClick?.()}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </GlassCard>
  );
}

export default TrendLineChart;