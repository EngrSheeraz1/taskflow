import { memo } from "react";
import { Link } from "react-router-dom"; // Import Link
// ... other imports

function TaskCard({ task, onEditTask, onDeleteTask, onStatusChange }) {
  return (
    // Wrap your card div with the Link
    <Link
      to={`/tasks/${task.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        className="task-card"
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <span>Priority: {task.priority}</span>
        {/* If you have buttons in here, you'll need to add e.preventDefault() to their onClick handlers so they don't trigger the Link! */}
      </div>
    </Link>
  );
}

export default memo(TaskCard);
