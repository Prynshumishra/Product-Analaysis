import { Activity, LogOut, MoonStar, Sparkles, Sun, ChevronRight } from "lucide-react";

function TopBar({ user, selectedFeature, onLogout, theme, onToggleTheme }) {
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(new Date());

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  return (
    <header className="glass-card fade-up p-5 md:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        {/* Left section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="chip">
              <Sparkles size={12} className="pulse-glow" />
              Advanced Analytics
            </span>
            <span className="chip">
              <Activity size={12} />
              Live
            </span>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {greeting}, <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.username}</span>
            </p>
            <h1 className="fintech-title text-2xl md:text-3xl">
              <span className="text-gradient">Product Intelligence</span>
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Gain actionable insights, monitor user behavior, and analyze product performance in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
            <span className="chip">
              Snapshot: {todayLabel}
            </span>
            {selectedFeature ? (
              <span className="chip slide-in-right">
                <ChevronRight size={11} />
                Focus: {selectedFeature}
              </span>
            ) : null}
          </div>
        </div>

        {/* Right section — actions */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          <button
            type="button"
            onClick={onToggleTheme}
            className="btn-ghost"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={16} /> : <MoonStar size={16} />}
            <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="btn-primary"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopBar;