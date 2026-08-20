import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

const columnAccents = {
  todo: {
    dot: "bg-sky-500",
    badge:
      "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
    ring: "ring-sky-400/60",
  },
  "in-progress": {
    dot: "bg-amber-500",
    badge:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    ring: "ring-amber-400/60",
  },
  done: {
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    ring: "ring-emerald-400/60",
  },
};

function KanbanColumn({
  id,
  title,
  tasks,
  highlightedTaskId,
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const accent = columnAccents[id] ?? columnAccents.todo;

  return (
    <section
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl border p-4 transition-all duration-200 ${
        isOver
          ? `border-transparent bg-white ring-2 ${accent.ring} dark:bg-white/[0.05]`
          : "border-slate-200/70 bg-white/60 dark:border-white/10 dark:bg-white/[0.02]"
      }`}
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          <span className={`h-2 w-2 rounded-full ${accent.dot}`} />
          {title}
        </h2>

        <span
          key={tasks.length}
          className={`animate-pop rounded-full px-2.5 py-0.5 text-xs font-semibold ${accent.badge}`}
        >
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <div
          className={`flex min-h-24 flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition-colors ${
            isOver
              ? "border-violet-400 bg-violet-50/60 dark:bg-violet-500/10"
              : "border-slate-300/80 dark:border-white/10"
          }`}
        >
          <p
            className={`text-xs font-medium ${
              isOver
                ? "text-violet-600 dark:text-violet-300"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            Drop tasks here
          </p>
        </div>
      ) : (
        <div className="min-h-20 flex-1 space-y-3">
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              highlighted={task.id === highlightedTaskId}
            />
          ))}
          </SortableContext>
        </div>
      )}

    </section>
  );
}

export default KanbanColumn;
