const { sendSuccess, sendError } = require("../utils/response");

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

module.exports = { analyzeSymptoms };