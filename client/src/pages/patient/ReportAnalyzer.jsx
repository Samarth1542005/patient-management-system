import { useState, useRef } from "react";
import { Upload, FileText, Image, X, Loader, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import axiosInstance from "../../api/axiosInstance";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }
  return fullText.trim();
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function ReportAnalyzer() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF or image file (JPG, PNG, WEBP).");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB.");
      return;
    }
    setFile(selectedFile);
    setResult(null);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    handleFile(dropped);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      let payload = {};

      if (file.type === "application/pdf") {
        const text = await extractTextFromPDF(file);
        if (!text || text.length < 50) {
          setError("Could not extract text from this PDF. Try uploading an image instead.");
          setLoading(false);
          return;
        }
        payload = { type: "text", content: text };
      } else {
        const base64 = await fileToBase64(file);
        payload = { type: "image", content: base64, mimeType: file.type };
      }

      const res = await axiosInstance.post("/ai/analyze-report", payload);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to analyze report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setResult(null);
    setError("");
  };

  const isPDF = file?.type === "application/pdf";

  return (
    <PageWrapper
      title="Medical Report Analyzer"
      subtitle="Upload your medical report and get an AI-powered explanation in simple language"
    >
      <div style={{ maxWidth: "720px" , margin: "0 auto"}}>

        {/* Disclaimer */}
        <div style={{
          display: "flex", alignItems: "flex-start", gap: "10px",
          backgroundColor: "#eff6ff", border: "1px solid #bfdbfe",
          borderRadius: "12px", padding: "14px 16px", marginBottom: "1.5rem",
        }}>
          <AlertCircle size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: "2px" }} />
          <p style={{ color: "#1e40af", fontSize: "0.8rem", lineHeight: "1.6" }}>
            <strong>Disclaimer:</strong> This tool provides general explanations of medical reports for informational purposes only. Always consult a qualified doctor for medical advice and diagnosis.
          </p>
        </div>

        {/* Upload Area */}
        <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <label style={{
            display: "block", fontWeight: "700",
            color: "#0f172a", fontSize: "0.9rem", marginBottom: "8px",
          }}>
            Upload Medical Report
          </label>
          <p style={{ color: "#64748b", fontSize: "0.8rem", marginBottom: "16px" }}>
            Supports PDF, JPG, PNG, WEBP — max 10MB
          </p>

          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? "#2563eb" : "#e2e8f0"}`,
                borderRadius: "12px",
                padding: "3rem 2rem",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: dragging ? "#eff6ff" : "#fafbfc",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{
                width: "56px", height: "56px",
                backgroundColor: "#eff6ff", borderRadius: "14px",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                <Upload size={24} color="#2563eb" />
              </div>
              <p style={{ fontWeight: "600", color: "#0f172a", fontSize: "0.9rem", marginBottom: "6px" }}>
                Drop your report here or click to browse
              </p>
              <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                PDF, JPG, PNG, WEBP up to 10MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div style={{
              display: "flex", alignItems: "center", gap: "14px",
              padding: "14px 16px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
            }}>
              <div style={{
                width: "44px", height: "44px",
                backgroundColor: isPDF ? "#fef3c7" : "#eff6ff",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {isPDF
                  ? <FileText size={22} color="#d97706" />
                  : <Image size={22} color="#2563eb" />
                }
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <p style={{
                  fontWeight: "600", color: "#0f172a", fontSize: "0.875rem",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {file.name}
                </p>
                <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: "2px" }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB · {isPDF ? "PDF Document" : "Image"}
                </p>
              </div>
              <button
                onClick={handleRemove}
                style={{
                  width: "32px", height: "32px",
                  borderRadius: "8px", border: "none",
                  backgroundColor: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#94a3b8", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fee2e2"; e.currentTarget.style.color = "#dc2626"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              backgroundColor: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "8px", padding: "10px 14px", marginTop: "12px",
              color: "#dc2626", fontSize: "0.825rem",
            }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            style={{
              width: "100%", padding: "13px",
              backgroundColor: !file || loading ? "#93c5fd" : "#2563eb",
              color: "#fff", border: "none", borderRadius: "10px",
              fontSize: "0.9rem", fontWeight: "600",
              cursor: !file || loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "8px",
              marginTop: "14px",
              boxShadow: file && !loading ? "0 2px 8px rgba(37,99,235,0.3)" : "none",
              transition: "all 0.2s",
            }}
          >
            {loading ? (
              <>
                <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />
                Analyzing report...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Analyze Report
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Summary */}
            <div className="card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <CheckCircle size={18} color="#16a34a" />
                <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Report Summary
                </p>
              </div>
              <p style={{ color: "#334155", fontSize: "0.875rem", lineHeight: "1.8" }}>
                {result.summary}
              </p>
            </div>

            {/* Key Findings */}
            {result.keyFindings?.length > 0 && (
              <div className="card" style={{ padding: "1.25rem" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                  Key Findings
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {result.keyFindings.map((finding, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: "10px",
                      padding: "10px 14px",
                      backgroundColor: "#f8fafc", borderRadius: "8px",
                      border: "1px solid #f1f5f9",
                    }}>
                      <div style={{
                        width: "6px", height: "6px", borderRadius: "50%",
                        backgroundColor: "#2563eb", flexShrink: 0, marginTop: "6px",
                      }} />
                      <span style={{ fontSize: "0.875rem", color: "#0f172a" }}>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Abnormal Values */}
            {result.abnormalValues?.length > 0 && (
              <div className="card" style={{ padding: "1.25rem" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                  Values Requiring Attention
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {result.abnormalValues.map((val, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: "10px",
                      padding: "10px 14px",
                      backgroundColor: "#fef2f2", borderRadius: "8px",
                      border: "1px solid #fecaca",
                    }}>
                      <AlertCircle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: "1px" }} />
                      <span style={{ fontSize: "0.875rem", color: "#0f172a" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations && (
              <div className="card" style={{ padding: "1.25rem" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                  Recommendations
                </p>
                <p style={{ color: "#334155", fontSize: "0.875rem", lineHeight: "1.7" }}>
                  {result.recommendations}
                </p>
              </div>
            )}

            {/* Consult Doctor */}
            {result.consultDoctor && (
              <div style={{
                display: "flex", alignItems: "flex-start", gap: "10px",
                backgroundColor: "#fffbeb", border: "1px solid #fde68a",
                borderRadius: "12px", padding: "14px 16px",
              }}>
                <AlertCircle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
                <p style={{ color: "#92400e", fontSize: "0.825rem", lineHeight: "1.6" }}>
                  <strong>Consult a Doctor:</strong> {result.consultDoctor}
                </p>
              </div>
            )}
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