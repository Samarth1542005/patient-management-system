import { useState } from "react";
import { Activity, Send, AlertCircle, CheckCircle, Info, Stethoscope, RefreshCw } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import axiosInstance from "../../api/axiosInstance";

const severityConfig = {
  low: { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", label: "Low Severity" },
  medium: { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "Medium Severity" },
  high: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "High Severity" },
};

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      setError("Please describe your symptoms.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axiosInstance.post("/ai/symptom-check", { symptoms });
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to analyze symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms("");
    setResult(null);
    setError("");
  };

  const severity = result ? severityConfig[result.severity] || severityConfig.medium : null;

  return (
    <PageWrapper
      title="Symptom Checker"
      subtitle="Describe your symptoms and get AI-powered insights"
    >
      <div style={{ maxWidth: "720px" }}>

        {/* Disclaimer */}
        <div style={{
          display: "flex", alignItems: "flex-start", gap: "10px",
          backgroundColor: "#eff6ff", border: "1px solid #bfdbfe",
          borderRadius: "12px", padding: "14px 16px",
          marginBottom: "1.5rem",
        }}>
          <Info size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: "2px" }} />
          <p style={{ color: "#1e40af", fontSize: "0.8rem", lineHeight: "1.6" }}>
            <strong>Disclaimer:</strong> This tool provides general health information only and is not a substitute for professional medical advice. Always consult a qualified doctor for diagnosis and treatment.
          </p>
        </div>

        {/* Input Card */}
        <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <label style={{
            display: "block", fontWeight: "700",
            color: "#0f172a", fontSize: "0.9rem", marginBottom: "8px",
          }}>
            Describe your symptoms
          </label>
          <p style={{ color: "#64748b", fontSize: "0.8rem", marginBottom: "12px" }}>
            Be as specific as possible — include location, duration, and intensity (e.g. "sharp chest pain for 2 days, worse when breathing")
          </p>

          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. I have a persistent headache for 3 days, mild fever, and feel nauseous..."
            rows={4}
            style={{
              width: "100%", padding: "12px 14px",
              border: "1px solid #e2e8f0", borderRadius: "10px",
              fontSize: "0.875rem", fontFamily: "inherit",
              color: "#0f172a", resize: "vertical",
              outline: "none", lineHeight: "1.6",
              boxSizing: "border-box",
              transition: "border-color 0.15s ease",
            }}
            onFocus={(e) => e.target.style.borderColor = "#2563eb"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />

          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              backgroundColor: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "8px", padding: "10px 14px",
              marginTop: "12px", color: "#dc2626", fontSize: "0.825rem",
            }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
            <button
              onClick={analyzeSymptoms}
              disabled={loading}
              style={{
                flex: 1, padding: "12px",
                backgroundColor: loading ? "#93c5fd" : "#2563eb",
                color: "#fff", border: "none",
                borderRadius: "10px", fontSize: "0.9rem",
                fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px",
                boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Analyze Symptoms
                </>
              )}
            </button>

            {result && (
              <button
                onClick={handleReset}
                style={{
                  padding: "12px 20px",
                  backgroundColor: "transparent",
                  color: "#64748b", border: "1px solid #e2e8f0",
                  borderRadius: "10px", fontSize: "0.9rem",
                  fontWeight: "600", cursor: "pointer",
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Warning banner */}
            {result.warning && (
              <div style={{
                display: "flex", alignItems: "flex-start", gap: "10px",
                backgroundColor: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: "12px", padding: "14px 16px",
              }}>
                <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: "1px" }} />
                <div>
                  <p style={{ fontWeight: "700", color: "#dc2626", fontSize: "0.875rem", marginBottom: "4px" }}>
                    Seek immediate medical attention
                  </p>
                  <p style={{ color: "#b91c1c", fontSize: "0.825rem", lineHeight: "1.5" }}>
                    {result.warning}
                  </p>
                </div>
              </div>
            )}

            {/* Severity + Doctor row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

              {/* Severity */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                  Severity Level
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  backgroundColor: severity.bg, border: `1px solid ${severity.border}`,
                  borderRadius: "8px", padding: "8px 14px",
                }}>
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    backgroundColor: severity.color,
                  }} />
                  <span style={{ color: severity.color, fontWeight: "700", fontSize: "0.875rem" }}>
                    {severity.label}
                  </span>
                </div>
              </div>

              {/* Recommended Doctor */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                  Consult a
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    backgroundColor: "#eff6ff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Stethoscope size={16} color="#2563eb" />
                  </div>
                  <span style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>
                    {result.recommendedDoctor}
                  </span>
                </div>
              </div>
            </div>

            {/* Possible Conditions */}
            <div className="card" style={{ padding: "1.25rem" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                Possible Conditions
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {result.possibleConditions.map((condition, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 14px",
                    backgroundColor: "#f8fafc", borderRadius: "8px",
                    border: "1px solid #f1f5f9",
                  }}>
                    <CheckCircle size={15} color="#2563eb" />
                    <span style={{ fontSize: "0.875rem", color: "#0f172a", fontWeight: "500" }}>
                      {condition}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div className="card" style={{ padding: "1.25rem" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                General Advice
              </p>
              <p style={{ color: "#334155", fontSize: "0.875rem", lineHeight: "1.7" }}>
                {result.advice}
              </p>
            </div>

          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </PageWrapper>
  );
}