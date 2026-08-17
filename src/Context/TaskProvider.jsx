import { useEffect, useState } from "react";
import { TaskContext } from "./taskContext";

const priorityRank = {
  high: 0,
  medium: 1,
  low: 2,
};

const STORAGE_KEY = "kanban:state";

const COLUMN_IDS = ["todo", "in-progress", "done"];

const initialTasks = [
  {
    id: "1",
    title: "Design dashboard",
    description: "Create the main dashboard layout",
    status: "todo",
    priority: "high",
    labels: ["Design"],
  },
  {
    id: "2",
    title: "Build navbar",
    description: "Create responsive navigation",
    status: "todo",
    priority: "medium",
    labels: ["Frontend"],
  },
  {
    id: "3",
    title: "Create task card",
    description: "Build reusable task card component",
    status: "in-progress",
    priority: "high",
    labels: ["Frontend"],
  },
  {
    id: "4",
    title: "Setup project",
    description: "Initialize React and Tailwind",
    status: "done",
    priority: "low",
    labels: ["Setup"],
  },
];

function sortByPriority(list) {
  return [...list].sort(
    (a, b) => priorityRank[a.priority] - priorityRank[b.priority]
  );
}

function buildInitialColumnOrder(taskList) {
  return {
    todo: sortByPriority(
      taskList.filter((task) => task.status === "todo")
    ).map((task) => task.id),
    "in-progress": sortByPriority(
      taskList.filter((task) => task.status === "in-progress")
    ).map((task) => task.id),
    done: sortByPriority(
      taskList.filter((task) => task.status === "done")
    ).map((task) => task.id),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed.tasks) || !parsed.columnOrder) {
      return null;
    }

    const ids = new Set(parsed.tasks.map((task) => task.id));
    const columnOrder = {};

    for (const columnId of COLUMN_IDS) {
      const list = Array.isArray(parsed.columnOrder[columnId])
        ? parsed.columnOrder[columnId]
        : [];

      columnOrder[columnId] = list.filter((id) => ids.has(id));
    }

    return { tasks: parsed.tasks, columnOrder };
  } catch {
    // Corrupted storage — fall back to the seed data.
    return null;
  }
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const saved = loadState();
    return saved ? saved.tasks : initialTasks;
  });

  const [columnOrder, setColumnOrderState] = useState(() => {
    const saved = loadState();
    return saved ? saved.columnOrder : buildInitialColumnOrder(initialTasks);
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ tasks, columnOrder })
    );
  }, [tasks, columnOrder]);

  function insertTaskByPriority(ids, newTask) {
    const insertIndex = ids.findIndex((id) => {
      const existing = tasks.find((task) => task.id === id);

      return (
        existing &&
        priorityRank[existing.priority] > priorityRank[newTask.priority]
      );
    });

    const next = [...ids];
    next.splice(insertIndex === -1 ? ids.length : insertIndex, 0, newTask.id);
    return next;
  }

  function setColumnOrder(columnId, orderedIds) {
    setColumnOrderState((current) => ({
      ...current,
      [columnId]: orderedIds,
    }));
  }

  function addTask(taskData) {
    const newTask = {
      id: crypto.randomUUID(),
      ...taskData,
      status: "todo",
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
    setColumnOrderState((current) => ({
      ...current,
      todo: insertTaskByPriority(current.todo, newTask),
    }));
  }

  function updateTask(taskId, updatedData) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updatedData }
          : task
      )
    );
  }

  function deleteTask(taskId) {
    const task = tasks.find((currentTask) => currentTask.id === taskId);

    setTasks((currentTasks) =>
      currentTasks.filter((currentTask) => currentTask.id !== taskId)
    );

    if (task) {
      setColumnOrderState((current) => ({
        ...current,
        [task.status]: current[task.status].filter(
          (id) => id !== taskId
        ),
      }));
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        columnOrder,
        setColumnOrder,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
