import { useMemo, useState } from "react";
import { useTask } from "../../tasks/hooks/useTask";
import Column from "./Column.jsx";
import styles from "./Board.module.css";

const columns = [
  { title: "To Do", status: "todo", color: "todo" },
  { title: "In Progress", status: "in-progress", color: "progress" },
  { title: "Completed", status: "done", color: "done" },
];

const priorityRank = {
  high: 1,
  medium: 2,
  low: 3,
};

function Board() {
  const { tasks, changeTaskStatus, deleteTask } = useTask();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = tasks.filter((task) => {
      const matchesSearch =
        (task.title || "").toLowerCase().includes(query) ||
        (task.description || "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    return result.sort((a, b) => {
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }

      if (sortBy === "priority") {
        return (
          (priorityRank[a.priority] || 99) - (priorityRank[b.priority] || 99)
        );
      }

      return Number(b.id) - Number(a.id);
    });
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("newest");
  }

  const filtersActive =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    sortBy !== "newest";

  return (
    <section className={styles.boardSection}>
      <div className={styles.boardToolbar}>
        <div>
          <h2>Project Board</h2>
          <p>
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
        </div>

        <button
          type="button"
          className={styles.filterButton}
          onClick={clearFilters}
          disabled={!filtersActive}
        >
          Clear filters
        </button>
      </div>

      <div className={styles.filterBar}>
        <label className={styles.searchField}>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search title or description..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search tasks"
          />
        </label>

        <label className={styles.selectField}>
          <span>Status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
        </label>

        <label className={styles.selectField}>
          <span>Priority</span>
          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label className={styles.selectField}>
          <span>Sort by</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="title">Title A–Z</option>
            <option value="priority">Priority</option>
          </select>
        </label>
      </div>

      <div className={styles.board}>
        {columns.map((column) => (
          <Column
            key={column.status}
            title={column.title}
            color={column.color}
            tasks={filteredTasks.filter(
              (task) => task.status === column.status,
            )}
            onStatusChange={changeTaskStatus}
            onDeleteTask={deleteTask}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <p className={styles.emptyState}>
          No matching tasks found. Try changing your search or filters.
        </p>
      )}
    </section>
  );
}

export default Board;
