import { useState } from "react";
import { Activity, Send, AlertCircle, CheckCircle, Info, Stethoscope, RefreshCw, Sparkles, Brain, Zap } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import axiosInstance from "../../api/axiosInstance";
import { useTheme } from "../../context/ThemeContext";

const severityConfig = {
  low: { 
    color: "#10b981", 
    bgLight: "#ecfdf5", 
    bgDark: "rgba(16, 185, 129, 0.1)",
    borderLight: "#a7f3d0", 
    borderDark: "rgba(16, 185, 129, 0.2)",
    label: "Low Severity",
    glow: "rgba(16, 185, 129, 0.3)"
  },
  medium: { 
    color: "#f59e0b", 
    bgLight: "#fffbeb", 
    bgDark: "rgba(245, 158, 11, 0.1)",
    borderLight: "#fde68a", 
    borderDark: "rgba(245, 158, 11, 0.2)",
    label: "Medium Severity",
    glow: "rgba(245, 158, 11, 0.3)"
  },
  high: { 
    color: "#ef4444", 
    bgLight: "#fef2f2", 
    bgDark: "rgba(239, 68, 68, 0.1)",
    borderLight: "#fecaca", 
    borderDark: "rgba(239, 68, 68, 0.2)",
    label: "High Severity",
    glow: "rgba(239, 68, 68, 0.3)"
  },
};

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

  const colors = {
    cardBg: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.8)",
    cardBorder: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
    text: isDark ? "#f1f5f9" : "#0f172a",
    textSecondary: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b",
    textMuted: isDark ? "rgba(255, 255, 255, 0.4)" : "#94a3b8",
    inputBg: isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
    inputBorder: isDark ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0",
    infoBg: isDark ? "rgba(14, 165, 233, 0.1)" : "#eff6ff",
    infoBorder: isDark ? "rgba(14, 165, 233, 0.2)" : "#bfdbfe",
    infoText: isDark ? "#7dd3fc" : "#1e40af",
    errorBg: isDark ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
    errorBorder: isDark ? "rgba(239, 68, 68, 0.2)" : "#fecaca",
    errorText: isDark ? "#fca5a5" : "#dc2626",
    resultCardBg: isDark ? "rgba(255, 255, 255, 0.02)" : "#f8fafc",
    resultCardBorder: isDark ? "rgba(255, 255, 255, 0.04)" : "#f1f5f9",
  };

  return (
    <PageWrapper
      title="AI Symptom Checker"
      subtitle="Describe your symptoms and get AI-powered health insights"
    >
      <div style={{ maxWidth: "800px" , margin: "0 auto"}}>

        {/* Hero Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "1.5rem",
            padding: "1.25rem 1.5rem",
            background: isDark 
              ? "linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)"
              : "linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%)",
            borderRadius: "16px",
            border: `1px solid ${isDark ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.1)"}`,
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(14, 165, 233, 0.35)",
              flexShrink: 0,
            }}
          >
            <Brain size={28} color="white" strokeWidth={2} />
          </div>
          <div>
            <h2 style={{ 
              fontSize: "1.1rem", 
              fontWeight: "700", 
              color: colors.text,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}>
              Powered by AI
              <Sparkles size={16} color="#0ea5e9" />
            </h2>
            <p style={{ fontSize: "0.85rem", color: colors.textSecondary, lineHeight: "1.5" }}>
              Get instant analysis of your symptoms with our advanced AI technology
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          display: "flex", 
          alignItems: "flex-start", 
          gap: "12px",
          backgroundColor: colors.infoBg, 
          border: `1px solid ${colors.infoBorder}`,
          borderRadius: "14px", 
          padding: "16px 18px",
          marginBottom: "1.5rem",
        }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              background: isDark ? "rgba(14, 165, 233, 0.2)" : "rgba(37, 99, 235, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Info size={16} color="#0ea5e9" />
          </div>
          <div>
            <p style={{ fontWeight: "700", color: colors.infoText, fontSize: "0.85rem", marginBottom: "4px" }}>
              Important Disclaimer
            </p>
            <p style={{ color: isDark ? "rgba(125, 211, 252, 0.8)" : "#3b82f6", fontSize: "0.8rem", lineHeight: "1.6" }}>
              This tool provides general health information only and is not a substitute for professional medical advice. Always consult a qualified doctor for diagnosis and treatment.
            </p>
          </div>
        </div>

        {/* Input Card */}
        <div 
          style={{ 
            background: colors.cardBg,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: "20px",
            padding: "1.75rem", 
            marginBottom: "1.5rem",
            boxShadow: isDark 
              ? "0 4px 24px rgba(0, 0, 0, 0.2)"
              : "0 4px 24px rgba(0, 0, 0, 0.04)",
          }}
        >
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "700",
            color: colors.text, 
            fontSize: "0.95rem", 
            marginBottom: "10px",
          }}>
            <Activity size={18} color="#0ea5e9" />
            Describe your symptoms
          </label>
          <p style={{ color: colors.textSecondary, fontSize: "0.825rem", marginBottom: "14px", lineHeight: "1.5" }}>
            Be as specific as possible - include location, duration, and intensity (e.g. "sharp chest pain for 2 days, worse when breathing")
          </p>

          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. I have a persistent headache for 3 days, mild fever, and feel nauseous..."
            rows={5}
            style={{
              width: "100%", 
              padding: "16px 18px",
              background: colors.inputBg,
              border: `2px solid ${colors.inputBorder}`,
              borderRadius: "14px",
              fontSize: "0.9rem", 
              fontFamily: "inherit",
              color: colors.text, 
              resize: "vertical",
              outline: "none", 
              lineHeight: "1.7",
              boxSizing: "border-box",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#0ea5e9";
              e.target.style.boxShadow = "0 0 0 4px rgba(14, 165, 233, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.inputBorder;
              e.target.style.boxShadow = "none";
            }}
          />

          {error && (
            <div style={{
              display: "flex", 
              alignItems: "center", 
              gap: "10px",
              backgroundColor: colors.errorBg, 
              border: `1px solid ${colors.errorBorder}`,
              borderRadius: "12px", 
              padding: "12px 16px",
              marginTop: "14px", 
              color: colors.errorText, 
              fontSize: "0.85rem",
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "18px" }}>
            <button
              onClick={analyzeSymptoms}
              disabled={loading}
              style={{
                flex: 1, 
                padding: "14px 24px",
                background: loading 
                  ? (isDark ? "rgba(14, 165, 233, 0.5)" : "#93c5fd")
                  : "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                color: "#fff", 
                border: "none",
                borderRadius: "14px", 
                fontSize: "0.95rem",
                fontWeight: "600", 
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", 
                alignItems: "center",
                justifyContent: "center", 
                gap: "10px",
                boxShadow: loading ? "none" : "0 4px 15px rgba(14, 165, 233, 0.35)",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(14, 165, 233, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 15px rgba(14, 165, 233, 0.35)";
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Analyze Symptoms
                </>
              )}
            </button>

            {result && (
              <button
                onClick={handleReset}
                style={{
                  padding: "14px 24px",
                  background: isDark ? "rgba(255, 255, 255, 0.05)" : "transparent",
                  color: colors.textSecondary, 
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: "14px", 
                  fontSize: "0.95rem",
                  fontWeight: "600", 
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.08)" : "#f1f5f9";
                  e.currentTarget.style.color = colors.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.05)" : "transparent";
                  e.currentTarget.style.color = colors.textSecondary;
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
              <div 
                style={{
                  display: "flex", 
                  alignItems: "flex-start", 
                  gap: "14px",
                  background: isDark ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
                  border: `1px solid ${isDark ? "rgba(239, 68, 68, 0.2)" : "#fecaca"}`,
                  borderRadius: "16px", 
                  padding: "18px 20px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: isDark ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <AlertCircle size={20} color="#ef4444" />
                </div>
                <div>
                  <p style={{ 
                    fontWeight: "700", 
                    color: isDark ? "#fca5a5" : "#dc2626", 
                    fontSize: "0.95rem", 
                    marginBottom: "6px" 
                  }}>
                    Seek immediate medical attention
                  </p>
                  <p style={{ 
                    color: isDark ? "rgba(252, 165, 165, 0.8)" : "#b91c1c", 
                    fontSize: "0.85rem", 
                    lineHeight: "1.6" 
                  }}>
                    {result.warning}
                  </p>
                </div>
              </div>
            )}

            {/* Severity + Doctor row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

              {/* Severity */}
              <div 
                style={{ 
                  background: colors.cardBg,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: "18px",
                  padding: "1.5rem",
                }}
              >
                <p style={{ 
                  fontSize: "0.7rem", 
                  fontWeight: "700", 
                  color: colors.textMuted, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.08em", 
                  marginBottom: "12px" 
                }}>
                  Severity Level
                </p>
                <div style={{
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "10px",
                  background: isDark ? severity.bgDark : severity.bgLight, 
                  border: `1px solid ${isDark ? severity.borderDark : severity.borderLight}`,
                  borderRadius: "12px", 
                  padding: "10px 16px",
                  boxShadow: `0 2px 10px ${severity.glow}`,
                }}>
                  <div style={{
                    width: "10px", 
                    height: "10px", 
                    borderRadius: "50%",
                    backgroundColor: severity.color,
                    boxShadow: `0 0 8px ${severity.color}`,
                  }} />
                  <span style={{ color: severity.color, fontWeight: "700", fontSize: "0.9rem" }}>
                    {severity.label}
                  </span>
                </div>
              </div>

              {/* Recommended Doctor */}
              <div 
                style={{ 
                  background: colors.cardBg,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: "18px",
                  padding: "1.5rem",
                }}
              >
                <p style={{ 
                  fontSize: "0.7rem", 
                  fontWeight: "700", 
                  color: colors.textMuted, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.08em", 
                  marginBottom: "12px" 
                }}>
                  Consult a
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "12px",
                    background: isDark ? "rgba(14, 165, 233, 0.15)" : "#eff6ff",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(14, 165, 233, 0.2)",
                  }}>
                    <Stethoscope size={18} color="#0ea5e9" />
                  </div>
                  <span style={{ fontWeight: "700", color: colors.text, fontSize: "0.95rem" }}>
                    {result.recommendedDoctor}
                  </span>
                </div>
              </div>
            </div>

            {/* Possible Conditions */}
            <div 
              style={{ 
                background: colors.cardBg,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: "18px",
                padding: "1.5rem",
              }}
            >
              <p style={{ 
                fontSize: "0.7rem", 
                fontWeight: "700", 
                color: colors.textMuted, 
                textTransform: "uppercase", 
                letterSpacing: "0.08em", 
                marginBottom: "14px" 
              }}>
                Possible Conditions
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {result.possibleConditions.map((condition, i) => (
                  <div 
                    key={i} 
                    style={{
                      display: "flex", 
                      alignItems: "center", 
                      gap: "12px",
                      padding: "12px 16px",
                      background: colors.resultCardBg, 
                      borderRadius: "12px",
                      border: `1px solid ${colors.resultCardBorder}`,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.05)" : "#f1f5f9";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = colors.resultCardBg;
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: isDark ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle size={14} color="#0ea5e9" />
                    </div>
                    <span style={{ fontSize: "0.9rem", color: colors.text, fontWeight: "500" }}>
                      {condition}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div 
              style={{ 
                background: colors.cardBg,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: "18px",
                padding: "1.5rem",
              }}
            >
              <p style={{ 
                fontSize: "0.7rem", 
                fontWeight: "700", 
                color: colors.textMuted, 
                textTransform: "uppercase", 
                letterSpacing: "0.08em", 
                marginBottom: "12px" 
              }}>
                General Advice
              </p>
              <p style={{ color: colors.textSecondary, fontSize: "0.9rem", lineHeight: "1.75" }}>
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
