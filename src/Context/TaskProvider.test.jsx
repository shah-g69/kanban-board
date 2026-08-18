import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTasks } from "../Hooks/useTasks";
import { TaskProvider } from "./TaskProvider";

function setup() {
  return renderHook(() => useTasks(), { wrapper: TaskProvider });
}

describe("TaskProvider", () => {
  it("starts with the default workspace seeded", () => {
    const { result } = setup();
    expect(result.current.projects).toHaveLength(1);
    expect(result.current.projects[0].name).toBe("My Workspace");
    expect(result.current.tasks.length).toBeGreaterThan(0);
    expect(result.current.columnOrder).toHaveProperty("todo");
  });

  it("adds a task to the todo column and logs activity", () => {
    const { result } = setup();
    const before = result.current.tasks.length;

    act(() => {
      result.current.addTask({
        title: "New task",
        priority: "high",
        labels: [],
        dueDate: "",
      });
    });

    const added = result.current.tasks.find(
      (task) => task.title === "New task"
    );
    expect(added).toBeTruthy();
    expect(added.status).toBe("todo");
    expect(result.current.tasks).toHaveLength(before + 1);
    expect(result.current.columnOrder.todo).toContain(added.id);
    expect(result.current.activity[0].type).toBe("created");
    expect(result.current.activity[0].message).toContain("New task");
  });

  it("completes a task and logs a completed event", () => {
    const { result } = setup();
    const task = result.current.tasks[0];

    act(() => {
      result.current.updateTask(task.id, { status: "done" });
    });

    const updated = result.current.tasks.find(
      (current) => current.id === task.id
    );
    expect(updated.status).toBe("done");
    expect(result.current.activity[0].type).toBe("completed");
  });

  it("logs a move when the status changes but isn't done", () => {
    const { result } = setup();
    const task = result.current.tasks.find((t) => t.status === "todo");

    act(() => {
      result.current.updateTask(task.id, { status: "in-progress" });
    });

    expect(result.current.activity[0].type).toBe("moved");
    expect(result.current.activity[0].message).toContain("In Progress");
  });

  it("edits a task without logging activity", () => {
    const { result } = setup();
    const task = result.current.tasks[0];

    act(() => {
      result.current.updateTask(task.id, { title: "Renamed" });
    });

    expect(
      result.current.tasks.find((current) => current.id === task.id).title
    ).toBe("Renamed");
    expect(result.current.activity).toHaveLength(0);
  });

  it("deletes a task and removes it from the column order", () => {
    const { result } = setup();
    const task = result.current.tasks[0];
    const column = task.status;

    act(() => {
      result.current.deleteTask(task.id);
    });

    expect(
      result.current.tasks.find((current) => current.id === task.id)
    ).toBeUndefined();
    expect(result.current.columnOrder[column]).not.toContain(task.id);
    expect(result.current.activity[0].type).toBe("deleted");
  });

  it("creates, switches, and deletes projects", () => {
    const { result } = setup();
    const defaultProjectId = result.current.activeProjectId;

    act(() => {
      result.current.addProject("Design");
    });

    expect(result.current.projects).toHaveLength(2);
    expect(result.current.activeProjectId).not.toBe(defaultProjectId);
    expect(result.current.tasks).toHaveLength(0);

    act(() => {
      result.current.setActiveProject(defaultProjectId);
    });
    expect(result.current.tasks.length).toBeGreaterThan(0);

    const secondProjectId = result.current.projects[1].id;
    act(() => {
      result.current.deleteProject(secondProjectId);
    });
    expect(result.current.projects).toHaveLength(1);
  });

  it("keeps at least one project", () => {
    const { result } = setup();
    const onlyProject = result.current.projects[0];

    act(() => {
      result.current.deleteProject(onlyProject.id);
    });

    expect(result.current.projects).toHaveLength(1);
  });

  it("exports the workspace as JSON and imports it back", () => {
    const { result } = setup();

    act(() => {
      result.current.addProject("Backup me");
    });

    const json = result.current.exportData();
    const parsed = JSON.parse(json);
    expect(parsed.projects).toHaveLength(2);
    expect(parsed.projectData).toHaveProperty(parsed.projects[1].id);

    // Import a backup containing only the first project.
    act(() => {
      const ok = result.current.importData(
        JSON.stringify({
          projects: [parsed.projects[0]],
          activeProjectId: parsed.projects[0].id,
          projectData: {
            [parsed.projects[0].id]: parsed.projectData[parsed.projects[0].id],
          },
        })
      );
      expect(ok).toBe(true);
    });

    expect(result.current.projects).toHaveLength(1);
    expect(result.current.tasks.length).toBeGreaterThan(0);
  });

  it("rejects invalid import data", () => {
    const { result } = setup();

    act(() => {
      const ok = result.current.importData("not json at all");
      expect(ok).toBe(false);
    });

    act(() => {
      const ok = result.current.importData(JSON.stringify({ foo: 1 }));
      expect(ok).toBe(false);
    });

    expect(result.current.projects).toHaveLength(1);
  });
});
