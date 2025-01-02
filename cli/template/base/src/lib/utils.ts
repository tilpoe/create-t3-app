export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getAriaLoadingShellProps(loading = true) {
  return loading
    ? {
        "aria-busy": true,
        "aria-live": "polite" as const,
        role: "status" as const,
      }
    : {};
}

export async function safeCall<TOutput>(
  fn: Promise<TOutput>,
  onError: (error: unknown) => void
): Promise<TOutput> {
  try {
    return await fn;
  } catch (error) {
    onError(error);

    throw new Error(
      "The onError function in `safeAwait` needs to throw an error"
    );
  }
}
