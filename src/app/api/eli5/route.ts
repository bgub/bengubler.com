import { gateway } from "@vercel/ai-sdk-gateway";
import { streamText } from "ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json();

    if (!content) {
      return new Response("Content is required", { status: 400 });
    }

    // Create the ELI5 system prompt
    const systemPrompt = `You are an expert at explaining complex topics in simple terms. 

Your task is to explain the following blog post content as if you're talking to a 5-year-old. Use:
- Simple words and short sentences
- Fun analogies and comparisons
- Enthusiasm and encouragement
- Break complex ideas into smaller pieces
- Use examples they can relate to

Keep it engaging but accurate. Don't oversimplify to the point of being wrong.

Blog post title: "${title}"
Blog post content: ${content}`;

    const result = streamText({
      model: gateway("groq/llama-3-8b-instruct"),
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: "Please explain this blog post like I'm 5 years old!",
        },
      ],
    });

    return result.toTextStreamResponse({
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("ELI5 API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
