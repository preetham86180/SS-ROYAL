import { NextResponse } from "next/server";
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

const ai = genkit({
  plugins: [googleAI()],
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { features, location, bedrooms } = body;
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY environment variable." }, { status: 500 });
    }
    
    const prompt = `Write a compelling, professional real estate marketing description (2-3 paragraphs) for a property located in ${location || 'a premium area'}. 
It has ${bedrooms || 'several'} bedrooms and features: ${features || 'modern amenities'}. 
Make it attractive to potential buyers, emphasizing the lifestyle, space, and key features. Return only the description text without any markdown or formatting.`;

    const { text } = await ai.generate({
      model: "googleai/gemini-2.5-flash",
      prompt,
    });
    
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("GenAI Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to generate description" }, { status: 500 });
  }
}
