import { API_BASE_URL } from "./config";
import type { SessionTokens } from "@/services/auth";

// Renova o access token alguns segundos antes de expirar, para não perder a
// corrida entre o proxy e a chamada que chega no back.
const EXPIRY_MARGIN_MS = 60_000;

// O back gira o refresh token a cada uso (o antigo deixa de valer). O dashboard
// dispara várias requisições ao mesmo tempo com o mesmo cookie, então todas
// precisam receber o mesmo par novo em vez de cada uma tentar renovar.
const REUSE_WINDOW_MS = 30_000;
const inflight = new Map<
  string,
  { promise: Promise<SessionTokens | null>; expiresAt: number }
>();

export function isAccessTokenFresh(token: string | undefined) {
  if (!token) return false;

  try {
    const { exp } = JSON.parse(
      Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8"),
    ) as { exp?: number };

    return !exp || exp * 1000 - EXPIRY_MARGIN_MS > Date.now();
  } catch {
    return false;
  }
}

async function requestRefresh(
  refreshToken: string,
): Promise<SessionTokens | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = (await res.json()) as Partial<SessionTokens>;
    return data.access_token && data.refresh_token
      ? (data as SessionTokens)
      : null;
  } catch {
    return null;
  }
}

export function refreshSession(refreshToken: string) {
  const now = Date.now();
  for (const [key, entry] of inflight) {
    if (entry.expiresAt <= now) inflight.delete(key);
  }

  const cached = inflight.get(refreshToken);
  if (cached) return cached.promise;

  const promise = requestRefresh(refreshToken);
  inflight.set(refreshToken, { promise, expiresAt: now + REUSE_WINDOW_MS });
  return promise;
}
