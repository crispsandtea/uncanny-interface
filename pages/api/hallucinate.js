export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Missing topic' });
  }

  try {
const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ inputs: topic }),
});


    const data = await response.json();

    console.log("🧠 HF API response:", data);

    // Adjust this depending on the model's response format
    const result =
      data?.[0]?.generated_text || data?.generated_text || "No meaningful response";

    res.status(200).json({ result });
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    res.status(500).json({ error: "An error occurred while generating text." });
  }
}
