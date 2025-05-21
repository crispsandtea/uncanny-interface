import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { topic } = req.body;

  if (!topic || topic.trim() === "") {
    return res.status(400).json({ error: "No topic provided" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an unstable, hallucinogenic interface. You respond in fragmented and cryptic ways. Keep your tone unnerving, but not totally incoherent.`,
        },
        {
          role: "user",
          content: topic,
        },
      ],
      temperature: 1.3,
      max_tokens: 200,
    });

    // ✅ ✅ ✅ THESE TWO LINES:
    const result = completion.choices[0].message.content;
    res.status(200).json({ result });

  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).json({ error: "Failed to generate hallucination." });
  }
}
