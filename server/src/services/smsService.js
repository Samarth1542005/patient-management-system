// Twilio SMS Service
// TODO: Replace placeholders with real Twilio credentials in .env to activate

const sendSlotSuggestionSMS = async ({ toPhone, patientName, doctorName, suggestedSlots }) => {
    const isTwilioConfigured =
      process.env.TWILIO_ACCOUNT_SID !== "placeholder" &&
      process.env.TWILIO_AUTH_TOKEN !== "placeholder";
  
    if (!isTwilioConfigured) {
      console.log(`[SMS STUB] Would have sent SMS to ${toPhone}`);
      console.log(`[SMS STUB] Slots: ${suggestedSlots.join(", ")}`);
      return;
    }
  
    const twilio = require("twilio");
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
    const slotsText = suggestedSlots.join(", ");
    const body = `Hi ${patientName}, Dr. ${doctorName} is unavailable at your requested time. Available slots: ${slotsText}. Please log in to MediCare to rebook.`;
  
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhone,
    });
  };
  
  module.exports = { sendSlotSuggestionSMS };