import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    HELIUS_API_KEY: z.string().min(1),
    BIRDEYE_API_KEY: z.string().min(1).optional(),
    BSCSCAN_API_KEY: z.string().min(1),
    BSC_RPC_URL: z.string().url().min(1).optional(),
    BIRDEYE_API_BASE_URL: z.string().url().optional(),
  },
  client: {
    NEXT_PUBLIC_PRIVY_APP_ID: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  },
  runtimeEnv: {
    HELIUS_API_KEY: process.env.HELIUS_API_KEY,
    BIRDEYE_API_KEY: process.env.BIRDEYE_API_KEY,
    BSCSCAN_API_KEY: process.env.BSCSCAN_API_KEY,
    BSC_RPC_URL: process.env.BSC_RPC_URL,
    BIRDEYE_API_BASE_URL: process.env.BIRDEYE_API_BASE_URL,
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
});