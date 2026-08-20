import { Search, X } from "lucide-react";

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
    <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              isActive
                ? "bg-white text-violet-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-violet-300 dark:ring-white/10"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
          >
            {option.value !== "all" && (
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotStyles[option.value]}`}
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
  open,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  label,
  onLabelChange,
  labels = [],
  onReset,
  hasActiveFilters = false,
  searchTerm,
  onSearchChange,
}) {
  return (
    <div
      className="grid transition-all duration-300 ease-in-out"
      style={{
        gridTemplateRows: open ? "1fr" : "0fr",
        opacity: open ? 1 : 0,
      }}
    >
      <div className="overflow-hidden">
        <div className="flex flex-wrap items-end gap-6 rounded-2xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
          {/* Search */}
          <div className="w-64 shrink-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Search
            </p>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search tasks..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Status */}
          <div className="shrink-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Status
            </p>
            <SegmentControl
              options={statusOptions}
              value={status}
              onChange={onStatusChange}
              dotStyles={statusDotStyles}
            />
          </div>

          {/* Priority */}
          <div className="shrink-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Priority
            </p>
            <SegmentControl
              options={priorityOptions}
              value={priority}
              onChange={onPriorityChange}
              dotStyles={priorityDotStyles}
            />
          </div>

          {/* Labels */}
          {labels.length > 0 && (
            <div className="shrink-0">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Label
              </p>
              <select
                value={label}
                onChange={(event) => onLabelChange(event.target.value)}
                aria-label="Filter by label"
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 shadow-sm outline-none transition-all focus:border-violet-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">All labels</option>
                {labels.map((labelOption) => (
                  <option key={labelOption} value={labelOption}>
                    {labelOption}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Clear */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="flex shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
