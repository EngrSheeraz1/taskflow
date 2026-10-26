import { Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Board from "../features/board/components/Board";
import Settings from "../features/settings/Settings";
import TaskDetail from "../features/tasks/components/TaskDetail";
import { useTask } from "../features/tasks/hooks/useTask";
import Spinner from "../components/Spinner/Spinner";

export default function AppRouter() {
  const {
    tasks,
    isLoading,
    addTask,
    editTask,
    deleteTask,
    changeTaskStatus,
  } = useTask();

  if (isLoading) {
    return <Spinner message="Loading your TaskFlow board..." />;
  }

  function handleAddTask(status) {
    const title = window.prompt("Enter a task title");
    if (!title?.trim()) return;

    addTask({
      title: title.trim(),
      description: "",
      priority: "medium",
      status,
      createdAt: new Date().toISOString().slice(0, 10),
    });
  }

  function handleEditTask(task) {
    const title = window.prompt("Edit task title", task.title);
    if (!title?.trim()) return;
    editTask(task.id, { title: title.trim() });
  }

  function handleDeleteTask(taskId) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskId);
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Board
              tasks={tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onStatusChange={changeTaskStatus}
            />
          }
        />
        <Route path="settings" element={<Settings />} />
        <Route path="tasks/:taskId" element={<TaskDetail tasks={tasks} />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Route>
    </Routes>
  );
}
