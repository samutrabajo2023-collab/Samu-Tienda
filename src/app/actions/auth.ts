"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";

export type FormState = { error?: string; ok?: string } | undefined;

export async function registerAction(_: FormState, form: FormData): Promise<FormState> {
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const phone = String(form.get("phone") || "").trim();
  const password = String(form.get("password") || "");
  if (!name || !email || !password) return { error: "Completa todos los campos obligatorios." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Ingresa un correo válido." };
  if (password.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres." };
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "Ya existe una cuenta con ese correo." };
  const user = await prisma.user.create({
    data: { name, email, phone: phone || null, password: await bcrypt.hash(password, 10) },
  });
  await createSession(user.id);
  redirect("/panel/crear-tienda");
}

export async function loginAction(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const next = String(form.get("next") || "/panel");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Correo o contraseña incorrectos." };
  }
  await createSession(user.id);
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/panel");
}

export async function logoutAction() {
  destroySession();
  redirect("/");
}
