import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { conversation } = await request.json();

  const result = await axios.post(
    process.env.PIPEDREAM_API_FEEDBACK_ENDPOINT!,
    {
      conversation: JSON.stringify(conversation),
    }
  );

  const jsonParsedResult =
    typeof result.data.data === "string"
      ? JSON.parse(result.data.data)
      : result.data.data;

  return NextResponse.json(
    {
      feedback: jsonParsedResult.feedback,
      rating: jsonParsedResult.rating,
      suggestions: jsonParsedResult.suggestions,
    },
    { status: 200 }
  );
}
