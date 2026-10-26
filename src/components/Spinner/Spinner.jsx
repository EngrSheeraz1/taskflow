import styles from "./Spinner.module.css";

function Spinner({ message = "Loading tasks..." }) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <p className={styles.message}>{message}</p>
    </div>
  );
}

export default Spinner;
