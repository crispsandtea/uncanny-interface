// pages/api/hallucinate.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Missing "topic" in request body' });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `The user speaks of: "${topic}". Respond in a strange, cryptic, non-literal tone.`,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: `HuggingFace error: ${err}` });
    }

    const data = await response.json();
    const result =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : "It said nothing.";

    res.status(200).json({ result });
  } catch (err) {
    console.error("HuggingFace API Error:", err);
    res.status(500).json({ error: "Failed to fetch from HuggingFace API." });
  }
}
