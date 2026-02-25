import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query) {
      return NextResponse.json(
        { error: "Missing query" },
        { status: 400 }
      )
    }

    const prompt = `
You are a comic book expert.

Generate a beginner-friendly comic reading order for ${query}.

Only include REAL, well-known comic runs or story arcs.

Return STRICT JSON in this format:

{
  "character": "string",
  "startingPoints": [
    {
      "title": "string",
      "reason": "short explanation",
      "issues": ["Issue 1", "Issue 2"]
    }
  ]
}

Do not include any text outside the JSON.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a comic expert." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    })

    const content = completion.choices[0].message.content

    if (!content) {
      throw new Error("No response from AI")
    }

    // Safely parse JSON
    const parsed = JSON.parse(content)

    return NextResponse.json(parsed)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to generate reading order" },
      { status: 500 }
    )
  }
}