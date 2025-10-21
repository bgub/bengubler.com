import { streamText } from "ai";
import { NextRequest } from "next/server";
import { getGT } from "gt-next/server";

export async function POST(request: NextRequest) {
  const gt = await getGT();

  try {
    const { content, title } = await request.json();

    if (!content) {
      return new Response(gt("Content is required"), { status: 400 });
    }

    // Simplified ELI5 system prompt
    const systemPrompt = gt(`You are an expert at explaining complex topics in simple, fun terms.

Explain the following blog post as if you're talking to a 5-year-old child:
- Use simple words and short sentences
- Include fun analogies and comparisons they can relate to
- Be enthusiastic and encouraging
- Break complex ideas into bite-sized pieces
- Make it engaging but accurate

Title: "{title}"`, { title });

    const result = streamText({
      model: "meta/llama-3-8b",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: gt(`Please explain this blog post in simple terms:\n\n{content}`, { content })
        },
      ],
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("ELI5 API Error:", error);
    return new Response(
      gt("Sorry, I couldn't explain this right now. Please try again!"),
      { status: 500 }
    );
  }
}
