import { useContext } from "react";
import { TaskContext } from "../Context/taskContext";

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used inside TaskProvider");
  }

  return context;
}
