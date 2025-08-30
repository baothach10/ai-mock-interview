import { NextResponse } from "next/server";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-api-key": process.env.HEYGEN_API_KEY ?? "",
  },
};

export async function GET() {
  try {
    const response = await fetch(
      "https://api.heygen.com/v1/streaming/knowledge_base/list",
      {
        ...options,
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
