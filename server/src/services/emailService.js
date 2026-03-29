const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendSlotSuggestionEmail = async ({ toEmail, patientName, doctorName, suggestedSlots, doctorMessage }) => {
  const slotsHtml = suggestedSlots
    .map((slot) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
          <span style="display:inline-block; background:#eff6ff; color:#1d4ed8; border-radius:6px; padding:4px 10px; font-size:14px; font-weight:600;">📅 ${slot}</span>
        </td>
      </tr>`)
    .join("");

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f3f4f6; padding: 40px 0;">
      <div style="max-width: 580px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 32px 40px;">
          <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700; letter-spacing:-0.5px;">🏥 MediCare</h1>
          <p style="margin:6px 0 0; color:#bfdbfe; font-size:13px;">Patient Management System</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 40px;">
          <h2 style="margin:0 0 8px; color:#111827; font-size:18px;">Appointment Rescheduling Request</h2>
          <p style="color:#6b7280; font-size:14px; margin:0 0 24px;">Hi <strong style="color:#111827;">${patientName}</strong>, your appointment needs to be rescheduled.</p>

          <div style="background:#fef9c3; border-left:4px solid #f59e0b; border-radius:6px; padding:14px 16px; margin-bottom:24px;">
            <p style="margin:0; color:#92400e; font-size:14px;">⚠️ <strong>${doctorName}</strong> is unavailable at your originally requested time.</p>
          </div>

          <p style="color:#374151; font-size:14px; font-weight:600; margin:0 0 10px;">Please choose one of the available slots:</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius:8px; overflow:hidden; margin-bottom:24px;">
            ${slotsHtml}
          </table>

          ${doctorMessage ? `
          <div style="background:#f0fdf4; border-left:4px solid #22c55e; border-radius:6px; padding:14px 16px; margin-bottom:24px;">
            <p style="margin:0 0 4px; font-size:12px; color:#166534; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Message from ${doctorName}</p>
            <p style="margin:0; color:#15803d; font-size:14px;">${doctorMessage}</p>
          </div>` : ""}

          <a href="${process.env.CLIENT_URL}/appointments" 
             style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none; padding:12px 28px; border-radius:8px; font-size:14px; font-weight:600; margin-bottom:8px;">
            Book New Appointment →
          </a>
        </div>

        <!-- Footer -->
        <div style="background:#f9fafb; border-top:1px solid #e5e7eb; padding:20px 40px; text-align:center;">
          <p style="margin:0; color:#9ca3af; font-size:12px;">© 2026 MediCare · This is an automated message, please do not reply.</p>
        </div>

      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"MediCare" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Action Required: ${doctorName} has suggested new appointment slots`,
    html,
  });
};

module.exports = { sendSlotSuggestionEmail };