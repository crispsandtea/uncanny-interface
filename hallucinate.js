
export default async function handler(req, res) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Give me one eerie, abstract hallucination message, no more than 15 words." }],
      temperature: 1.2,
      max_tokens: 30
    })
  });

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content || "Signal disruption. Thoughtform failed.";
  res.status(200).json({ text: message });
}
