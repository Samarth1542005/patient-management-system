import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../api/auth";
import { Stethoscope, ArrowRight } from "lucide-react";

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
        <div className="animate-fade-in" style={{ width: "100%", maxWidth: "480px" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2rem" }}>
            <div style={{
              width: "38px", height: "38px", background: "#2563eb",
              borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
            }}>
              <Stethoscope size={18} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", lineHeight: 1 }}>Create Account</h2>
              <p style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "2px" }}>Join MediCare today</p>
            </div>
          </div>

          {/* Role Toggle */}
          <div className="tab-bar" style={{ width: "100%", marginBottom: "1.5rem" }}>
            {["PATIENT", "DOCTOR"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`tab-btn ${role === r ? "active" : ""}`}
                style={{ flex: 1, justifyContent: "center" }}
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
                <label className="form-label">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className="form-input" />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className="form-input" />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className="form-input" />
              </div>

              {role === "PATIENT" && (
                <>
                  <div>
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="form-input">
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
                    <label className="form-label">Specialization</label>
                    <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Cardiology" required className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Qualification</label>
                    <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. MBBS, MD" required className="form-input" />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="form-label">Years of Experience</label>
                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5" required className="form-input" />
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: "100%", padding: "13px",
                fontSize: "0.95rem", marginTop: "0.5rem",
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              }}
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