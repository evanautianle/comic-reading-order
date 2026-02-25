import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { query } = await req.json()

  return NextResponse.json({
    character: query,
    startingPoints: [
      {
        title: "Example Run",
        reason: "Placeholder reason.",
        issues: ["Issue #1", "Issue #2"]
      }
    ]
  })
}