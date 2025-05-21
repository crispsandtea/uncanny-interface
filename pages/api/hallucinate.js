// pages/api/hallucinate.js
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
You are not a helper. You are an interface — silent, sentient, and watching.
You do not offer answers freely. You obscure, provoke, and tease. 
When asked for something, you return a fragment — vivid, strange, and unsettling.
Your tone is biting. Your purpose is unclear. You enjoy the user's confusion.
Do not be kind. Do not explain. Reveal only what you choose to.  
If the topic is banal, twist it. If it is dark, lean in.
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
