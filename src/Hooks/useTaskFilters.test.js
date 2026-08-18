import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTaskFilters } from "./useTaskFilters";

const tasks = [
  {
    id: "1",
    title: "Design dashboard",
    description: "Create the main layout",
    status: "todo",
    priority: "high",
    labels: ["Design"],
  },
  {
    id: "2",
    title: "Build navbar",
    description: "",
    status: "in-progress",
    priority: "medium",
    labels: ["Frontend"],
  },
  {
    id: "3",
    title: "Fix login bug",
    description: "design polish on auth page",
    status: "done",
    priority: "low",
    labels: ["Bug", "Design"],
  },
];

function setup() {
  return renderHook(() => useTaskFilters(tasks));
}

describe("useTaskFilters", () => {
  it("returns all tasks with no active filters", () => {
    const { result } = setup();
    expect(result.current.filteredTasks).toHaveLength(tasks.length);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("filters by title", () => {
    const { result } = setup();
    act(() => result.current.setSearchTerm("navbar"));
    expect(result.current.filteredTasks.map((task) => task.id)).toEqual(["2"]);
  });

  it("filters by description", () => {
    const { result } = setup();
    act(() => result.current.setSearchTerm("layout"));
    expect(result.current.filteredTasks.map((task) => task.id)).toEqual(["1"]);
  });

  it("filters by label text in search", () => {
    const { result } = setup();
    act(() => result.current.setSearchTerm("frontend"));
    expect(result.current.filteredTasks.map((task) => task.id)).toEqual(["2"]);
  });

  it("ignores case and surrounding whitespace in search", () => {
    const { result } = setup();
    act(() => result.current.setSearchTerm("  FIX LOGIN  "));
    expect(result.current.filteredTasks.map((task) => task.id)).toEqual(["3"]);
  });

  it("filters by status", () => {
    const { result } = setup();
    act(() => result.current.setStatusFilter("done"));
    expect(result.current.filteredTasks.map((task) => task.id)).toEqual(["3"]);
  });

  it("filters by priority", () => {
    const { result } = setup();
    act(() => result.current.setPriorityFilter("high"));
    expect(result.current.filteredTasks.map((task) => task.id)).toEqual(["1"]);
  });

  it("filters by label", () => {
    const { result } = setup();
    act(() => result.current.setLabelFilter("Design"));
    expect(result.current.filteredTasks.map((task) => task.id)).toEqual([
      "1",
      "3",
    ]);
  });

  it("combines search and status filters", () => {
    const { result } = setup();
    act(() => result.current.setSearchTerm("design"));
    act(() => result.current.setStatusFilter("done"));
    expect(result.current.filteredTasks.map((task) => task.id)).toEqual(["3"]);
  });

  it("reports unique sorted label options", () => {
    const { result } = setup();
    expect(result.current.labelOptions).toEqual(["Bug", "Design", "Frontend"]);
  });

  it("tracks whether any filter is active", () => {
    const { result } = setup();
    expect(result.current.hasActiveFilters).toBe(false);
    act(() => result.current.setPriorityFilter("low"));
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("resets all filters", () => {
    const { result } = setup();
    act(() => result.current.setSearchTerm("design"));
    act(() => result.current.setStatusFilter("done"));
    act(() => result.current.setPriorityFilter("high"));
    act(() => result.current.setLabelFilter("Bug"));
    act(() => result.current.resetFilters());

    expect(result.current.searchTerm).toBe("");
    expect(result.current.statusFilter).toBe("all");
    expect(result.current.priorityFilter).toBe("all");
    expect(result.current.labelFilter).toBe("all");
    expect(result.current.filteredTasks).toHaveLength(tasks.length);
    expect(result.current.hasActiveFilters).toBe(false);
  });
});
