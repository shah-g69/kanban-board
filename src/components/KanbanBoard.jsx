import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import FiltreBar from "./FiltreBar";
import SearchBar from "./SearchBar";
import { useTasks } from "../Hooks/useTasks";

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
  priority,
  onPriorityChange,
  label,
  onLabelChange,
  labels,
  hasActiveFilters,
  onResetFilters,
}) {
  const { addTask, updateTask, columnOrder, setColumnOrder } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

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
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between dark:border-white/10 dark:bg-white/[0.03]">
        <SearchBar value={searchTerm} onChange={onSearchChange} />

        <FiltreBar
          priority={priority}
          onPriorityChange={onPriorityChange}
          label={label}
          onLabelChange={onLabelChange}
          labels={labels}
          onReset={onResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {hasActiveFilters && tasks.length === 0 && (
        <div className="mb-6 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-10 text-center dark:border-white/15 dark:bg-white/[0.03]">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            No tasks match your current filters.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-2 text-sm font-medium text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
          >
            Clear all filters
          </button>
        </div>
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
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} />
          ) : null}
        </DragOverlay>
      </DndContext>

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