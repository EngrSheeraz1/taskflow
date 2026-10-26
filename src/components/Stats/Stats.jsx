import styles from "./Stats.module.css";

function Stats({ total = 0, inProgress = 0, completed = 0 }) {
  const stats = [
    {
      label: "Total Tasks",
      value: total,
      detail: "Across all tasks",
      icon: "▤",
      color: "purple",
    },
    {
      label: "In Progress",
      value: inProgress,
      detail: "Tasks being worked on",
      icon: "◷",
      color: "blue",
    },
    {
      label: "Completed",
      value: completed,
      detail: "Tasks completed",
      icon: "✓",
      color: "green",
    },
    {
      label: "To Do",
      value: total - inProgress - completed,
      detail: "Waiting to get started",
      icon: "!",
      color: "orange",
    },
  ];

  return (
    <section className={styles.stats}>
      {stats.map((stat) => (
        <article className={styles.card} key={stat.label}>
          <div className={`${styles.icon} ${styles[stat.color]}`}>
            {stat.icon}
          </div>
          <p className={styles.label}>{stat.label}</p>
          <div className={styles.value}>{stat.value}</div>
          <p className={styles.detail}>{stat.detail}</p>
        </article>
      ))}
    </section>
  );
}

export default Stats;
