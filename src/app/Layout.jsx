import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import styles from "./App.module.css";

function Layout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <main className={styles.main}>
        {/* Child routes (Board, Settings, etc.) render here */}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
