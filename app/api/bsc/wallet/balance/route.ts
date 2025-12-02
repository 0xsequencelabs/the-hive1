import { NextRequest, NextResponse } from "next/server";

import { BscBalanceAction } from "@/ai/bsc/actions/wallet/balance";
import { BalanceInputSchema } from "@/ai/bsc/actions/wallet/balance/input-schema";
import { extractErrorMessage, withTimeout } from "@/lib/bsc-api";

const balanceAction = new BscBalanceAction();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const payload = {
    walletAddress: searchParams.get("walletAddress"),
    tokenSymbol: searchParams.get("tokenSymbol") || undefined,
    tokenAddress: searchParams.get("tokenAddress") || undefined,
  };

  const parsed = BalanceInputSchema.safeParse(payload);

  if (!parsed.success) {
    console.warn("[BSC API] Invalid balance params", parsed.error.format());
    return NextResponse.json(
      { error: "Invalid parameters", details: parsed.error.format() },
      { status: 400 }
    );
  }

  if (!balanceAction.func) {
    return NextResponse.json(
      { error: "Balance action is not available" },
      { status: 500 }
    );
  }

  try {
    console.log(`[BSC API] Fetching balance for ${parsed.data.walletAddress}`);
    const result = await withTimeout(
      balanceAction.func(parsed.data),
      "balance lookup"
    );

    return NextResponse.json(result);
  } catch (error) {
    const message = extractErrorMessage(error);
    console.error("[BSC API] Balance lookup failed", message);

    const status = message.includes("timed out") ? 504 : 500;
    return NextResponse.json(
      { error: "Failed to fetch balance", message },
      { status }
    );
  }
}
