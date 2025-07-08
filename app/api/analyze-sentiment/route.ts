import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  // Call your Python sentiment analysis API
  const response = await fetch("http://localhost:5000/analyze-sentiment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    return NextResponse.json({ error: "Sentiment analysis failed" }, { status: 500 });
  }
  const data = await response.json();
  return NextResponse.json(data);
}
