import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, ArrowRight } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getAllPatients } from "../../api/patients";
import { formatDate } from "../../lib/utils";

const cardStyle = {
  background: "white",
  borderRadius: "16px",
  border: "1px solid #f1f5f9",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  overflow: "hidden",
};

export default function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await getAllPatients({ search, page, limit: 10 });
      setPatients(res.data.data.patients);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchPatients, 300);
    return () => clearTimeout(delay);
  }, [search, page]);

  const bloodGroupColors = {
    "A POS": "#eff6ff", "A NEG": "#eff6ff",
    "B POS": "#f0fdf4", "B NEG": "#f0fdf4",
    "AB POS": "#faf5ff", "AB NEG": "#faf5ff",
    "O POS": "#fff7ed", "O NEG": "#fff7ed",
  };

  return (
    <PageWrapper title="Patients" subtitle={`${pagination.total || 0} total patients`}>

      {/* Search */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ position: "relative", maxWidth: "380px" }}>
          <Search size={16} style={{
            position: "absolute", left: "14px", top: "50%",
            transform: "translateY(-50%)", color: "#94a3b8"
          }} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{
              width: "100%", padding: "11px 14px 11px 42px",
              border: "1.5px solid #e2e8f0", borderRadius: "12px",
              fontSize: "0.875rem", color: "#0f172a",
              backgroundColor: "white", outline: "none",
              boxSizing: "border-box", fontFamily: "inherit",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
            }}
            onFocus={(e) => e.target.style.borderColor = "#2563eb"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>
      </div>

      {/* Table */}
      <div style={cardStyle}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
              {["Patient", "Gender", "Blood Group", "Phone", "Joined", ""].map((h) => (
                <th key={h} style={{
                  textAlign: "left", padding: "12px 20px",
                  fontSize: "0.7rem", fontWeight: "700",
                  color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: "4rem", textAlign: "center" }}>
                  <div style={{
                    width: "28px", height: "28px",
                    border: "3px solid #2563eb", borderTopColor: "transparent",
                    borderRadius: "50%", animation: "spin 0.8s linear infinite",
                    margin: "0 auto"
                  }} />
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "4rem", textAlign: "center" }}>
                  <Users size={32} color="#cbd5e1" style={{ margin: "0 auto 0.75rem" }} />
                  <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>No patients found</p>
                </td>
              </tr>
            ) : (
              patients.map((patient, i) => (
                <tr key={patient.id} style={{
                  borderBottom: i < patients.length - 1 ? "1px solid #f8fafc" : "none",
                  transition: "background 0.1s"
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        background: "#eff6ff", display: "flex", alignItems: "center",
                        justifyContent: "center", color: "#2563eb",
                        fontWeight: "700", fontSize: "0.875rem", flexShrink: 0
                      }}>
                        {patient.name[0]}
                      </div>
                      <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#0f172a" }}>
                        {patient.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "0.875rem", color: "#64748b" }}>
                    {patient.gender?.charAt(0) + patient.gender?.slice(1).toLowerCase()}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    {patient.bloodGroup ? (
                      <span style={{
                        fontSize: "0.75rem", fontWeight: "700",
                        padding: "3px 10px", borderRadius: "999px",
                        background: "#eff6ff", color: "#2563eb"
                      }}>
                        {patient.bloodGroup.replace("_", " ")}
                      </span>
                    ) : (
                      <span style={{ color: "#cbd5e1", fontSize: "0.875rem" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "0.875rem", color: "#64748b" }}>
                    {patient.phone || <span style={{ color: "#cbd5e1" }}>—</span>}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "0.8rem", color: "#94a3b8" }}>
                    {formatDate(patient.createdAt)}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <button
                      onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                      style={{
                        display: "flex", alignItems: "center", gap: "4px",
                        color: "#2563eb", fontSize: "0.8rem", fontWeight: "700",
                        background: "none", border: "none", cursor: "pointer",
                        fontFamily: "inherit", padding: "6px 12px",
                        borderRadius: "8px", transition: "background 0.1s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#eff6ff"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                    >
                      View <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid #f1f5f9",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              Showing {patients.length} of {pagination.total} patients
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { label: "Previous", action: () => setPage(p => p - 1), disabled: page === 1 },
                { label: "Next", action: () => setPage(p => p + 1), disabled: page === pagination.totalPages }
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  disabled={btn.disabled}
                  style={{
                    padding: "7px 14px", fontSize: "0.8rem", fontWeight: "600",
                    border: "1.5px solid #e2e8f0", borderRadius: "8px",
                    background: "white", color: btn.disabled ? "#cbd5e1" : "#374151",
                    cursor: btn.disabled ? "not-allowed" : "pointer",
                    fontFamily: "inherit"
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}