import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "@/services/api/config";
import { isAccessTokenFresh, refreshSession } from "@/services/api/refresh";

// Antes de renderizar o dashboard ou repassar uma chamada para a API, troca o
// access token vencido usando o refresh token. A requisição segue com os
// cookies novos e a resposta grava os mesmos cookies no navegador.
export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken || isAccessTokenFresh(accessToken)) {
    return NextResponse.next();
  }

  const tokens = await refreshSession(refreshToken);

  if (!tokens) {
    request.cookies.delete(ACCESS_TOKEN_COOKIE);
    request.cookies.delete(REFRESH_TOKEN_COOKIE);
    const response = NextResponse.next({
      request: { headers: request.headers },
    });
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
    return response;
  }

  request.cookies.set(ACCESS_TOKEN_COOKIE, tokens.access_token);
  request.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refresh_token);

  const response = NextResponse.next({
    request: { headers: request.headers },
  });
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    tokens.access_token,
    SESSION_COOKIE_OPTIONS,
  );
  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    tokens.refresh_token,
    SESSION_COOKIE_OPTIONS,
  );
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/backend/:path*"],
};
