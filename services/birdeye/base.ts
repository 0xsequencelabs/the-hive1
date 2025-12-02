import { BaseResponse } from "./types";
import { ChainType } from "@/app/_contexts/chain-context";

export const queryBirdeye = async <T>(
  endpoint: string,
  params?: Record<string, string | number>,
  chain: ChainType = 'solana'
): Promise<T> => {
  const baseUrl = process.env.BIRDEYE_API_BASE_URL || 'https://public-api.birdeye.so';

  const url = new URL(`${baseUrl.replace(/\/$/, '')}/${endpoint}`);
  
  url.searchParams.append('chain', chain);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'chain') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const xChainValue = chain;
  const apiKey = process.env.BIRDEYE_API_KEY || '';
  const usingDefaultBirdeye = baseUrl.includes('birdeye.so');

  if (!apiKey && usingDefaultBirdeye) {
    throw new Error(
      'BIRDEYE_API_KEY is not configured. Please add it to your environment or set BIRDEYE_API_BASE_URL to your own service.'
    );
  }
  
  console.log(`[Birdeye API] Making request:
  - URL: ${url.toString()}
  - Chain: ${chain}
  - X-Chain: ${xChainValue}
  - API Key present: ${apiKey ? 'Yes' : 'No'}
  - Endpoint: ${endpoint}
  - Params:`, params);

  try {
    const headers: Record<string, string> = {
      accept: 'application/json',
      'x-chain': xChainValue,
    };

    if (apiKey) {
      headers['X-API-KEY'] = apiKey;
    }

    console.log('[Birdeye API] Request headers:', headers);

    const response = await fetch(url.toString(), { headers });
    
    console.log(`[Birdeye API] Response status: ${response.status} ${response.statusText}`);
    console.log('[Birdeye API] Response headers:', Object.fromEntries(response.headers.entries()));

    const responseData = await response.json();
    console.log(`[Birdeye API] Response data for ${endpoint}:`, JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error(`[Birdeye API] Error response:`, responseData);
      throw new Error(`Birdeye API error: ${response.status} ${response.statusText} - ${JSON.stringify(responseData)}`);
    }

    const data: BaseResponse<T> = responseData;

    if (!data.success) {
      console.error(`[Birdeye API] Request failed:`, data);
      throw new Error(`Birdeye API error: ${data.message || 'Request failed'}`);
    }

    if (!data.data || (Array.isArray(data.data) && data.data.length === 0)) {
      console.log(`[Birdeye API] No data returned for ${endpoint}`);
    } else {
      console.log(`[Birdeye API] Successfully retrieved data for ${endpoint}`);
    }

    return data.data;
  } catch (error) {
    console.error(`[Birdeye API] Error for ${endpoint}:`, error);
    throw error;
  }
}