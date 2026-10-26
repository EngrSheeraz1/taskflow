import styles from "./TaskCard.module.css";

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={`${styles.priority} ${styles[task.priority]}`}>
          {task.priority}
        </span>

        <button
          className={styles.menu}
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.title}`}
        >
          Edit
        </button>
      </div>

      <h3>{task.title}</h3>
      <p className={styles.description}>
        {task.description || "No description provided."}
      </p>

      <label className={styles.statusLabel}>
        Status
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Completed</option>
        </select>
      </label>

      <div className={styles.cardFooter}>
        <span className={styles.date}>▦ {task.createdAt}</span>

        <button
          type="button"
          className={styles.deleteButton}
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
