function GlassCard({ title, subtitle, action, className = "", children }) {
  return (
    <section className={`glass-card p-5 md:p-6 ${className}`}>
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-cyan-400/10 blur-[60px]" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-gradient-to-tr from-cyan-400/15 via-indigo-500/10 to-transparent blur-[50px]" />

      {(title || subtitle || action) && (
        <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl space-y-1.5">
            {title ? (
              <h2 className="fintech-title flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 pulse-glow" />
                {title}
              </h2>
            ) : null}
            {subtitle ? <p className="panel-subtitle">{subtitle}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      )}
      {children}
    </section>
  );
}

export default GlassCard;