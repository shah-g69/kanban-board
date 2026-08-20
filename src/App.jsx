import { useState } from "react";
import { KanbanSquare, ListTodo, Moon, PanelLeft, Sun } from "lucide-react";
import KanbanBoard from "./components/KanbanBoard";
import Overview from "./components/Overview";
import Activity from "./components/Activity";
import Sidebar from "./components/Sidebar";
import { useTasks } from "./Hooks/useTasks";
import { useTaskFilters } from "./Hooks/useTaskFilters";
import { useTheme } from "./Hooks/useTheme";
import ToastContainer from "./components/ToastContainer";

function App() {
  const {
    tasks,
    projects,
    activeProjectId,
    setActiveProject,
    addProject,
    renameProject,
    deleteProject,
    activity,
    exportData,
    importData,
  } = useTasks();
  const { theme, toggleTheme } = useTheme();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [view, setView] = useState("board");
  const [highlightedTaskId, setHighlightedTaskId] = useState(null);

  const {
    filteredTasks,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    labelFilter,
    setLabelFilter,
    labelOptions,
    hasActiveFilters,
    resetFilters,
  } = useTaskFilters(tasks);

  const summary = hasActiveFilters
    ? `${filteredTasks.length} of ${tasks.length} ${
        tasks.length === 1 ? "task" : "tasks"
      }`
    : `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;

  function handleSidebarToggle() {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setSidebarCollapsed((current) => !current);
    } else {
      setMobileSidebarOpen(true);
    }
  }

  function handleSelectProject(projectId) {
    setActiveProject(projectId);
    setMobileSidebarOpen(false);
  }

  function handleFocusTask(taskId) {
    resetFilters();
    setView("board");
    setHighlightedTaskId(taskId);

    window.setTimeout(() => setHighlightedTaskId(null), 2000);
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        onCreateProject={addProject}
        onRenameProject={renameProject}
        onDeleteProject={deleteProject}
        view={view}
        onNavigate={setView}
      />

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1117]/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSidebarToggle}
                title="Toggle sidebar"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-500 transition-all hover:scale-105 hover:border-violet-300 hover:text-violet-600 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:border-violet-500/50 dark:hover:text-violet-300"
              >
                <PanelLeft className="h-4 w-4" />
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30">
                <KanbanSquare className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  Kanban Task Manager
                </h1>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Organize your tasks and get things done.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-1.5 dark:border-white/10 dark:bg-white/5"
                title={
                  hasActiveFilters
                    ? "Tasks matching the current filters"
                    : "Total tasks"
                }
              >
                <ListTodo className="h-4 w-4 text-violet-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {summary}
                </span>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                title={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-600 transition-all hover:scale-105 hover:border-violet-300 hover:text-violet-600 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-violet-500/50 dark:hover:text-violet-300"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
          {view === "activity" ? (
            <Activity activity={activity} />
          ) : view === "overview" ? (
            <Overview
              tasks={tasks}
              onGoToBoard={() => setView("board")}
              onSelectStatus={(selectedStatus) => {
                setStatusFilter(selectedStatus);
                setView("board");
              }}
              onSelectPriority={(selectedPriority) => {
                setPriorityFilter(selectedPriority);
                setView("board");
              }}
              onFocusTask={handleFocusTask}
            />
          ) : (
            <KanbanBoard
              tasks={filteredTasks}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              status={statusFilter}
              onStatusChange={setStatusFilter}
              priority={priorityFilter}
              onPriorityChange={setPriorityFilter}
              label={labelFilter}
              onLabelChange={setLabelFilter}
              labels={labelOptions}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={resetFilters}
              highlightedTaskId={highlightedTaskId}
            />
          )}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
