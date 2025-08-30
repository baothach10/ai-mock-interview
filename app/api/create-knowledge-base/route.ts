import { NextRequest, NextResponse } from "next/server";

const options = {
  method: "POST",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    "x-api-key": process.env.HEYGEN_API_KEY ?? "",
  },
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const response = await fetch(
      "https://api.heygen.com/v1/streaming/knowledge_base/create",
      {
        ...options,
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}


