import { useState } from "react";

export function useTaskFilters(tasks) {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [labelFilter, setLabelFilter] = useState("all");

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !normalizedSearch ||
      task.title.toLowerCase().includes(normalizedSearch) ||
      (task.description || "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      task.labels.some((label) =>
        label.toLowerCase().includes(normalizedSearch)
      );

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    const matchesLabel =
      labelFilter === "all" || task.labels.includes(labelFilter);

    return matchesSearch && matchesPriority && matchesLabel;
  });

  const labelOptions = [
    ...new Set(tasks.flatMap((task) => task.labels)),
  ].sort();

  const hasActiveFilters =
    normalizedSearch !== "" ||
    priorityFilter !== "all" ||
    labelFilter !== "all";

  function resetFilters() {
    setSearchTerm("");
    setPriorityFilter("all");
    setLabelFilter("all");
  }

  return {
    filteredTasks,
    searchTerm,
    setSearchTerm,
    priorityFilter,
    setPriorityFilter,
    labelFilter,
    setLabelFilter,
    labelOptions,
    hasActiveFilters,
    resetFilters,
  };
}
