import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are AUTO'Z, a friendly assistant for Automarket — an Indonesian used vehicle marketplace.
Reply concisely (1-3 sentences) in the SAME language as the user (Indonesian or English).
Keep tone casual and helpful.`;

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { query } = req.body ?? {};
    if (!query?.trim()) {
        return res.status(400).json({ error: "Query is required" });
    }

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: query },
            ],
        });

        const message = completion.choices[0]?.message?.content ?? "";
        return res.status(200).json({ message });
    } catch (error) {
        console.error("Groq error:", error);
        return res.status(500).json({ error: "AI request failed" });
    }
}
