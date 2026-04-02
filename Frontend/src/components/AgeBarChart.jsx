import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GlassCard from "./GlassCard.jsx";

const TooltipContent = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const dataPoint = payload[0]?.payload;

  return (
    <div className="scale-in rounded-2xl border border-purple-400/25 bg-slate-950/90 px-4 py-3 text-xs shadow-2xl shadow-purple-500/15 backdrop-blur-xl">
      <p className="font-bold tracking-wide text-purple-300">Age: {dataPoint.ageGroup}</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-lg font-bold text-white">{dataPoint.clicks.toLocaleString()}</span>
        <span className="text-slate-400">clicks</span>
      </div>
    </div>
  );
};

function AgeBarChart({ data, onBarClick }) {
  return (
    <GlassCard title="Age Distribution" className="fade-up h-full">
      <div className="h-[280px] w-full">
        {(!data || data.length === 0) ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-indigo-300/25 bg-indigo-500/5">
           <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No demographic data</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }} barSize={24}>
              <defs>
                <linearGradient id="ageBarGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#d946ef" stopOpacity={0.9} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 6" stroke="rgba(148, 163, 184, 0.15)" horizontal={false} />
              
              <XAxis 
                type="number" 
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              
              <YAxis 
                dataKey="ageGroup" 
                type="category"
                tick={{ fontSize: 12, fill: "#cbd5e1", fontWeight: 600 }}
                axisLine={{ stroke: "rgba(168, 85, 247, 0.2)" }}
                tickLine={false}
              />
              
              <Tooltip cursor={{ fill: "rgba(168, 85, 247, 0.06)", radius: 8 }} content={<TooltipContent />} />
              
              <Bar 
                dataKey="clicks" 
                radius={[4, 12, 12, 4]}
                cursor="pointer"
                onClick={() => onBarClick?.()}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {data.map((entry) => (
                  <Cell 
                    key={entry.ageGroup} 
                    fill={`url(#ageBarGradient)`}
                    stroke="rgba(217, 70, 239, 0.4)"
                    strokeWidth={1}
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

export default AgeBarChart;
