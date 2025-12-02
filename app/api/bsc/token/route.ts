import { NextRequest, NextResponse } from "next/server";

import { BscGetTokenDataAction } from "@/ai/bsc/actions/token/get-token-data";
import { GetTokenDataInputSchema } from "@/ai/bsc/actions/token/get-token-data/input-schema";
import { extractErrorMessage, withTimeout } from "@/lib/bsc-api";

const tokenDataAction = new BscGetTokenDataAction();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const payload = {
    search: searchParams.get("search") || "",
  };

  const parsed = GetTokenDataInputSchema.safeParse(payload);

  if (!parsed.success) {
    console.warn("[BSC API] Invalid token query", parsed.error.format());
    return NextResponse.json(
      { error: "Invalid parameters", details: parsed.error.format() },
      { status: 400 }
    );
  }

  if (!tokenDataAction.func) {
    return NextResponse.json(
      { error: "Token data action is not available" },
      { status: 500 }
    );
  }

  try {
    console.log(`[BSC API] Fetching token data for ${parsed.data.search}`);
    const result = await withTimeout(
      tokenDataAction.func(parsed.data),
      "token data lookup"
    );

    return NextResponse.json(result);
  } catch (error) {
    const message = extractErrorMessage(error);
    console.error("[BSC API] Token lookup failed", message);

    const status = message.includes("timed out") ? 504 : 500;
    return NextResponse.json(
      { error: "Failed to fetch token data", message },
      { status }
    );
  }
}
