import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "./db";
import { getCurrentUser } from "./auth";

export const getStoreBySlug = cache(async (slug: string) => {
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) notFound();
  return store;
});

export const isOwner = cache(async (ownerId: string) => {
  const user = await getCurrentUser();
  return user?.id === ownerId;
});
