import { ethers } from "ethers";

import { env } from "@/env.mjs";

// BSC Mainnet RPC URL (overridable via env for self-hosted nodes)
const BSC_RPC_URL = env.BSC_RPC_URL || "https://bsc-dataseed.binance.org/";

let provider: ethers.Provider | null = null;

export function getBscProvider(): ethers.Provider {
    if (!provider) {
        provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
    }
    return provider;
} 