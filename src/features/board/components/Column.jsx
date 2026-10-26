import { memo } from "react";
import TaskCard from "./TaskCard";

function Column({ title, tasks, onStatusChange, onDeleteTask }) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "var(--bg-sidebar)",
        padding: "15px",
        borderRadius: "8px",
        border: "1px solid var(--border)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        {title} ({tasks.length})
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(Column); // Wrap in memo
