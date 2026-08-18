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

import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import FilterBar from "./FilterBar";
import SearchBar from "./SearchBar";
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
      <div className="sticky top-16 z-20 mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between dark:border-white/10 dark:bg-slate-950/80">
        <div className="shrink-0">
          <SearchBar value={searchTerm} onChange={onSearchChange} />
        </div>

        <FilterBar
          status={status}
          onStatusChange={onStatusChange}
          priority={priority}
          onPriorityChange={onPriorityChange}
          label={label}
          onLabelChange={onLabelChange}
          labels={labels}
          onReset={onResetFilters}
          hasActiveFilters={hasActiveFilters}
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
                onAddTask={() => setIsModalOpen(true)}
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