
import { useState, useEffect, useCallback } from "react";
import { httpClient } from "../../../lib/httpClient";

export function useTask() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch tasks when the hook first runs
  useEffect(() => {
    async function fetchTasks() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await httpClient("tasks");
        setTasks(data);
      } catch (err) {
        setError(err.message || "Failed to fetch tasks.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, []);

  // 2. Add a task
  const addTask = useCallback(async (taskData) => {
    try {
      setError(null);

      const newTask = await httpClient("tasks", {
        method: "POST",
        body: JSON.stringify(taskData),
      });

      setTasks((prev) => [newTask, ...prev]);

      return newTask;
    } catch (err) {
      setError(err.message || "Failed to add task.");
      throw err;
    }
  }, []);

  // 3. Edit a task
  const editTask = useCallback(async (taskId, updatedData) => {
    try {
      setError(null);

      const updatedTask = await httpClient(`tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(updatedData),
      });

      setTasks((prev) =>
        prev.map((task) =>
          String(task.id) === String(taskId)
            ? { ...task, ...updatedTask }
            : task
        )
      );

      return updatedTask;
    } catch (err) {
      setError(err.message || "Failed to edit task.");
      throw err;
    }
  }, []);

  // 4. Delete a task
  const deleteTask = useCallback(async (taskId) => {
    try {
      setError(null);

      await httpClient(`tasks/${taskId}`, {
        method: "DELETE",
      });

      setTasks((prev) =>
        prev.filter(
          (task) => String(task.id) !== String(taskId)
        )
      );
    } catch (err) {
      setError(err.message || "Failed to delete task.");
      throw err;
    }
  }, []);

  // 5. Change task status
  const changeTaskStatus = useCallback(
    async (taskId, newStatus) => {
      return editTask(taskId, { status: newStatus });
    },
    [editTask]
  );

  return {
    tasks,
    isLoading,
    error,
    addTask,
    editTask,
    deleteTask,
    changeTaskStatus,
  };
}
