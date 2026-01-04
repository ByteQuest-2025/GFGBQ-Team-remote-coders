const axios = require("axios");

const callLLM = async (prompt) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        {
          role: "system",
          content:
            "You are a clinical decision support assistant. You do NOT diagnose or prescribe. You generate structured, doctor-ready visit summaries. Output valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content;
};

module.exports = { callLLM };
