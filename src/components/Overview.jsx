import {
  CheckCircle2,
  CircleDashed,
  Flag,
  ListTodo,
  Timer,
} from "lucide-react";

function Overview({ tasks, onGoToBoard }) {
  const byStatus = { todo: 0, "in-progress": 0, done: 0 };
  const byPriority = { high: 0, medium: 0, low: 0 };

  for (const task of tasks) {
    byStatus[task.status] = (byStatus[task.status] ?? 0) + 1;
    byPriority[task.priority] = (byPriority[task.priority] ?? 0) + 1;
  }

  const total = tasks.length;

  const stats = [
    {
      label: "Total tasks",
      value: total,
      icon: ListTodo,
      tint: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-500/10",
    },
    {
      label: "Todo",
      value: byStatus.todo,
      icon: CircleDashed,
      tint: "text-sky-500",
      bg: "bg-sky-50 dark:bg-sky-500/10",
    },
    {
      label: "In Progress",
      value: byStatus["in-progress"],
      icon: Timer,
      tint: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      label: "Done",
      value: byStatus.done,
      icon: CheckCircle2,
      tint: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
  ];

  const priorityRows = [
    { label: "High", value: byPriority.high, bar: "bg-rose-500" },
    { label: "Medium", value: byPriority.medium, bar: "bg-amber-500" },
    { label: "Low", value: byPriority.low, bar: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A quick look at your workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToBoard}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98]"
        >
          Open board
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5 dark:border-white/10 dark:bg-white/[0.03] dark:hover:shadow-black/30"
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <Icon className={`h-5 w-5 ${stat.tint}`} />
              </div>

              <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {stat.value}
              </p>

              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Priority breakdown
        </h3>

        <div className="space-y-4">
          {priorityRows.map((row) => {
            const pct = total ? Math.round((row.value / total) * 100) : 0;

            return (
              <div key={row.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                    <Flag className="h-3.5 w-3.5 text-slate-400" />
                    {row.label}
                    <span className="text-slate-400">({row.value})</span>
                  </span>
                  <span className="text-xs text-slate-400">{pct}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${row.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Overview;
