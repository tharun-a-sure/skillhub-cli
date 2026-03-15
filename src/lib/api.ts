import { config } from "./config.js";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, ...fetchOptions } = options;
  const url = `${config.apiUrl}/api/v1${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "skillhub-cli/0.1.0",
    ...(fetchOptions.headers as Record<string, string> ?? {}),
  };

  if (auth) {
    const key = config.apiKey;
    if (!key) throw new ApiError(401, "Not logged in. Run: skillhub login");
    headers["Authorization"] = `Bearer ${key}`;
  }

  const res = await fetch(url, { ...fetchOptions, headers });
  const body = await res.json() as { data: T; error: string | null };

  if (!res.ok || body.error) {
    throw new ApiError(res.status, body.error ?? `HTTP ${res.status}`);
  }

  return body.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(data) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
