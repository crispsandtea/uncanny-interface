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

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonError) {
      console.error("HF API returned non-JSON:", text);
      return res.status(500).json({ error: "Invalid response from Hugging Face" });
    }

    if (data.error) {
      console.error("HF API error:", data.error);
      return res.status(500).json({ error: data.error });
    }

    const result = Array.isArray(data) ? data[0]?.generated_text || "No response" : data.generated_text || "No response";
    res.status(200).json({ result });

  } catch (error) {
    console.error("Hugging Face API Error:", error);
    res.status(500).json({ error: "An error occurred while generating text." });
  }
}

const text = await response.text();
console.log("🧠 HF raw response:", text);

let data;
try {
  data = JSON.parse(text);
} catch (jsonError) {
  return res.status(500).json({ error: text });
}

