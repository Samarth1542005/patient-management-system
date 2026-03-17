import Sidebar from "./Sidebar";

export default function PageWrapper({ children, title, subtitle, action }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
      <Sidebar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Sticky Header */}
        <header style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #e2e8f0",
          padding: "1.25rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <div>
            <h2 style={{
              fontSize: "1.375rem",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.025em",
              lineHeight: 1.3
            }}>{title}</h2>
            {subtitle && (
              <p style={{
                fontSize: "0.8rem",
                color: "#94a3b8",
                marginTop: "2px",
                fontWeight: "500"
              }}>{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </header>

        {/* Content */}
        <div className="animate-fade-in" style={{
          flex: 1,
          padding: "2rem 2.5rem 3rem",
          maxWidth: "1280px",
          width: "100%"
        }}>
          {children}
        </div>

      </main>
    </div>
  );
}