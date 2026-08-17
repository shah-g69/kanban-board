import { useEffect, useState } from "react";
import { TaskContext } from "./taskContext";

const priorityRank = {
  high: 0,
  medium: 1,
  low: 2,
};

const STORAGE_KEY = "kanban:state";

const COLUMN_IDS = ["todo", "in-progress", "done"];

const PROJECT_COLORS = [
  "#8b5cf6",
  "#0ea5e9",
  "#f59e0b",
  "#10b981",
  "#f43f5e",
  "#6366f1",
];

const DEFAULT_PROJECT = {
  id: "default",
  name: "My Workspace",
  color: "#8b5cf6",
};

const EMPTY_ORDER = {
  todo: [],
  "in-progress": [],
  done: [],
};

const initialTasks = [
  {
    id: "1",
    title: "Design dashboard",
    description: "Create the main dashboard layout",
    status: "todo",
    priority: "high",
    labels: ["Design"],
    dueDate: "2026-08-10",
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
    dueDate: "2026-08-20",
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

function taskSortScore(task) {
  return {
    due: task.dueDate
      ? new Date(`${task.dueDate}T00:00:00`).getTime()
      : Number.POSITIVE_INFINITY,
    priority: priorityRank[task.priority] ?? 1,
  };
}

// Default order: deadlines first (most overdue at the top), then by
// priority, with undated tasks last. Manual drag reordering overrides
// this per column.
function compareScores(a, b) {
  if (a.due !== b.due) {
    return a.due - b.due;
  }
  return a.priority - b.priority;
}

function sortTasks(list) {
  return [...list].sort((a, b) => compareScores(taskSortScore(a), taskSortScore(b)));
}

function buildInitialColumnOrder(taskList) {
  return {
    todo: sortTasks(
      taskList.filter((task) => task.status === "todo")
    ).map((task) => task.id),
    "in-progress": sortTasks(
      taskList.filter((task) => task.status === "in-progress")
    ).map((task) => task.id),
    done: sortTasks(
      taskList.filter((task) => task.status === "done")
    ).map((task) => task.id),
  };
}

function sanitizeProject(projectTasks, projectOrder) {
  const tasks = Array.isArray(projectTasks) ? projectTasks : [];
  const ids = new Set(tasks.map((task) => task.id));
  const columnOrder = {};

  for (const columnId of COLUMN_IDS) {
    const list = Array.isArray(projectOrder?.[columnId])
      ? projectOrder[columnId]
      : [];

    columnOrder[columnId] = list.filter((id) => ids.has(id));
  }

  return { tasks, columnOrder };
}

function createDefaultState() {
  return {
    projects: [DEFAULT_PROJECT],
    activeProjectId: DEFAULT_PROJECT.id,
    projectData: {
      [DEFAULT_PROJECT.id]: {
        tasks: initialTasks,
        columnOrder: buildInitialColumnOrder(initialTasks),
      },
    },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    // Current shape: { projects, activeProjectId, projectData }
    if (
      Array.isArray(parsed.projects) &&
      parsed.projectData &&
      parsed.activeProjectId
    ) {
      const projectData = {};

      for (const project of parsed.projects) {
        projectData[project.id] = sanitizeProject(
          parsed.projectData[project.id]?.tasks,
          parsed.projectData[project.id]?.columnOrder
        );
      }

      return {
        projects: parsed.projects,
        activeProjectId: parsed.activeProjectId,
        projectData,
      };
    }

    // Legacy single-board shape: { tasks, columnOrder }
    if (Array.isArray(parsed.tasks)) {
      return {
        projects: [DEFAULT_PROJECT],
        activeProjectId: DEFAULT_PROJECT.id,
        projectData: {
          [DEFAULT_PROJECT.id]: sanitizeProject(
            parsed.tasks,
            parsed.columnOrder
          ),
        },
      };
    }

    return null;
  } catch {
    // Corrupted storage — fall back to the seed data.
    return null;
  }
}

export function TaskProvider({ children }) {
  const [state, setState] = useState(() => loadState() ?? createDefaultState());

  const { projects, activeProjectId, projectData } = state;

  const activeProjectData =
    projectData[activeProjectId] ?? { tasks: [], columnOrder: EMPTY_ORDER };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function updateActiveProject(updater) {
    setState((current) => ({
      ...current,
      projectData: {
        ...current.projectData,
        [current.activeProjectId]: updater(
          current.projectData[current.activeProjectId]
        ),
      },
    }));
  }

  function insertTaskByDeadline(ids, newTask, existingTasks) {
    const newScore = taskSortScore(newTask);
    const insertIndex = ids.findIndex((id) => {
      const existing = existingTasks.find((task) => task.id === id);

      return (
        existing &&
        compareScores(newScore, taskSortScore(existing)) < 0
      );
    });

    const next = [...ids];
    next.splice(insertIndex === -1 ? ids.length : insertIndex, 0, newTask.id);
    return next;
  }

  function setActiveProject(projectId) {
    setState((current) => ({
      ...current,
      activeProjectId: projectId,
    }));
  }

  function renameProject(projectId, name) {
    const trimmed = name.trim();

    if (!trimmed) {
      return;
    }

    setState((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === projectId
          ? { ...project, name: trimmed }
          : project
      ),
    }));
  }

  function deleteProject(projectId) {
    setState((current) => {
      // Keep at least one project.
      if (current.projects.length <= 1) {
        return current;
      }

      const projects = current.projects.filter(
        (project) => project.id !== projectId
      );
      const projectData = { ...current.projectData };

      delete projectData[projectId];

      return {
        projects,
        projectData,
        activeProjectId:
          current.activeProjectId === projectId
            ? projects[0].id
            : current.activeProjectId,
      };
    });
  }

  function addProject(name) {
    const trimmed = name.trim();

    if (!trimmed) {
      return;
    }

    setState((current) => {
      const project = {
        id: crypto.randomUUID(),
        name: trimmed,
        color: PROJECT_COLORS[current.projects.length % PROJECT_COLORS.length],
      };

      return {
        ...current,
        projects: [...current.projects, project],
        activeProjectId: project.id,
        projectData: {
          ...current.projectData,
          [project.id]: { tasks: [], columnOrder: { ...EMPTY_ORDER } },
        },
      };
    });
  }

  function setColumnOrder(columnId, orderedIds) {
    updateActiveProject((data) => ({
      ...data,
      columnOrder: {
        ...data.columnOrder,
        [columnId]: orderedIds,
      },
    }));
  }

  function addTask(taskData) {
    const newTask = {
      id: crypto.randomUUID(),
      ...taskData,
      status: "todo",
    };

    updateActiveProject((data) => ({
      tasks: [...data.tasks, newTask],
      columnOrder: {
        ...data.columnOrder,
        todo: insertTaskByDeadline(
          data.columnOrder.todo,
          newTask,
          data.tasks
        ),
      },
    }));
  }

  function updateTask(taskId, updatedData) {
    updateActiveProject((data) => ({
      ...data,
      tasks: data.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedData } : task
      ),
    }));
  }

  function deleteTask(taskId) {
    updateActiveProject((data) => {
      const task = data.tasks.find(
        (currentTask) => currentTask.id === taskId
      );

      if (!task) {
        return data;
      }

      return {
        tasks: data.tasks.filter(
          (currentTask) => currentTask.id !== taskId
        ),
        columnOrder: {
          ...data.columnOrder,
          [task.status]: data.columnOrder[task.status].filter(
            (id) => id !== taskId
          ),
        },
      };
    });
  }

  return (
    <TaskContext.Provider
      value={{
        projects,
        activeProjectId,
        setActiveProject,
        addProject,
        renameProject,
        deleteProject,
        tasks: activeProjectData.tasks,
        columnOrder: activeProjectData.columnOrder,
        addTask,
        updateTask,
        deleteTask,
        setColumnOrder,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
