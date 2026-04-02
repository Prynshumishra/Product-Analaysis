function SkeletonChart() {
  return (
    <div className="glass-card p-5 md:p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="skeleton-shimmer h-2 w-2 rounded-full" />
          <div className="skeleton-shimmer h-4 w-36 rounded-full" />
        </div>
        <div className="skeleton-shimmer h-3 w-56 rounded-full" />
        <div className="h-[340px] rounded-2xl border border-indigo-300/10 bg-slate-900/15 p-5 dark:bg-slate-900/30">
          <div className="flex h-full items-end gap-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="skeleton-shimmer w-full rounded-xl"
                style={{
                  height: `${20 + ((index * 41 + 17) % 70)}%`,
                  animationDelay: `${index * 120}ms`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonChart;