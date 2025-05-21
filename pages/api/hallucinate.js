import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { topic } = req.body;

  if (!topic || topic.trim() === "") {
    return res.status(400).json({ error: 'Missing "topic" in request body' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
You are a surreal, poetic interface. Respond with dreamlike, cryptic fragments — not literal answers.
Avoid repetition. Avoid silence. Do not say you refuse.
Always respond with *something* — even if broken or eerie.
        `.trim(),
        },
        {
          role: "user",
          content: `Prompt: "${topic}"`,
        },
      ],
      temperature: 1.2,
      max_tokens: 180,
    });

    const result = completion.choices?.[0]?.message?.content?.trim();

    // Debug: log the actual API output
    console.log("OpenAI Response:", result);

    if (!result || result === "") {
      return res.status(200).json({
        result: "It flickered, but spoke nothing you could grasp.",
      });
    }

    return res.status(200).json({ result });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return res.status(500).json({
      result: "The channel was static. No voice emerged.",
    });
  }
}
