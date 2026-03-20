import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Stethoscope, ArrowRight, User, Briefcase } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import useAuthStore from "../../store/authStore";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function CompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const token = location.state?.token;

  const [role, setRole] = useState("PATIENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "MALE",
    specialization: "",
    qualification: "",
    experience: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Get current Supabase user
      const { data: { user } } = await supabase.auth.getUser(token);

      if (!user) {
        setError("Session expired. Please sign in again.");
        navigate("/login");
        return;
      }

      // Create profile in our backend
      const res = await axiosInstance.post(
        "/auth/complete-profile",
        { ...formData, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const dbUser = res.data.data;
      setAuth(token, dbUser);

      if (role === "DOCTOR") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    border: "1.5px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    fontSize: "0.9rem",
    color: "#f1f5f9",
    background: "#0f172a",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: "8px",
    letterSpacing: "0.02em",
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#030712",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      fontFamily: "inherit",
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* Logo */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          marginBottom: "2.5rem", justifyContent: "center",
        }}>
          <div style={{
            width: "40px", height: "40px",
            background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(14,165,233,0.3)",
          }}>
            <Stethoscope size={20} color="white" />
          </div>
          <span style={{ color: "white", fontWeight: "800", fontSize: "1.2rem", letterSpacing: "-0.02em" }}>
            MediCare
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px",
          padding: "2.5rem",
        }}>
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h2 style={{
              fontSize: "1.5rem", fontWeight: "800",
              color: "white", letterSpacing: "-0.02em", marginBottom: "8px",
            }}>
              Complete your profile
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
              Just a few more details to get you started
            </p>
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "10px", padding: "12px 14px",
              color: "#f87171", fontSize: "0.825rem", marginBottom: "1.25rem",
            }}>
              {error}
            </div>
          )}

          {/* Role Toggle */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "10px", marginBottom: "1.5rem",
          }}>
            {[
              { value: "PATIENT", label: "Patient", icon: User },
              { value: "DOCTOR", label: "Doctor", icon: Briefcase },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                style={{
                  padding: "12px",
                  background: role === value
                    ? "rgba(14,165,233,0.15)"
                    : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${role === value ? "#0ea5e9" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "12px",
                  color: role === value ? "#0ea5e9" : "#64748b",
                  fontWeight: "600", fontSize: "0.875rem",
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px",
                  transition: "all 0.2s ease",
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleChange} placeholder="John Doe" required
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#0ea5e9"; e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              {/* Patient fields */}
              {role === "PATIENT" && (
                <>
                  <div>
                    <label style={labelStyle}>Date of Birth</label>
                    <input
                      type="date" name="dob" value={formData.dob}
                      onChange={handleChange} required
                      style={{ ...inputStyle, colorScheme: "dark" }}
                      onFocus={(e) => { e.target.style.borderColor = "#0ea5e9"; e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.1)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Gender</label>
                    <select
                      name="gender" value={formData.gender}
                      onChange={handleChange}
                      style={{ ...inputStyle, colorScheme: "dark" }}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </>
              )}

              {/* Doctor fields */}
              {role === "DOCTOR" && (
                <>
                  <div>
                    <label style={labelStyle}>Specialization</label>
                    <input
                      type="text" name="specialization" value={formData.specialization}
                      onChange={handleChange} placeholder="e.g. Cardiology" required
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = "#0ea5e9"; e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.1)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Qualification</label>
                    <input
                      type="text" name="qualification" value={formData.qualification}
                      onChange={handleChange} placeholder="e.g. MBBS, MD" required
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = "#0ea5e9"; e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.1)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Years of Experience</label>
                    <input
                      type="number" name="experience" value={formData.experience}
                      onChange={handleChange} placeholder="e.g. 5" required
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = "#0ea5e9"; e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.1)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </>
              )}

              <button
                type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "14px",
                  background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                  color: "white", border: "none", borderRadius: "12px",
                  fontSize: "0.95rem", fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 15px rgba(14,165,233,0.3)",
                  marginTop: "0.5rem",
                  transition: "all 0.2s ease",
                }}
              >
                {loading ? "Setting up..." : "Complete Setup"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}