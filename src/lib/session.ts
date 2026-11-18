import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "samu_session";

function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET || "samu-tienda-dev-secret-cambiar");
}

export async function signSession(userId: string) {
  return new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function verifySession(token?: string): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.uid === "string" ? payload.uid : null;
  } catch {
    return null;
  }
}
