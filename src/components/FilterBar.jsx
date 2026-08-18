import { SlidersHorizontal, X } from "lucide-react";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const statusDotStyles = {
  todo: "bg-sky-500",
  "in-progress": "bg-amber-500",
  done: "bg-emerald-500",
};

const priorityOptions = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const priorityDotStyles = {
  high: "bg-rose-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

function SegmentControl({ options, value, onChange, dotStyles }) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              isActive
                ? "bg-white text-violet-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-violet-300 dark:ring-white/10"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
          >
            {option.value !== "all" && (
              <span
                className={`h-1.5 w-1.5 rounded-full ${dotStyles[option.value]}`}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function FilterBar({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  label,
  onLabelChange,
  labels = [],
  onReset,
  hasActiveFilters = false,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
        <SlidersHorizontal className="h-4 w-4" />
        Filter
      </span>

      <SegmentControl
        options={statusOptions}
        value={status}
        onChange={onStatusChange}
        dotStyles={statusDotStyles}
      />

      <SegmentControl
        options={priorityOptions}
        value={priority}
        onChange={onPriorityChange}
        dotStyles={priorityDotStyles}
      />

      {labels.length > 0 && (
        <select
          value={label}
          onChange={(event) => onLabelChange(event.target.value)}
          aria-label="Filter by label"
          className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 shadow-sm outline-none transition-all focus:border-violet-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
        >
          <option value="all">All labels</option>
          {labels.map((labelOption) => (
            <option key={labelOption} value={labelOption}>
              {labelOption}
            </option>
          ))}
        </select>
      )}

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-200"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}

export default FilterBar;
