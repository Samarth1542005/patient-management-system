import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "relative",
        width: "56px",
        height: "28px",
        borderRadius: "999px",
        border: "none",
        cursor: "pointer",
        background: isDark
          ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
          : "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
        boxShadow: isDark
          ? "inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)"
          : "inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
      }}
    >
      {/* Stars for dark mode */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isDark ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div style={{ position: "absolute", top: "6px", left: "8px", width: "2px", height: "2px", background: "#fff", borderRadius: "50%", opacity: 0.6 }} />
        <div style={{ position: "absolute", top: "14px", left: "14px", width: "1.5px", height: "1.5px", background: "#fff", borderRadius: "50%", opacity: 0.4 }} />
        <div style={{ position: "absolute", top: "8px", left: "20px", width: "1px", height: "1px", background: "#fff", borderRadius: "50%", opacity: 0.5 }} />
      </div>

      {/* Toggle circle with icon */}
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: isDark ? "31px" : "3px",
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: isDark
            ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
            : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
          boxShadow: isDark
            ? "0 2px 8px rgba(59, 130, 246, 0.5)"
            : "0 2px 8px rgba(251, 191, 36, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {isDark ? (
          <Moon size={12} color="#fff" style={{ transform: "rotate(-20deg)" }} />
        ) : (
          <Sun size={12} color="#fff" />
        )}
      </div>
    </button>
  );
}
