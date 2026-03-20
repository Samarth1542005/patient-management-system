import { useState, useEffect } from "react";
import { FileText, Download } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyPrescriptions } from "../../api/prescriptions";
import { formatDateTime } from "../../lib/utils";
import jsPDF from "jspdf";

const downloadPrescriptionPDF = (presc) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // ── Header ──────────────────────────────────────
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("MediCare", 20, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Patient Management System", 20, 27);
  doc.text("Prescription Report", pageWidth - 20, 27, { align: "right" });

  y = 55;

  // ── Prescription Info ────────────────────────────
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(presc.diagnosis, 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${formatDateTime(presc.createdAt)}`, 20, y);
  y += 7;

  // ── Doctor Info ──────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 28, 3, 3, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Prescribed by", 22, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235);
  doc.text(presc.doctor?.name || "Doctor", 22, y + 18);

  if (presc.doctor?.specialization) {
    doc.setTextColor(100, 116, 139);
    doc.text(presc.doctor.specialization, 22, y + 25);
  }

  y += 38;

  // ── Notes ────────────────────────────────────────
  if (presc.notes) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Doctor's Notes", 20, y);
    y += 7;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    const noteLines = doc.splitTextToSize(presc.notes, pageWidth - 40);
    doc.text(noteLines, 20, y);
    y += noteLines.length * 6 + 8;
  }

  // ── Divider ──────────────────────────────────────
  doc.setDrawColor(226, 232, 240);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;

  // ── Medicines Header ─────────────────────────────
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`Medicines (${presc.medicines?.length || 0})`, 20, y);
  y += 10;

  // ── Medicine Table Header ────────────────────────
  doc.setFillColor(37, 99, 235);
  doc.rect(15, y, pageWidth - 30, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Medicine", 22, y + 7);
  doc.text("Dosage", 90, y + 7);
  doc.text("Frequency", 125, y + 7);
  doc.text("Duration", 165, y + 7);
  y += 10;

  // ── Medicine Rows ────────────────────────────────
  presc.medicines?.forEach((med, index) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    const rowBg = index % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
    doc.setFillColor(...rowBg);
    doc.rect(15, y, pageWidth - 30, 12, "F");

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(med.name, 22, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(37, 99, 235);
    doc.text(med.dosage || "-", 90, y + 8);

    doc.setTextColor(100, 116, 139);
    doc.text(med.frequency || "-", 125, y + 8);
    doc.text(med.duration || "-", 165, y + 8);

    if (med.instructions) {
      y += 12;
      doc.setFillColor(...rowBg);
      doc.rect(15, y, pageWidth - 30, 8, "F");
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text(`  Instructions: ${med.instructions}`, 22, y + 5);
    }

    y += 12;
  });

  // ── Footer ───────────────────────────────────────
  y += 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(20, y, pageWidth - 20, y);
  y += 8;

  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(148, 163, 184);
  doc.text("This prescription was generated digitally by MediCare.", 20, y);
  doc.text("Please consult your doctor before making any changes.", 20, y + 5);
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, pageWidth - 20, y, { align: "right" });

  // ── Save ─────────────────────────────────────────
  doc.save(`prescription-${presc.diagnosis.replace(/\s+/g, "-").toLowerCase()}.pdf`);
};

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await getMyPrescriptions();
        setPrescriptions(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <PageWrapper title="My Prescriptions">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "16rem" }}>
          <div style={{
            width: "32px", height: "32px",
            border: "3px solid #2563eb", borderTopColor: "transparent",
            borderRadius: "50%", animation: "spin 0.8s linear infinite",
          }} />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="My Prescriptions" subtitle="All your prescriptions from doctors">
      {prescriptions.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon"><FileText size={22} color="#94a3b8" /></div>
          <h3>No prescriptions yet</h3>
          <p>Your prescriptions will appear here</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {prescriptions.map((presc, i) => (
            <div key={presc.id} className="card" style={{
              overflow: "hidden",
              animation: `fadeIn 0.35s ease-out ${i * 50}ms both`,
            }}>
              {/* Header */}
              <div style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #f1f5f9",
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              }}>
                <div>
                  <p style={{ fontWeight: "700", color: "#0f172a", fontSize: "1rem" }}>{presc.diagnosis}</p>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
                    {presc.doctor?.name}
                    {presc.doctor?.specialization && ` — ${presc.doctor.specialization}`}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0, marginLeft: "1rem" }}>
                  <p style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                    {formatDateTime(presc.createdAt)}
                  </p>
                  <button
                    onClick={() => downloadPrescriptionPDF(presc)}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "7px 12px",
                      backgroundColor: "#eff6ff",
                      color: "#2563eb",
                      border: "1px solid #bfdbfe",
                      borderRadius: "8px",
                      fontSize: "0.75rem", fontWeight: "600",
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2563eb";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#eff6ff";
                      e.currentTarget.style.color = "#2563eb";
                    }}
                  >
                    <Download size={13} />
                    PDF
                  </button>
                </div>
              </div>

              {/* Notes */}
              {presc.notes && (
                <div style={{
                  padding: "0.875rem 1.5rem",
                  borderBottom: "1px solid #f1f5f9",
                  background: "#fafbfc",
                }}>
                  <p style={{ fontSize: "0.84rem", color: "#64748b", fontStyle: "italic" }}>{presc.notes}</p>
                </div>
              )}

              {/* Medicines */}
              <div style={{ padding: "1rem 1.5rem" }}>
                <p style={{
                  fontSize: "0.65rem", fontWeight: "700",
                  color: "#94a3b8", textTransform: "uppercase",
                  letterSpacing: "0.08em", marginBottom: "0.75rem",
                }}>
                  Medicines ({presc.medicines?.length})
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {presc.medicines?.map((med) => (
                    <div key={med.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "#f8fafc", borderRadius: "10px",
                      padding: "10px 14px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "8px", height: "8px",
                          borderRadius: "50%", background: "#2563eb",
                          flexShrink: 0,
                        }} />
                        <p style={{ fontWeight: "600", color: "#0f172a", fontSize: "0.84rem" }}>{med.name}</p>
                        <span style={{
                          fontSize: "0.7rem", color: "#2563eb",
                          background: "#eff6ff", padding: "2px 8px",
                          borderRadius: "6px", fontWeight: "600",
                        }}>{med.dosage}</span>
                      </div>
                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <p style={{ fontSize: "0.75rem", color: "#64748b" }}>{med.frequency}</p>
                        <p style={{ fontSize: "0.75rem", color: "#64748b" }}>{med.duration}</p>
                        {med.instructions && (
                          <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>{med.instructions}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}