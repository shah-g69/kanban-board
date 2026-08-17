import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Flag,
  ListTodo,
  Timer,
} from "lucide-react";
import { getDueDateInfo } from "../utils/dueDate";

const statusDotStyles = {
  todo: "bg-sky-500",
  "in-progress": "bg-amber-500",
  done: "bg-emerald-500",
};

function Overview({
  tasks,
  onGoToBoard,
  onSelectStatus,
  onSelectPriority,
  onFocusTask,
}) {
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
      status: "all",
    },
    {
      label: "Todo",
      value: byStatus.todo,
      icon: CircleDashed,
      tint: "text-sky-500",
      bg: "bg-sky-50 dark:bg-sky-500/10",
      status: "todo",
    },
    {
      label: "In Progress",
      value: byStatus["in-progress"],
      icon: Timer,
      tint: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      status: "in-progress",
    },
    {
      label: "Done",
      value: byStatus.done,
      icon: CheckCircle2,
      tint: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      status: "done",
    },
  ];

  const upcomingDeadlines = tasks
    .filter((task) => task.dueDate)
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5);

  const priorityRows = [
    {
      label: "High",
      value: byPriority.high,
      bar: "bg-rose-500",
      flag: "text-rose-500",
      priority: "high",
    },
    {
      label: "Medium",
      value: byPriority.medium,
      bar: "bg-amber-500",
      flag: "text-amber-500",
      priority: "medium",
    },
    {
      label: "Low",
      value: byPriority.low,
      bar: "bg-emerald-500",
      flag: "text-emerald-500",
      priority: "low",
    },
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
            <button
              key={stat.label}
              type="button"
              onClick={() => onSelectStatus(stat.status)}
              className="group rounded-2xl border border-slate-200/70 bg-white/70 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-slate-900/5 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-violet-500/30 dark:hover:shadow-black/30"
              title={`View ${stat.label} tasks`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
                >
                  <Icon className={`h-5 w-5 ${stat.tint}`} />
                </div>

                <ArrowRight className="h-4 w-4 text-violet-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
              </div>

              <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {stat.value}
              </p>

              <p className="mt-1 text-sm font-medium text-slate-500 transition-colors group-hover:text-violet-600 dark:text-slate-400 dark:group-hover:text-violet-300">
                {stat.label}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Upcoming deadlines
          </h3>

          {upcomingDeadlines.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">
              No deadlines set yet — add a due date to a task to see it here.
            </p>
          ) : (
            <ul className="space-y-1">
              {upcomingDeadlines.map((task) => {
                const info = getDueDateInfo(
                  task.dueDate,
                  task.status === "done"
                );

                return (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => onFocusTask(task.id)}
                      title="Open task on board"
                      className="group flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            statusDotStyles[task.status] ?? "bg-slate-400"
                          }`}
                        />
                        <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                          {task.title}
                        </span>
                      </span>

                      <span className="flex shrink-0 items-center gap-1.5">
                        <ArrowRight className="h-3.5 w-3.5 text-violet-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${info.className}`}
                          title={task.dueDate}
                        >
                          <CalendarDays className="h-3 w-3" />
                          {info.label}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Priority breakdown
          </h3>

        <div className="space-y-4">
          {priorityRows.map((row) => {
            const pct = total ? Math.round((row.value / total) * 100) : 0;

            return (
              <button
                key={row.label}
                type="button"
                onClick={() => onSelectPriority(row.priority)}
                className="group -m-1.5 w-[calc(100%+12px)] rounded-xl p-1.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                title={`View ${row.label} priority tasks`}
              >
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                    <Flag className={`h-3.5 w-3.5 ${row.flag}`} />
                    {row.label}
                    <span className="text-slate-400">({row.value})</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    {pct}%
                    <ArrowRight className="h-3 w-3 text-violet-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${row.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
