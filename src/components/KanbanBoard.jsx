import { useContext, useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  defaultDropAnimation,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { Plus, SlidersHorizontal } from "lucide-react";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import FilterBar from "./FilterBar";
import EmptyState from "./EmptyState";
import { useTasks } from "../Hooks/useTasks";
import { ToastContext } from "../Context/toastContext";

const columns = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "in-progress",
    title: "In Progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

function KanbanBoard({
  tasks,
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  label,
  onLabelChange,
  labels,
  hasActiveFilters,
  onResetFilters,
  highlightedTaskId,
}) {
  const { addTask, updateTask, columnOrder, setColumnOrder } = useTasks();
  const { toast } = useContext(ToastContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Keyboard shortcut: N to open new task modal
  useEffect(() => {
    function handleKeyDown(event) {
      const tag = event.target.tagName;
      const isTyping =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" ||
        event.target.isContentEditable;

      if (
        !isTyping &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        event.key.toLowerCase() === "n"
      ) {
        event.preventDefault();
        setIsModalOpen(true);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Bring a highlighted task into view (e.g. from the Overview deadlines list).
  useEffect(() => {
    if (!highlightedTaskId) {
      return;
    }

    const element = document.querySelector(
      `[data-task-id="${highlightedTaskId}"]`
    );

    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [highlightedTaskId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  function handleCreateTask(taskData) {
    addTask(taskData);
    setIsModalOpen(false);
    toast(`Created "${taskData.title}"`);
  }

  function handleDragStart(event) {
    const task = tasks.find(
      (task) => task.id === event.active.id
    );

    setActiveTask(task);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) {
      return;
    }

    const activeTask = tasks.find(
      (task) => task.id === activeId
    );

    if (!activeTask) {
      return;
    }

    const overTask = tasks.find((task) => task.id === overId);
    const isColumnId = columns.some((column) => column.id === overId);
    const destinationColumn = overTask
      ? overTask.status
      : isColumnId
        ? overId
        : activeTask.status;
    const sourceColumn = activeTask.status;

    if (sourceColumn === destinationColumn) {
      const ids = columnOrder[sourceColumn];
      const oldIndex = ids.indexOf(activeId);
      const newIndex = overTask ? ids.indexOf(overId) : ids.length - 1;

      if (oldIndex !== -1 && newIndex !== -1) {
        setColumnOrder(sourceColumn, arrayMove(ids, oldIndex, newIndex));
      }

      return;
    }

    const sourceIds = columnOrder[sourceColumn].filter(
      (id) => id !== activeId
    );
    const destinationIds = [...columnOrder[destinationColumn]];

    let insertIndex = overTask
      ? destinationIds.indexOf(overId)
      : destinationIds.length;

    const isBelowOverItem =
      active.rect.current.translated &&
      active.rect.current.translated.top >
        over.rect.top + over.rect.height;

    if (insertIndex >= 0) {
      insertIndex += isBelowOverItem ? 1 : 0;
    } else {
      insertIndex = destinationIds.length;
    }

    destinationIds.splice(insertIndex, 0, activeId);

    setColumnOrder(sourceColumn, sourceIds);
    setColumnOrder(destinationColumn, destinationIds);
    updateTask(activeId, { status: destinationColumn });
  }

  return (
    <>
      <div className="sticky top-16 z-20 mb-6">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
          <button
            type="button"
            onClick={() => setFilterOpen((prev) => !prev)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
              filterOpen || hasActiveFilters
                ? "bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-500/30"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
            {hasActiveFilters && (
              <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white dark:bg-violet-400">
                !
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-violet-500 active:scale-[0.98] dark:bg-violet-500 dark:hover:bg-violet-400"
          >
            <Plus className="h-4 w-4" />
            Add task
          </button>
        </div>

        <FilterBar
          open={filterOpen}
          status={status}
          onStatusChange={onStatusChange}
          priority={priority}
          onPriorityChange={onPriorityChange}
          label={label}
          onLabelChange={onLabelChange}
          labels={labels}
          onReset={onResetFilters}
          hasActiveFilters={hasActiveFilters}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
      </div>

      {tasks.length === 0 && !hasActiveFilters ? (
        <EmptyState
          title="No tasks yet"
          description="This board is empty. Create your first task to get things moving."
          actionLabel="Create task"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <>
          {hasActiveFilters && tasks.length === 0 && (
            <EmptyState
              title="No tasks match your filters"
              description="Try adjusting your search or filter settings to see more tasks."
              actionLabel="Clear filters"
              onAction={onResetFilters}
            />
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {columns.map((column) => {
            const orderedIds = columnOrder[column.id] || [];
            const taskById = new Map(
              tasks.map((task) => [task.id, task])
            );
            const columnTasks = orderedIds
              .map((id) => taskById.get(id))
              .filter(Boolean);

            return (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={columnTasks}
                highlightedTaskId={highlightedTaskId}
              />
            );
          })}
        </div>

            <DragOverlay
              dropAnimation={{
                ...defaultDropAnimation,
                duration: 260,
                easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
              }}
            >
              {activeTask ? (
                <TaskCard task={activeTask} disableEntranceAnimation />
              ) : null}
            </DragOverlay>
          </DndContext>
        </>
      )}

      {isModalOpen && (
        <TaskModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateTask}
        />
      )}
    </>
  );
}

export default KanbanBoard;