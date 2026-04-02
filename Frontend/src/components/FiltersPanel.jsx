import GlassCard from "./GlassCard.jsx";
import { RotateCcw, CalendarDays, Users, UserCircle, Radio } from "lucide-react";

function FiltersPanel({ filters, onFilterChange, onReset, trackingFeature }) {
  return (
    <GlassCard
      title="Signal Filters"
      subtitle="Filters persist in cookies and restore automatically on refresh."
      className="fade-up"
      action={
        <button
          type="button"
          onClick={onReset}
          className="btn-ghost group text-xs"
        >
          <RotateCcw size={13} className="transition-transform duration-300 group-hover:-rotate-180" />
          Reset all
        </button>
      }
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="filter-field">
          <label className="field-label flex items-center gap-1.5" htmlFor="startDate">
            <CalendarDays size={12} className="text-indigo-500 dark:text-indigo-300" />
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            className="field"
            value={filters.startDate}
            onChange={(event) => onFilterChange("startDate", event.target.value)}
          />
        </div>

        <div className="filter-field">
          <label className="field-label flex items-center gap-1.5" htmlFor="endDate">
            <CalendarDays size={12} className="text-indigo-500 dark:text-indigo-300" />
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            className="field"
            value={filters.endDate}
            onChange={(event) => onFilterChange("endDate", event.target.value)}
          />
        </div>

        <div className="filter-field">
          <label className="field-label flex items-center gap-1.5" htmlFor="ageGroup">
            <Users size={12} className="text-purple-500 dark:text-purple-300" />
            Age Group
          </label>
          <select
            id="ageGroup"
            className="field"
            value={filters.ageGroup}
            onChange={(event) => onFilterChange("ageGroup", event.target.value)}
          >
            <option value="all">All Ages</option>
            <option value="<18">&lt;18</option>
            <option value="18-40">18-40</option>
            <option value=">40">&gt;40</option>
          </select>
        </div>

        <div className="filter-field">
          <label className="field-label flex items-center gap-1.5" htmlFor="gender">
            <UserCircle size={12} className="text-fuchsia-500 dark:text-fuchsia-300" />
            Gender
          </label>
          <select
            id="gender"
            className="field"
            value={filters.gender}
            onChange={(event) => onFilterChange("gender", event.target.value)}
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-medium">
        <span
          className={`chip transition duration-200 ${
            trackingFeature
              ? "border-cyan-300 text-cyan-700"
              : ""
          }`}
        >
          <Radio size={11} className={trackingFeature ? "pulse-glow" : ""} />
          {trackingFeature ? `Tracking: ${trackingFeature}` : "Tracking armed for all events"}
        </span>
      </div>
    </GlassCard>
  );
}

export default FiltersPanel;