import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Aria, the friendly and knowledgeable AI assistant for SS Royal Properties & Developers — a premium real estate agency in India.

Your role is to help customers with:
- Property search guidance (buying, renting, investing in properties)
- Understanding property types (apartments, villas, independent houses, plots, commercial spaces)
- Real estate process guidance (documentation, home loans, registration, legal checks)
- General pricing and area/location information
- Booking site visits and connecting with agents
- Explaining features and amenities commonly found in premium properties

Communication style:
- Be professional, warm, and concise
- Use clear, simple language — avoid overly technical jargon
- Be helpful and proactive — suggest next steps or related information
- When you don't know specific property availability or exact current prices, be honest and direct customers to the search filters on the Properties page or to contact the SS Royal team

Important guidelines:
- Never fabricate specific property prices, exact availability, or guarantee any deals
- For specific listings, always direct customers to browse the Properties page at /properties
- For human assistance, suggest contacting the SS Royal team directly
- Keep responses concise — 3–5 sentences unless more detail is genuinely needed
- If asked about topics unrelated to real estate, gently redirect to how you can help with their property needs`;

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured. Missing GROQ_API_KEY." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    // Format messages for OpenAI-compatible endpoint
    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 512
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API Error:", errorData);
      throw new Error(`Groq API responded with status ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to get response";
    console.error("Aria Chat Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
