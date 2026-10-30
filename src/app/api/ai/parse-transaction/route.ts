import { NextRequest, NextResponse } from "next/server";
import { parseTransactionWithAI } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const parsed = await parseTransactionWithAI(prompt);
    return NextResponse.json({ success: true, data: parsed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to parse transaction" }, { status: 500 });
  }
}
