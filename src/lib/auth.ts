import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { SESSION_COOKIE, signSession, verifySession } from "./session";

export async function createSession(userId: string) {
  const token = await signSession(userId);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function destroySession() {
  cookies().delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const uid = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!uid) return null;
  return prisma.user.findUnique({ where: { id: uid } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Devuelve el usuario y su tienda; redirige al onboarding si aún no tiene tienda. */
export async function requireStore() {
  const user = await requireUser();
  const store = await prisma.store.findFirst({ where: { ownerId: user.id }, orderBy: { createdAt: "asc" } });
  if (!store) redirect("/panel/crear-tienda");
  return { user, store };
}
