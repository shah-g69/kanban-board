import { useState } from "react";

export function useTaskFilters(tasks) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    const matchesLabel =
      labelFilter === "all" || task.labels.includes(labelFilter);

    return matchesSearch && matchesStatus && matchesPriority && matchesLabel;
  });

  const labelOptions = [
    ...new Set(tasks.flatMap((task) => task.labels)),
  ].sort();

  const hasActiveFilters =
    normalizedSearch !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    labelFilter !== "all";

  function resetFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setLabelFilter("all");
  }

  return {
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
  };
}
