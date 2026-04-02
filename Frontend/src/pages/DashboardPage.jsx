import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Activity, Gauge, Layers3, Sparkles, TrendingUp, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeatureBarChart from "../components/FeatureBarChart.jsx";
import GenderPieChart from "../components/GenderPieChart.jsx";
import AgeBarChart from "../components/AgeBarChart.jsx";
import FiltersPanel from "../components/FiltersPanel.jsx";
import SkeletonChart from "../components/SkeletonChart.jsx";
import TopBar from "../components/TopBar.jsx";
import TrendLineChart from "../components/TrendLineChart.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCookieFilters } from "../hooks/useCookieFilters.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { useThemeMode } from "../hooks/useThemeMode.js";
import { getAnalyticsData, trackFeatureEvent } from "../services/analyticsService.js";

const interactionMap = {
  startDate: "date_filter",
  endDate: "date_filter",
  ageGroup: "age_filter",
  gender: "gender_filter"
};

const chartInteractionMap = {
  feature: "bar_chart_click",
  trend: "trend_chart_click",
  gender: "gender_chart_click",
  age: "age_chart_click"
};

const metricAccents = [
  {
    gradient: "from-cyan-500/30 via-cyan-400/10 to-transparent",
    iconColor: "text-cyan-600 dark:text-cyan-300",
    iconBg: "bg-cyan-500/10 border-cyan-400/20"
  },
  {
    gradient: "from-indigo-500/30 via-indigo-400/10 to-transparent",
    iconColor: "text-indigo-600 dark:text-indigo-300",
    iconBg: "bg-indigo-500/10 border-indigo-400/20"
  },
  {
    gradient: "from-purple-500/30 via-purple-400/10 to-transparent",
    iconColor: "text-purple-600 dark:text-purple-300",
    iconBg: "bg-purple-500/10 border-purple-400/20"
  },
  {
    gradient: "from-fuchsia-500/25 via-violet-400/10 to-transparent",
    iconColor: "text-fuchsia-600 dark:text-fuchsia-300",
    iconBg: "bg-fuchsia-500/10 border-fuchsia-400/20"
  }
];

