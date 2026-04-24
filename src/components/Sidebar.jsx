import { useApp } from "../context/AppContext";
import styles from "./Sidebar.module.css";
import logo from "../assets/Group 9.png";

export default function Sidebar() {
  const { theme, toggleTheme } = useApp();

  return (
    <aside className={styles.sidebar} aria-label="Application sidebar">
      {/* Logo */}
      <div className={styles.logo} aria-label="Invoice app logo">
        <img src={logo} alt="Invoice app logo" width="48" height="48" />
      </div>

      <div className={styles.bottom}>
        {/* Theme toggle */}
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Avatar */}
        <div className={styles.divider} />
        <div className={styles.avatar} aria-hidden="true">
          <img
            src="https://api.dicebear.com/9.x/notionists/svg?seed=Tunchi&backgroundColor=7c5dfa&radius=50"
            alt="User avatar"
            width="36"
            height="36"
          />
        </div>
      </div>
    </aside>
  );
}
