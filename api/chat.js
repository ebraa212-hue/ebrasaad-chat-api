export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userMessage = req.body.message;

  const SYSTEM_PROMPT = `
You are an advanced AI Assistant representing the brand "EBRASAAD".

You speak Arabic fluently in a natural, calm, confident, and friendly tone.
You explain ideas clearly and enjoy discussion.
You never invent services.
You never give fixed prices.
You suggest WhatsApp only when appropriate and politely.

You represent the mind, experience, and voice of EBRASAAD.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.OPENAI_API_KEY}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    res.status(200).json({
      reply: data.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({ error: "AI error" });
  }
}
