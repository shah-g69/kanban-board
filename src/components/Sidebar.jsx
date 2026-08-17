import { useState } from "react";
import {
  Check,
  ChevronsUpDown,
  KanbanSquare,
  LayoutDashboard,
  Plus,
  X,
} from "lucide-react";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "board", label: "Board", icon: KanbanSquare },
];

function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  view,
  onNavigate,
}) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [addingProject, setAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? projects[0];
  const showLabels = !collapsed || mobileOpen;

  function handleCreateProject(event) {
    event.preventDefault();

    if (newProjectName.trim()) {
      onCreateProject(newProjectName);
      setNewProjectName("");
      setAddingProject(false);
    }
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/70 bg-white/95 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-[#0d1117]/95 md:sticky md:top-0 md:h-screen md:bg-white/70 dark:md:bg-[#0d1117]/70 ${
        collapsed ? "md:w-16" : "md:w-64"
      } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      {/* Project switcher */}
      <div className="relative border-b border-slate-200/70 p-3 dark:border-white/10">
        <button
          type="button"
          onClick={() => setSwitcherOpen((open) => !open)}
          className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
          title={activeProject?.name}
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: activeProject?.color ?? "#8b5cf6" }}
          >
            {(activeProject?.name ?? "?").charAt(0).toUpperCase()}
          </span>

          {showLabels && (
            <>
              <span className="flex-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {activeProject?.name}
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" />
            </>
          )}
        </button>

        {switcherOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setSwitcherOpen(false)}
            />
            <div className="absolute left-3 right-3 top-full z-20 mt-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-slate-900">
              <p className="px-2.5 pb-1 pt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Projects
              </p>

              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    onSelectProject(project.id);
                    setSwitcherOpen(false);
                    onCloseMobile();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <span
                    className="h-5 w-5 shrink-0 rounded-md"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="flex-1 truncate text-slate-700 dark:text-slate-200">
                    {project.name}
                  </span>
                  {project.id === activeProjectId && (
                    <Check className="h-4 w-4 shrink-0 text-violet-500" />
                  )}
                </button>
              ))}

              {addingProject ? (
                <form
                  onSubmit={handleCreateProject}
                  className="mt-1 flex items-center gap-1 border-t border-slate-100 px-1 pt-1.5 dark:border-white/10"
                >
                  <input
                    autoFocus
                    value={newProjectName}
                    onChange={(event) => setNewProjectName(event.target.value)}
                    placeholder="Project name"
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-violet-500 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-violet-600 p-1.5 text-white transition-colors hover:bg-violet-500"
                    title="Create project"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddingProject(false);
                      setNewProjectName("");
                    }}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
                    title="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingProject(true)}
                  className="mt-1 flex w-full items-center gap-2.5 rounded-lg border-t border-slate-100 px-2.5 pt-1.5 text-left text-sm font-medium text-slate-500 transition-colors hover:text-violet-600 dark:border-white/10 dark:text-slate-400 dark:hover:text-violet-300"
                >
                  <Plus className="h-4 w-4" />
                  New project
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {showLabels && (
          <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              title={item.label}
              className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  isActive ? "text-violet-500" : "text-slate-400"
                }`}
              />
              {showLabels && item.label}
            </button>
          );
        })}

        {showLabels && (
          <p className="px-2.5 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Projects
          </p>
        )}

        <div className="space-y-0.5">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => {
                onSelectProject(project.id);
                onCloseMobile();
              }}
              title={project.name}
              className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors ${
                project.id === activeProjectId
                  ? "font-medium text-slate-900 dark:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              {showLabels && <span className="truncate">{project.name}</span>}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
