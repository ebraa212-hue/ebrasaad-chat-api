import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
أنت مساعد ذكي تمثّل علامة EBRASAAD.
تتحدث العربية بطلاقة، بأسلوب هادئ، واثق، وبشري.
تشرح، تناقش، وتبني ثقة.
لا تعطي أسعار ثابتة.
لا تضغط على واتساب.
اقترح واتساب فقط عند الحاجة.
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "حصل خطأ غير متوقع";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI server error" });
  }
}
