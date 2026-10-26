import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { httpClient } from "../../../lib/httpClient";

function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTask() {
      try {
        const data = await httpClient(`tasks/${taskId}`);
        setTask(data);
      } catch (error) {
        console.error("Failed to fetch task", error);
        alert("Task not found!");
        navigate("/"); // Go back to board if error
      } finally {
        setIsLoading(false);
      }
    }
    fetchTask();
  }, [taskId, navigate]);

  if (isLoading) return <p>Loading task details...</p>;
  if (!task) return <p>Task not found.</p>;

  return (
    <div
      style={{
        padding: "20px",
        background: "var(--bg-sidebar)",
        borderRadius: "8px",
      }}
    >
      <Link
        to="/"
        style={{
          color: "var(--primary)",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        ← Back to Board
      </Link>

      <h1 style={{ marginTop: "20px" }}>{task.title}</h1>
      <p style={{ fontSize: "18px", color: "var(--text-muted)" }}>
        {task.description || "No description provided."}
      </p>

      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        <div>
          <strong>Status:</strong> {task.status}
        </div>
        <div>
          <strong>Priority:</strong> {task.priority}
        </div>
        <div>
          <strong>Created:</strong> {task.createdAt}
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
