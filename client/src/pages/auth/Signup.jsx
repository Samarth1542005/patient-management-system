import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../api/auth";
import { Stethoscope, ArrowRight } from "lucide-react";

const inputStyle = {
  width: "100%", padding: "11px 14px",
  border: "1.5px solid #e2e8f0", borderRadius: "10px",
  fontSize: "0.875rem", color: "#0f172a",
  backgroundColor: "white", outline: "none",
  boxSizing: "border-box", fontFamily: "inherit"
};

const labelStyle = {
  display: "block", fontSize: "0.8rem",
  fontWeight: "600", color: "#374151", marginBottom: "6px"
};

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("PATIENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "", password: "", name: "",
    dob: "", gender: "MALE",
    specialization: "", qualification: "", experience: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup({ ...formData, role });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>

      {/* Left branding strip */}
      <div style={{
        width: "42px", background: "linear-gradient(180deg, #1e3a8a, #2563eb)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          color: "white", fontWeight: "800", fontSize: "0.75rem",
          letterSpacing: "0.15em", writingMode: "vertical-rl",
          textTransform: "uppercase", opacity: 0.7
        }}>MediCare</span>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "480px" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2rem" }}>
            <div style={{
              width: "38px", height: "38px", background: "#2563eb",
              borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Stethoscope size={18} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", lineHeight: 1 }}>Create Account</h2>
              <p style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "2px" }}>Join MediCare today</p>
            </div>
          </div>

          {/* Role Toggle */}
          <div style={{
            display: "flex", background: "#f1f5f9",
            borderRadius: "12px", padding: "4px", marginBottom: "1.5rem"
          }}>
            {["PATIENT", "DOCTOR"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  flex: 1, padding: "9px",
                  borderRadius: "9px", border: "none",
                  background: role === r ? "white" : "transparent",
                  color: role === r ? "#2563eb" : "#64748b",
                  fontWeight: "700", fontSize: "0.875rem",
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: role === r ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.15s"
                }}
              >
                {r === "PATIENT" ? "Patient" : "Doctor"}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              color: "#dc2626", padding: "10px 14px",
              borderRadius: "10px", marginBottom: "1.25rem", fontSize: "0.875rem"
            }}>{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
              </div>

              {role === "PATIENT" && (
                <>
                  <div>
                    <label style={labelStyle}>Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
                  </div>
                  <div>
                    <label style={labelStyle}>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </>
              )}

              {role === "DOCTOR" && (
                <>
                  <div>
                    <label style={labelStyle}>Specialization</label>
                    <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Cardiology" required style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
                  </div>
                  <div>
                    <label style={labelStyle}>Qualification</label>
                    <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. MBBS, MD" required style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Years of Experience</label>
                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5" required style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "#93c5fd" : "#2563eb",
                color: "white", border: "none",
                borderRadius: "10px", fontSize: "0.95rem",
                fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px",
                fontFamily: "inherit", marginTop: "0.5rem"
              }}
              onMouseEnter={(e) => { if (!loading) e.target.style.background = "#1d4ed8" }}
              onMouseLeave={(e) => { if (!loading) e.target.style.background = "#2563eb" }}
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.875rem", marginTop: "1.25rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2563eb", fontWeight: "700", textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}