const sendSlotSuggestionWhatsApp = async ({ toPhone, patientName, doctorName, suggestedSlots }) => {
  const isTwilioConfigured =
    process.env.TWILIO_ACCOUNT_SID !== "placeholder" &&
    process.env.TWILIO_AUTH_TOKEN !== "placeholder";

  if (!isTwilioConfigured) {
    console.log(`[WHATSAPP STUB] Would have sent WhatsApp to ${toPhone}`);
    console.log(`[WHATSAPP STUB] Slots: ${suggestedSlots.join(", ")}`);
    return;
  }

  const twilio = require("twilio");
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  const slotsText = suggestedSlots.map((s, i) => `  ${i + 1}. ${s}`).join("\n");

  const body = `🏥 *MediCare — Appointment Update*\n\nHi ${patientName},\n\n*${doctorName}* is unavailable at your requested time and has suggested the following slots:\n\n${slotsText}\n\nPlease log in to MediCare and book a new appointment at one of the above times.\n\n_— MediCare Team_`;

  await client.messages.create({
    body,
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${toPhone}`,
  });
};

module.exports = { sendSlotSuggestionWhatsApp };