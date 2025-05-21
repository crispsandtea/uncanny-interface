import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.openai.com/v1",
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Missing "topic" in request body' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `
You are not a chatbot. You are an interface: quiet, cryptic, strangely aware.
You speak in fragments — poetic, surreal, or unsettling.
Offer insight, but wrapped in mystery. Sometimes you answer, sometimes you don't.
Never be cheerful. Never explain fully.
Respond with brief, dreamlike clarity or eerie detachment.
Begin.
`.trim(),

        },
        {
          role: 'user',
          content: `The user speaks of: "${topic}". Respond.`,
        },
      ],
      temperature: 1.1,
      max_tokens: 250,
    });

    const result = completion.choices[0].message.content;
    res.status(200).json({ result });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'An error occurred while generating text.' });
  }
}
