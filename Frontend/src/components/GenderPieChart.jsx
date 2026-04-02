import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import GlassCard from "./GlassCard.jsx";

const COLORS = {
  Male: "url(#maleGradient)",
  Female: "url(#femaleGradient)",
  Other: "url(#otherGradient)"
};

const STROKES = {
  Male: "rgba(34, 211, 238, 0.4)",
  Female: "rgba(232, 121, 249, 0.4)",
  Other: "rgba(129, 140, 248, 0.4)"
};

const TooltipContent = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const dataPoint = payload[0]?.payload;

  return (
    <div className="scale-in rounded-2xl border border-indigo-400/25 bg-slate-950/90 px-4 py-3 text-xs shadow-2xl shadow-indigo-500/15 backdrop-blur-xl">
      <p className="font-bold tracking-wide text-indigo-300">{dataPoint.gender}</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-lg font-bold text-white">{dataPoint.clicks.toLocaleString()}</span>
        <span className="text-slate-400">clicks</span>
      </div>
    </div>
  );
};

function GenderPieChart({ data, onSliceClick }) {
  return (
    <GlassCard title="Gender Distribution" className="fade-up h-full">
      <div className="flex h-[280px] w-full flex-col">
        {(!data || data.length === 0) ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-indigo-300/25 bg-indigo-500/5">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No demographic data</p>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="maleGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="femaleGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#e879f9" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#c026d3" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="otherGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<TooltipContent />} />
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="clicks"
                    nameKey="gender"
                    stroke="none"
                    cursor="pointer"
                    onClick={() => onSliceClick?.()}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {data.map((entry) => (
                      <Cell
                        key={entry.gender}
                        fill={COLORS[entry.gender] || COLORS.Other}
                        stroke={STROKES[entry.gender] || STROKES.Other}
                        strokeWidth={1.5}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend */}
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              {data.map((entry) => {
                const colors = {
                   Male: "bg-cyan-400 border-cyan-500",
                   Female: "bg-fuchsia-400 border-fuchsia-500",
                   Other: "bg-indigo-400 border-indigo-500"
                };
                return (
                  <div key={entry.gender} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <span className={`h-3 w-3 rounded-full border ${colors[entry.gender] || colors.Other}`} />
                    {entry.gender}
                    <span className="text-slate-400 ml-1">
                      ({Math.round((entry.clicks / data.reduce((acc, curr) => acc + curr.clicks, 0)) * 100)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </GlassCard>
  );
}

export default GenderPieChart;
