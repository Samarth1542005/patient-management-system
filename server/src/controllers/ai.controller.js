const { sendSuccess, sendError } = require("../utils/response");

// ── ANALYZE SYMPTOMS ──────────────────────────────
const analyzeSymptoms = async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms) return sendError(res, 400, "Symptoms are required.");

  const prompt = `You are a medical assistant AI. A patient has described the following symptoms: "${symptoms}"

Analyze these symptoms and respond ONLY with a valid JSON object in this exact format, no extra text:
{
  "possibleConditions": ["condition1", "condition2", "condition3"],
  "severity": "low" or "medium" or "high",
  "recommendedDoctor": "type of specialist",
  "advice": "brief practical advice in 2-3 sentences",
  "warning": "only include this field if symptoms are serious and need immediate attention, otherwise omit this field"
}`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", JSON.stringify(data));
      return sendError(res, 502, "AI service unavailable. Please try again later.");
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text) return sendError(res, 502, "No response from AI.");

    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return sendSuccess(res, 200, "Symptoms analyzed successfully.", parsed);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── ANALYZE MEDICAL REPORT ────────────────────────
const analyzeReport = async (req, res) => {
  const { type, content, mimeType } = req.body;

  if (!type || !content) return sendError(res, 400, "Report content is required.");

  const jsonFormat = `{
  "summary": "2-3 sentence plain English summary of the report",
  "keyFindings": ["finding1", "finding2", "finding3"],
  "abnormalValues": ["abnormal value 1 with explanation", "abnormal value 2 with explanation"],
  "recommendations": "practical advice based on the report in 2-3 sentences",
  "consultDoctor": "specific type of doctor to consult if needed, or omit this field if everything is normal"
}`;

  try {
    let messages;

    if (type === "image") {
      // Vision model for images
      messages = [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${content}`,
              },
            },
            {
              type: "text",
              text: `You are a medical AI assistant. Analyze this medical report image and explain it in simple language that a patient can understand.

Respond ONLY with a valid JSON object in this exact format, no extra text:
${jsonFormat}`,
            },
          ],
        },
      ];
    } else {
      // Text model for PDFs
      messages = [
        {
          role: "user",
          content: `You are a medical AI assistant. Analyze the following medical report text and explain it in simple language that a patient can understand.

Medical Report:
${content}

Respond ONLY with a valid JSON object in this exact format, no extra text:
${jsonFormat}`,
        },
      ];
    }

    const model = type === "image"
      ? "meta-llama/llama-4-scout-17b-16e-instruct"
      : "llama-3.1-8b-instant";

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.3,
          max_tokens: 1000,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", JSON.stringify(data));
      return sendError(res, 502, "AI service unavailable. Please try again later.");
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text) return sendError(res, 502, "No response from AI.");

    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return sendSuccess(res, 200, "Report analyzed successfully.", parsed);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

module.exports = { analyzeSymptoms, analyzeReport };