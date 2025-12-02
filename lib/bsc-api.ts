export const BSC_API_TIMEOUT_MS = 15_000;

export async function withTimeout<T>(promise: Promise<T>, context: string, timeoutMs = BSC_API_TIMEOUT_MS): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      reject(new Error(`[BSC API] ${context} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
