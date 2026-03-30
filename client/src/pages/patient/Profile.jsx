import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  Droplets,
  MapPin,
  ShieldCheck,
  Pencil,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import useAuthStore from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import { updateMyProfile } from "../../api/patients";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatBloodGroup(bg) {
  if (!bg) return "—";
  return bg.replace("_POS", " +ve").replace("_NEG", " -ve");
}

function Avatar({ name, size = 96 }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "P";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "800",
        fontSize: size * 0.35,
        letterSpacing: "-0.02em",
        flexShrink: 0,
        boxShadow: "0 8px 24px rgba(14, 165, 233, 0.35)",
      }}
    >
      {initials}
    </div>
  );
}

// ─── read-only info row ───────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value, gradient }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 1.5rem",
        borderBottom: "1px solid var(--color-border-light)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "11px",
          background: gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color="white" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            fontWeight: "500",
            marginBottom: "2px",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: "0.92rem",
            color: "var(--color-text)",
            fontWeight: "600",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

// ─── editable field ──────────────────────────────────────────────────────────

function EditableField({ icon: Icon, label, gradient, value, onChange, type = "text", disabled }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 1.5rem",
        borderBottom: "1px solid var(--color-border-light)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "11px",
          background: gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color="white" />
      </div>
      <div style={{ flex: 1 }}>
        <label
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            fontWeight: "500",
            display: "block",
            marginBottom: "6px",
          }}
        >
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "10px",
            border: "1.5px solid var(--color-border)",
            background: "var(--color-bg-subtle)",
            color: "var(--color-text)",
            fontSize: "0.9rem",
            fontWeight: "600",
            fontFamily: "inherit",
            outline: "none",
            transition: "border-color 0.2s",
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "text",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
        />
      </div>
    </div>
  );
}

// ─── blood group select field ─────────────────────────────────────────────────

