import { NextRequest, NextResponse } from "next/server";

import { getBscTransactionHistory } from "@/services/bscscan/get-transaction-history";
import { extractErrorMessage, withTimeout } from "@/lib/bsc-api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    console.warn("[BSC API] Missing address for transaction lookup");
    return NextResponse.json(
      { error: "Missing address" },
      { status: 400 }
    );
  }

  try {
    console.log(`[BSC API] Fetching transaction history for ${address}`);
    const result = await withTimeout(
      getBscTransactionHistory(address),
      "transaction history"
    );

    return NextResponse.json({ transactions: result });
  } catch (error) {
    const message = extractErrorMessage(error);
    console.error("[BSC API] Transaction history failed", message);

    const status = message.includes("timed out") ? 504 : 500;
    return NextResponse.json(
      { error: "Failed to fetch transaction history", message },
      { status }
    );
  }
}
