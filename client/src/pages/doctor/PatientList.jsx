import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, ArrowRight } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getAllPatients } from "../../api/patients";
import { formatDate } from "../../lib/utils";

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

  return (
    <PageWrapper title="Patients" subtitle={`${pagination.total || 0} total patients`}>

      {/* Search */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ position: "relative", maxWidth: "380px" }}>
          <Search size={16} style={{
            position: "absolute", left: "14px", top: "50%",
            transform: "translateY(-50%)", color: "#94a3b8",
          }} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="form-input"
            style={{ paddingLeft: "42px" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              {["Patient", "Gender", "Blood Group", "Phone", "Joined", ""].map((h) => (
                <th key={h}>{h}</th>
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
                    margin: "0 auto",
                  }} />
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><Users size={22} color="#94a3b8" /></div>
                    <h3>No patients found</h3>
                    <p>Try a different search term</p>
                  </div>
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div className="avatar avatar-sm" style={{ background: "#eff6ff", color: "#2563eb", borderRadius: "10px" }}>
                        {patient.name[0]}
                      </div>
                      <span style={{ fontWeight: "600", color: "#0f172a" }}>{patient.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "#64748b" }}>
                    {patient.gender?.charAt(0) + patient.gender?.slice(1).toLowerCase()}
                  </td>
                  <td>
                    {patient.bloodGroup ? (
                      <span style={{
                        fontSize: "0.75rem", fontWeight: "700",
                        padding: "3px 10px", borderRadius: "999px",
                        background: "#eff6ff", color: "#2563eb",
                      }}>
                        {patient.bloodGroup.replace("_", " ")}
                      </span>
                    ) : (
                      <span style={{ color: "#cbd5e1" }}>—</span>
                    )}
                  </td>
                  <td style={{ color: "#64748b" }}>
                    {patient.phone || <span style={{ color: "#cbd5e1" }}>—</span>}
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                    {formatDate(patient.createdAt)}
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                      style={{
                        display: "flex", alignItems: "center", gap: "4px",
                        color: "#2563eb", fontSize: "0.8rem", fontWeight: "700",
                        background: "none", border: "none", cursor: "pointer",
                        fontFamily: "inherit", padding: "6px 12px",
                        borderRadius: "8px", transition: "background 0.15s ease",
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
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              Showing {patients.length} of {pagination.total} patients
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn btn-outline" style={{ padding: "7px 14px", fontSize: "0.8rem" }}>
                Previous
              </button>
              <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages} className="btn btn-outline" style={{ padding: "7px 14px", fontSize: "0.8rem" }}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}