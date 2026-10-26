import { useState, lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar.jsx";
import Header from "../components/Header/Header.jsx";
import Stats from "../components/Stats/Stats.jsx";
import Spinner from "../components/Spinner/Spinner.jsx";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary.jsx";

import { useTask } from "../features/tasks/hooks/useTask.js";
import styles from "./App.module.css";

// Lazy-loaded components
const Board = lazy(() => import("../features/board/components/Board.jsx"));

const Settings = lazy(() => import("../features/settings/Settings.jsx"));

const TaskDetail = lazy(
  () => import("../features/tasks/components/TaskDetail.jsx"),
);

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
};

// Shared dashboard layout
function Layout({
  tasks,
  isFormOpen,
  setIsFormOpen,
  editingTask,
  setEditingTask,
  form,
  setForm,
  errorState,
  setErrorState,
  openAddForm,
  openEditForm,
  closeForm,
  handleSubmit,
  handleDeleteTask,
  totalTasks,
  inProgressCount,
  completedCount,
  changeTaskStatus,
}) {
  return (
    <div className={styles.app}>
      <Sidebar />

      <main className={styles.main}>
        <Header onAddTask={() => openAddForm()} />

        <div className={styles.statsNote}>
          Total: {totalTasks} tasks · In Progress: {inProgressCount}
          {" · "}Completed: {completedCount}
        </div>

        <Stats
          total={totalTasks}
          inProgress={inProgressCount}
          completed={completedCount}
        />

        <ErrorBoundary>
          <Suspense fallback={<Spinner message="Loading page..." />}>
            <Outlet
              context={{
                tasks,
                onAddTask: openAddForm,
                onEditTask: openEditForm,
                onDeleteTask: handleDeleteTask,
                onStatusChange: changeTaskStatus,
              }}
            />
          </Suspense>
        </ErrorBoundary>

        <footer className={styles.footer}>
          <span>© 2026 TaskFlow</span>
          <span>Small steps. Big progress.</span>
        </footer>
      </main>

      {isFormOpen && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-form-title"
          >
            <div className={styles.modalHeader}>
              <div>
                <h2 id="task-form-title">
                  {editingTask ? "Edit Task" : "Create Task"}
                </h2>
                <p>Add details to organize your work.</p>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeForm}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Task title *
                <input
                  autoFocus
                  maxLength={80}
                  value={form.title}
                  onChange={(event) => {
                    setForm({
                      ...form,
                      title: event.target.value,
                    });
                    setErrorState("");
                  }}
                  placeholder="e.g. Build login page"
                />
              </label>

              <label>
                Description
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  placeholder="What needs to be done?"
                />
              </label>

              <div className={styles.formRow}>
                <label>
                  Priority
                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        priority: event.target.value,
                      })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>

                <label>
                  Status
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value,
                      })
                    }
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                </label>
              </div>

              {errorState && (
                <p className={styles.formError} role="alert">
                  {errorState}
                </p>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className={styles.saveButton}>
                  {editingTask ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function App() {
  const {
    tasks,
    isLoading,
    error,
    addTask,
    editTask,
    deleteTask,
    changeTaskStatus,
  } = useTask();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errorState, setErrorState] = useState("");

  function openAddForm(status = "todo") {
    setEditingTask(null);
    setForm({ ...emptyForm, status });
    setErrorState("");
    setIsFormOpen(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || "todo",
    });
    setErrorState("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingTask(null);
    setForm(emptyForm);
    setErrorState("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setErrorState("Task title is required.");
      return;
    }

    if (title.length > 80) {
      setErrorState("Title must be 80 characters or fewer.");
      return;
    }

    const taskData = { ...form, title };

    try {
      if (editingTask) {
        await editTask(editingTask.id, taskData);
      } else {
        await addTask({
          ...taskData,
          createdAt: new Date().toISOString().slice(0, 10),
        });
      }

      closeForm();
    } catch (err) {
      setErrorState(err.message || "Unable to save task.");
    }
  }

  async function handleDeleteTask(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    try {
      await deleteTask(taskId);
    } catch (err) {
      window.alert(err.message || "Unable to delete task.");
    }
  }

  const totalTasks = tasks.length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "in-progress",
  ).length;

  const completedCount = tasks.filter((task) => task.status === "done").length;

  if (error && isLoading === false && tasks.length === 0) {
    return (
      <div className={styles.app}>
        <main className={styles.main}>
          <h2>Unable to load tasks</h2>
          <p>{error}</p>
          <p>
            Check that your API server is running and that your API URL is
            correct.
          </p>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return <Spinner message="Loading your TaskFlow board..." />;
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              tasks={tasks}
              isFormOpen={isFormOpen}
              setIsFormOpen={setIsFormOpen}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
              form={form}
              setForm={setForm}
              errorState={errorState}
              setErrorState={setErrorState}
              openAddForm={openAddForm}
              openEditForm={openEditForm}
              closeForm={closeForm}
              handleSubmit={handleSubmit}
              handleDeleteTask={handleDeleteTask}
              totalTasks={totalTasks}
              inProgressCount={inProgressCount}
              completedCount={completedCount}
              changeTaskStatus={changeTaskStatus}
            />
          }
        >
          <Route
            index
            element={
              <Board
                tasks={tasks}
                onAddTask={openAddForm}
                onEditTask={openEditForm}
                onDeleteTask={handleDeleteTask}
                onStatusChange={changeTaskStatus}
              />
            }
          />

          <Route path="settings" element={<Settings />} />

          <Route path="tasks/:taskId" element={<TaskDetail />} />

          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
