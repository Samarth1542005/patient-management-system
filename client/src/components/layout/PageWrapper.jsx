import Sidebar from "./Sidebar";

export default function PageWrapper({ children, title, subtitle, action }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>
      <Sidebar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Sticky Header */}
        <header style={{
          background: "white",
          borderBottom: "1px solid #f1f5f9",
          padding: "1.25rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
        }}>
          <div>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.025em",
              lineHeight: 1.2
            }}>{title}</h2>
            {subtitle && (
              <p style={{
                fontSize: "0.8rem",
                color: "#94a3b8",
                marginTop: "3px",
                fontWeight: "500"
              }}>{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: "2rem 2.5rem", maxWidth: "1280px", width: "100%" }}>
          {children}
        </div>

      </main>
    </div>
  );
}