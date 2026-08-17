import { Search } from "lucide-react";

function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full md:w-80">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search tasks..."
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
      />
    </div>
  );
}

export default SearchBar;
