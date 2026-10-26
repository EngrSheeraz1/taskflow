import styles from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../features/settings/ThemeContext"; // Import hook

const navigation = [
  { icon: "▦", label: "Overview" },
  { icon: "▤", label: "My Tasks", active: true },
  { icon: "▣", label: "Projects" },
  { icon: "▧", label: "Calendar" },
];

function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>TaskFlow</div>

      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          Board
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          Settings
        </NavLink>
      </nav>

      {/* 🌙 Dark Mode Toggle Button */}
      <div style={{ marginTop: "auto", padding: "20px" }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-main)",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
