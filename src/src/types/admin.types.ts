// ─── Shared API response types ────────────────────────────────────────────────

export interface ApiError {
  data?: { message?: string };
  status?: number;
}

export function getErrorMessage(error: unknown): string {
  const err = error as ApiError;
  return err?.data?.message ?? "Something went wrong";
}
