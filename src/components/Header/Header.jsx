import styles from "./Header.module.css";

function Header({ onAddTask }) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.breadcrumb}>Workspace / My Tasks</p>
        <h1>My Tasks</h1>
        <p className={styles.subtitle}>
          Organize your work and get things done.
        </p>
      </div>

      <div className={styles.actions}>
        <label className={styles.search}>
          <span>⌕</span>
          <input type="search" placeholder="Search tasks..." />
        </label>

        <button
          className={styles.notification}
          type="button"
          aria-label="Notifications"
        >
          ♧
        </button>

        <button className={styles.addButton} type="button" onClick={onAddTask}>
          <span>＋</span> Add Task
        </button>
      </div>
    </header>
  );
}

export default Header;