function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useThemeMode();
  const { filters, updateFilter, resetFilters } = useCookieFilters();
  const debouncedFilters = useDebounce(filters, 450);
  const hasTrackedOpenRef = useRef(false);

  const [selectedFeature, setSelectedFeature] = useState("");
  const [analyticsData, setAnalyticsData] = useState({
    featureTotals: [],
    timeSeries: [],
    genderDistribution: [],
    ageDistribution: [],
    filtersApplied: {
      interval: "day"
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [trackingFeature, setTrackingFeature] = useState("");

  const queryParams = useMemo(
    () => ({
      startDate: debouncedFilters.startDate,
      endDate: debouncedFilters.endDate,
      ageGroup: debouncedFilters.ageGroup,
      gender: debouncedFilters.gender,
      featureName: selectedFeature || undefined
    }),
    [debouncedFilters, selectedFeature]
  );

  const refreshAnalyticsSilently = useCallback(async () => {
    try {
      const response = await getAnalyticsData(queryParams);
      setAnalyticsData(response);
    } catch {
      // Keep existing visual state when a silent refresh fails.
    }
  }, [queryParams]);

  const sendTrackingEvent = useCallback(async (featureName, options = {}) => {
    const { refreshAfterTrack = false } = options;
    setTrackingFeature(featureName);

    try {
      await trackFeatureEvent(featureName);

      if (refreshAfterTrack) {
        await refreshAnalyticsSilently();
      }
    } catch {
      // Tracking failures should not block user interactions.
    } finally {
      setTrackingFeature("");
    }
  }, [refreshAnalyticsSilently]);

  const dashboardMetrics = useMemo(() => {
    const totalClicks = analyticsData.featureTotals.reduce((sum, entry) => sum + entry.clicks, 0);
    const activeFeatures = analyticsData.featureTotals.length;
    const trendBuckets = analyticsData.timeSeries.length;

    return [
      {
        label: "Total Interactions",
        value: isLoading ? "—" : totalClicks.toLocaleString(),
        caption: "Aggregated within selected date range",
        icon: Activity,
        ...metricAccents[0]
      },
      {
        label: "Features Analyzed",
        value: isLoading ? "—" : activeFeatures.toLocaleString(),
        caption: "Features actively engaged by users",
        icon: Layers3,
        ...metricAccents[1]
      },
      {
        label: "Data Points",
        value: isLoading ? "—" : trendBuckets.toLocaleString(),
        caption: "Temporal segments within the interval",
        icon: Gauge,
        ...metricAccents[2]
      },
      {
        label: "Active Focus",
        value: selectedFeature || "All",
        caption: selectedFeature ? "Viewing detailed metrics" : "Displaying overall metrics",
        icon: Sparkles,
        ...metricAccents[3]
      }
    ];
  }, [analyticsData.featureTotals, analyticsData.timeSeries, isLoading, selectedFeature]);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getAnalyticsData(queryParams);
      setAnalyticsData(response);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Unable to load analytics data.");
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (hasTrackedOpenRef.current) {
      return;
    }

    hasTrackedOpenRef.current = true;
    void sendTrackingEvent("dashboard_open");
  }, [sendTrackingEvent]);

  const handleFilterChange = (field, value) => {
    updateFilter(field, value);
    const interactionName = interactionMap[field];

    if (interactionName) {
      void sendTrackingEvent(interactionName);
    }
  };

  const handleBarClick = async (featureName) => {
    if (!featureName) {
      return;
    }

    await sendTrackingEvent(chartInteractionMap.feature);
    setSelectedFeature(featureName);
  };

  const handleTrendChartClick = () => {
    void sendTrackingEvent(chartInteractionMap.trend, { refreshAfterTrack: true });
  };

  const handleGenderChartClick = () => {
    void sendTrackingEvent(chartInteractionMap.gender, { refreshAfterTrack: true });
  };

  const handleAgeChartClick = () => {
    void sendTrackingEvent(chartInteractionMap.age, { refreshAfterTrack: true });
  };

  const handleResetFilters = () => {
    resetFilters();
    setSelectedFeature("");
    void sendTrackingEvent("date_filter");
    void sendTrackingEvent("age_filter");
    void sendTrackingEvent("gender_filter");
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="relative mx-auto w-full max-w-[1360px] px-4 pb-10 pt-6 md:px-6 md:py-8 lg:px-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-20 top-4 h-56 w-56 rounded-full bg-cyan-500/15 blur-[80px]" />
      <div className="pointer-events-none absolute -right-10 top-20 h-72 w-72 rounded-full bg-indigo-500/[0.12] blur-[80px]" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[80px]" />

      <div className="relative z-10 space-y-6">
        <TopBar
          user={user}
          selectedFeature={selectedFeature}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Metric Cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 stagger-children">
          {dashboardMetrics.map((metric, index) => {
            const Icon = metric.icon;

            return (
              <article
                key={metric.label}
                className="glass-card glass-card-hover fade-up group p-5"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100`} />

                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    {metric.label}
                  </p>
                  <span className={`inline-flex rounded-xl border ${metric.iconBg} p-2 ${metric.iconColor}`}>
                    <Icon size={16} />
                  </span>
                </div>

                <p className="counter-up mt-3 stat-value text-2xl md:text-[30px]" style={{ animationDelay: `${index * 80 + 200}ms` }}>
                  {metric.value}
                </p>

                <div className="mt-2 flex items-center gap-1.5">
                  <ArrowUpRight size={12} className="text-emerald-500 dark:text-emerald-400" />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{metric.caption}</p>
                </div>
              </article>
            );
          })}
        </section>

        <FiltersPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          trackingFeature={trackingFeature}
        />

        {errorMessage ? (
          <section className="glass-card scale-in rounded-2xl border-rose-400/30 bg-rose-500/[0.08] p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-xl bg-rose-500/15 p-2">
                <TrendingUp size={16} className="text-rose-500 dark:text-rose-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-200">Data fetch failed</p>
                <p className="mt-0.5 text-xs text-rose-600 dark:text-rose-300">{errorMessage}</p>
                <button
                  type="button"
                  className="mt-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-rose-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/30"
                  onClick={() => {
                    void fetchAnalytics();
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          </section>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3">
            {isLoading ? (
              <SkeletonChart />
            ) : (
              <FeatureBarChart
                data={analyticsData.featureTotals}
                selectedFeature={selectedFeature}
                onBarClick={handleBarClick}
              />
            )}
          </div>

          <div className="xl:col-span-2">
            {isLoading ? (
              <SkeletonChart />
            ) : (
              <TrendLineChart
                data={analyticsData.timeSeries}
                selectedFeature={selectedFeature}
                interval={analyticsData.filtersApplied?.interval || "day"}
                onChartClick={handleTrendChartClick}
              />
            )}
          </div>
        </section>

        {/* Demographic Insights */}
        <section className="grid gap-6 xl:grid-cols-2">
          {isLoading ? (
            <SkeletonChart />
          ) : (
            <GenderPieChart
              data={analyticsData.genderDistribution}
              onSliceClick={handleGenderChartClick}
            />
          )}

          {isLoading ? (
            <SkeletonChart />
          ) : (
            <AgeBarChart
              data={analyticsData.ageDistribution}
              onBarClick={handleAgeChartClick}
            />
          )}
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;