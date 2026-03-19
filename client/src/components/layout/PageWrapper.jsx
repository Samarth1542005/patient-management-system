import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";

export default function PageWrapper({ children, title, subtitle, action }) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-bg)",
        transition: "background-color 0.3s ease",
      }}
    >
      <Sidebar />
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          position: "relative",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: theme === "dark" ? 0.3 : 0.5,
            background: `
              radial-gradient(ellipse at 0% 0%, rgba(14, 165, 233, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 100% 100%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
            `,
            pointerEvents: "none",
          }}
        />

        {/* Sticky Header */}
        <header
          className="glass"
          style={{
            padding: "1.25rem 2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 10,
            borderBottom: "1px solid var(--color-border-light)",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                color: "var(--color-text)",
                letterSpacing: "-0.03em",
                lineHeight: 1.3,
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-text-muted)",
                  marginTop: "4px",
                  fontWeight: "500",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </header>

        {/* Content */}
        <div
          className="animate-fade-in"
          style={{
            flex: 1,
            padding: "2rem 2.5rem 3rem",
            maxWidth: "1400px",
            width: "100%",
            position: "relative",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
