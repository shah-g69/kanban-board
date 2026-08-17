import { useState } from "react";
import { CalendarDays, Flag, Pencil, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTasks } from "../Hooks/useTasks";
import { getDueDateInfo, getDueProgress } from "../utils/dueDate";
import TaskModal from "./TaskModal";

const priorityStyles = {
  high: {
    badge:
      "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    flag: "text-rose-500",
  },
  medium: {
    badge:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    flag: "text-amber-500",
  },
  low: {
    badge:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    flag: "text-emerald-500",
  },
};

function TaskCard({
  task,
  disableEntranceAnimation = false,
  highlighted = false,
}) {
  const { deleteTask, updateTask } = useTasks();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const priorityStyle = priorityStyles[task.priority] ?? priorityStyles.medium;
  const isDone = task.status === "done";
  const dueDateInfo = task.dueDate
    ? getDueDateInfo(task.dueDate, isDone)
    : null;
  const dueBar =
    task.dueDate && !isDone ? getDueProgress(task.dueDate) : null;

  function handleUpdate(updatedData) {
    updateTask(task.id, updatedData);
    setIsEditModalOpen(false);
  }

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmed) {
      deleteTask(task.id);
    }
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        data-task-id={task.id}
        className={`group cursor-grab rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-slate-900/5 active:cursor-grabbing dark:border-white/10 dark:bg-slate-900 dark:hover:border-violet-500/30 dark:hover:shadow-black/40 ${
          isDragging ? "rotate-1 opacity-50" : ""
        } ${disableEntranceAnimation ? "" : "animate-card-in"} ${
          highlighted ? "animate-flash" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium leading-snug text-slate-800 dark:text-slate-100">
            {task.title}
          </h3>

          <div className="flex shrink-0 gap-1 md:opacity-0 md:transition-opacity md:duration-150 md:group-hover:opacity-100">
            <button
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-violet-600 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-violet-300"
              title="Edit task"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              onPointerDown={(event) => event.stopPropagation()}
              onClick={handleDelete}
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
              title="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="mt-1.5 text-sm leading-5 text-slate-500 dark:text-slate-400">
            {task.description}
          </p>
        )}

        {task.labels.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {task.labels.map((label) => (
              <span
                key={label}
                className="rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium capitalize ${priorityStyle.badge}`}
          >
            <Flag className={`h-3 w-3 ${priorityStyle.flag}`} />
            {task.priority}
          </span>

          {dueDateInfo && (
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${dueDateInfo.className}`}
              title={task.dueDate}
            >
              <CalendarDays className="h-3 w-3" />
              {dueDateInfo.label}
            </span>
          )}
        </div>

        {dueBar && (
          <div
            className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"
            title={dueDateInfo.label}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${dueBar.barClass}`}
              style={{ width: `${dueBar.pct}%` }}
            />
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <TaskModal
          key={task.id}
          onClose={() => setIsEditModalOpen(false)}
          onCreate={handleUpdate}
          initialTask={task}
          isEditing
        />
      )}
    </>
  );
}

export default TaskCard;