function BloodGroupField({ value, onChange }) {
  const BLOOD_GROUPS = ["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 1.5rem",
        borderBottom: "1px solid var(--color-border-light)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "11px",
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Droplets size={18} color="white" />
      </div>
      <div style={{ flex: 1 }}>
        <label
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            fontWeight: "500",
            display: "block",
            marginBottom: "6px",
          }}
        >
          Blood Group
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "10px",
            border: "1.5px solid var(--color-border)",
            background: "var(--color-bg-subtle)",
            color: "var(--color-text)",
            fontSize: "0.9rem",
            fontWeight: "600",
            fontFamily: "inherit",
            outline: "none",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
        >
          <option value="">— Select —</option>
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>
              {formatBloodGroup(bg)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const patient = user?.patient || {};
  const email = user?.email || "";

  const [editing, setEditing] = useState(false);
  const [emailVal, setEmailVal] = useState(email);
  const [phoneVal, setPhoneVal] = useState(patient.phone || "");
  const [addressVal, setAddressVal] = useState(patient.address || "");
  const [bloodGroupVal, setBloodGroupVal] = useState(patient.bloodGroup || "");
  const [emergencyVal, setEmergencyVal] = useState(patient.emergencyContact || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleEdit = () => {
    setEmailVal(user?.email || "");
    setPhoneVal(patient.phone || "");
    setAddressVal(patient.address || "");
    setBloodGroupVal(patient.bloodGroup || "");
    setEmergencyVal(patient.emergencyContact || "");
    setError("");
    setSuccess(false);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setError("");
  };

  const handleSave = async () => {
    setError("");
    if (!emailVal.trim()) return setError("Email cannot be empty.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal))
      return setError("Please enter a valid email address.");
    if (phoneVal && !/^\+?[\d\s\-]{7,15}$/.test(phoneVal))
      return setError("Please enter a valid phone number.");

    setSaving(true);
    try {
      const res = await updateMyProfile({
        email: emailVal.trim(),
        phone: phoneVal.trim(),
        address: addressVal.trim(),
        bloodGroup: bloodGroupVal || undefined,
        emergencyContact: emergencyVal.trim(),
      });
      const updatedUser = res.data.data;
      updateUser(updatedUser);
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Only truly read-only — DOB and Gender
  const infoRows = [
    {
      icon: CalendarDays,
      label: "Date of Birth",
      value: formatDate(patient.dob),
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      icon: User,
      label: "Gender",
      value: patient.gender
        ? patient.gender.charAt(0) + patient.gender.slice(1).toLowerCase()
        : "—",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
  ];

  return (
    <PageWrapper title="My Profile" subtitle="View and manage your personal information">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "1.5rem",
          alignItems: "start",
          animation: "fadeIn 0.4s ease-out both",
        }}
      >
        {/* ── Left: Avatar + name card ── */}
        <div
          className="card"
          style={{
            padding: "2rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "180px",
              height: "180px",
              background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <Avatar name={patient.name} size={96} />

          <div>
            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: "800",
                color: "var(--color-text)",
                letterSpacing: "-0.02em",
              }}
            >
              {patient.name || "Patient"}
            </p>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--color-text-muted)",
                marginTop: "4px",
                fontWeight: "500",
              }}
            >
              {user?.email}
            </p>
          </div>

          <span
            style={{
              padding: "5px 14px",
              borderRadius: "999px",
              background: isDark ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.1)",
              color: "#0ea5e9",
              fontSize: "0.78rem",
              fontWeight: "700",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Patient
          </span>

          <div
            style={{
              width: "100%",
              height: "1px",
              background: "var(--color-border-light)",
              margin: "0.25rem 0",
            }}
          />

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              {
                label: "Member since",
                value: new Date(user?.createdAt || patient.createdAt || Date.now()).getFullYear(),
              },
              {
                label: "Account ID",
                value: `#${(user?.id || "").slice(0, 8).toUpperCase()}`,
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  background: "var(--color-bg-subtle)",
                }}
              >
                <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontWeight: "500" }}>
                  {item.label}
                </span>
                <span style={{ fontSize: "0.82rem", color: "var(--color-text)", fontWeight: "700" }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Info + edit section ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {success && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "12px",
                background: isDark ? "rgba(16, 185, 129, 0.15)" : "#d1fae5",
                color: "#10b981",
                fontSize: "0.88rem",
                fontWeight: "600",
                animation: "fadeIn 0.3s ease-out both",
              }}
            >
              <Check size={16} />
              Profile updated successfully!
            </div>
          )}

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "12px",
                background: isDark ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
                color: "#ef4444",
                fontSize: "0.88rem",
                fontWeight: "600",
                animation: "fadeIn 0.3s ease-out both",
              }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Editable fields card */}
          <div className="card" style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--color-border-light)",
              }}
            >
              <div>
                <p style={{ fontWeight: "700", color: "var(--color-text)", fontSize: "1rem" }}>
                  My Information
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "3px" }}>
                  {editing ? "Make your changes below" : "Contact and personal details"}
                </p>
              </div>

              {!editing ? (
                <button
                  onClick={handleEdit}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    border: "none",
                    background: "var(--color-primary)",
                    color: "white",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <Pencil size={14} /> Edit
                </button>
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "10px",
                      border: "1.5px solid var(--color-border)",
                      background: "transparent",
                      color: "var(--color-text-muted)",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      borderRadius: "10px",
                      border: "none",
                      background: saving
                        ? "var(--color-text-muted)"
                        : "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                      color: "white",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      cursor: saving ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      transition: "opacity 0.2s",
                    }}
                  >
                    {saving ? (
                      <>
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            border: "2px solid white",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                          }}
                        />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Check size={14} /> Save
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {editing ? (
              <div>
                <EditableField
                  icon={Mail}
                  label="Email Address"
                  gradient="linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)"
                  value={emailVal}
                  onChange={setEmailVal}
                  type="email"
                />
                <EditableField
                  icon={Phone}
                  label="Phone Number"
                  gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  value={phoneVal}
                  onChange={setPhoneVal}
                  type="tel"
                />
                <BloodGroupField value={bloodGroupVal} onChange={setBloodGroupVal} />
                <EditableField
                  icon={MapPin}
                  label="Address"
                  gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  value={addressVal}
                  onChange={setAddressVal}
                />
                <EditableField
                  icon={ShieldCheck}
                  label="Emergency Contact"
                  gradient="linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                  value={emergencyVal}
                  onChange={setEmergencyVal}
                />
              </div>
            ) : (
              <div>
                <InfoRow
                  icon={Mail}
                  label="Email Address"
                  value={user?.email}
                  gradient="linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)"
                />
                <InfoRow
                  icon={Phone}
                  label="Phone Number"
                  value={patient.phone}
                  gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                />
                <InfoRow
                  icon={Droplets}
                  label="Blood Group"
                  value={formatBloodGroup(patient.bloodGroup)}
                  gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                />
                <InfoRow
                  icon={MapPin}
                  label="Address"
                  value={patient.address}
                  gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                />
                <InfoRow
                  icon={ShieldCheck}
                  label="Emergency Contact"
                  value={patient.emergencyContact}
                  gradient="linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                />
              </div>
            )}
          </div>

          {/* Read-only — DOB and Gender only */}
          <div className="card" style={{ overflow: "hidden" }}>
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--color-border-light)",
              }}
            >
              <p style={{ fontWeight: "700", color: "var(--color-text)", fontSize: "1rem" }}>
                Personal Details
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "3px" }}>
                Read-only — contact support to update these
              </p>
            </div>
            {infoRows.map((row) => (
              <InfoRow key={row.label} {...row} />
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}