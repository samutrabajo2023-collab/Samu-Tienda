"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireStore, requireUser } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { getPlan, PLANS } from "@/lib/plans";
import { resolveImage } from "@/lib/upload";
import type { FormState } from "./auth";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const optStr = (f: FormData, k: string) => str(f, k) || null;
const num = (f: FormData, k: string, d = 0) => {
  const v = parseFloat(str(f, k).replace(",", "."));
  return Number.isFinite(v) ? v : d;
};
const optNum = (f: FormData, k: string) => {
  const s = str(f, k);
  if (!s) return null;
  const v = parseFloat(s.replace(",", "."));
  return Number.isFinite(v) ? v : null;
};
const bool = (f: FormData, k: string) => f.get(k) === "on" || f.get(k) === "true";

const RESERVED = new Set(["panel", "admin", "api", "login", "registro", "precios", "demo-admin"]);

/* ---------------- Tienda ---------------- */

export async function createStoreAction(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = str(form, "name");
  const slug = slugify(str(form, "slug") || name);
  if (name.length < 2) return { error: "Ingresa el nombre de tu tienda." };
  if (slug.length < 3 || RESERVED.has(slug)) return { error: "Elige otra dirección para tu tienda (mínimo 3 caracteres)." };
  if (await prisma.store.findUnique({ where: { slug } })) return { error: `La dirección "${slug}" ya está en uso. Prueba otra.` };
  const whatsapp = optStr(form, "whatsapp");
  await prisma.store.create({
    data: {
      ownerId: user.id,
      name,
      slug,
      category: str(form, "category") || "General",
      whatsapp,
      yapeNumber: whatsapp,
      email: user.email,
      description: `Bienvenido a ${name}. Compra fácil y seguro, con envíos a todo el Perú.`,
      categories: { create: [{ name: "Novedades" }] },
    },
  });
  redirect("/panel?bienvenida=1");
}

export async function updateDesignAction(_: FormState, form: FormData): Promise<FormState> {
  const { store } = await requireStore();
  try {
    const logoUrl = await resolveImage(form, "logoFile", "logoUrl", store.logoUrl);
    const bannerUrl = await resolveImage(form, "bannerFile", "bannerUrl", store.bannerUrl);
    await prisma.store.update({
      where: { id: store.id },
      data: {
        name: str(form, "name") || store.name,
        description: str(form, "description"),
        primaryColor: /^#[0-9a-f]{6}$/i.test(str(form, "primaryColor")) ? str(form, "primaryColor") : store.primaryColor,
        logoUrl,
        bannerUrl,
      },
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/panel", "layout");
  revalidatePath(`/t/${store.slug}`, "layout");
  return { ok: "Diseño actualizado." };
}

export async function updateSettingsAction(_: FormState, form: FormData): Promise<FormState> {
  const { store } = await requireStore();
  const plan = getPlan(store.plan);
  const paid = plan.id !== "gratis";
  const domainAllowed = plan.id === "pyme" || plan.id === "pro";
  const customDomain = optStr(form, "customDomain");
  if (customDomain && !domainAllowed) return { error: "El dominio propio está disponible en los planes Pyme y Pro." };
  const payYape = bool(form, "payYape");
  const payPlin = paid && bool(form, "payPlin");
  const payTransfer = paid && bool(form, "payTransfer");
  const payCard = paid && bool(form, "payCard");
  const payCash = bool(form, "payCash");
  if (!payYape && !payPlin && !payTransfer && !payCard && !payCash) return { error: "Activa al menos un medio de pago." };
  await prisma.store.update({
    where: { id: store.id },
    data: {
      category: str(form, "category") || store.category,
      whatsapp: optStr(form, "whatsapp"),
      email: optStr(form, "email"),
      instagram: optStr(form, "instagram"),
      facebook: optStr(form, "facebook"),
      tiktok: optStr(form, "tiktok"),
      address: optStr(form, "address"),
      payYape,
      yapeNumber: optStr(form, "yapeNumber"),
      payPlin,
      plinNumber: form.has("plinNumber") ? optStr(form, "plinNumber") : store.plinNumber,
      payTransfer,
      bankInfo: form.has("bankInfo") ? optStr(form, "bankInfo") : store.bankInfo,
      payCard,
      payCash,
      shippingLima: num(form, "shippingLima"),
      shippingProvince: num(form, "shippingProvince"),
      freeShippingFrom: optNum(form, "freeShippingFrom"),
      pickupEnabled: bool(form, "pickupEnabled"),
      published: bool(form, "published"),
      customDomain: domainAllowed ? customDomain : null,
    },
  });
  revalidatePath("/panel", "layout");
  revalidatePath(`/t/${store.slug}`, "layout");
  return { ok: "Configuración guardada." };
}

export async function changePlanAction(form: FormData) {
  const { store } = await requireStore();
  const planId = str(form, "plan");
  if (!PLANS.some((p) => p.id === planId)) return;
  const data: Record<string, unknown> = { plan: planId };
  if (planId === "gratis") Object.assign(data, { payPlin: false, payTransfer: false, payCard: false, customDomain: null });
  await prisma.store.update({ where: { id: store.id }, data });
  revalidatePath("/panel", "layout");
  redirect("/panel/plan?ok=1");
}

/* ---------------- Categorías ---------------- */

export async function createCategoryAction(form: FormData) {
  const { store } = await requireStore();
  const name = str(form, "name");
  if (name) await prisma.category.create({ data: { name, storeId: store.id } });
  revalidatePath("/panel/productos");
}

export async function deleteCategoryAction(form: FormData) {
  const { store } = await requireStore();
  await prisma.category.deleteMany({ where: { id: str(form, "id"), storeId: store.id } });
  revalidatePath("/panel/productos");
}

/* ---------------- Productos ---------------- */

export async function saveProductAction(_: FormState, form: FormData): Promise<FormState> {
  const { store } = await requireStore();
  const id = str(form, "id");
  const name = str(form, "name");
  const price = num(form, "price", -1);
  if (!name) return { error: "El nombre del producto es obligatorio." };
  if (price < 0) return { error: "Ingresa un precio válido." };
  const salePrice = optNum(form, "salePrice");
  if (salePrice != null && salePrice >= price) return { error: "El precio de oferta debe ser menor al precio normal." };

  const existing = id ? await prisma.product.findFirst({ where: { id, storeId: store.id } }) : null;
  if (id && !existing) return { error: "Producto no encontrado." };
  if (!existing) {
    const max = getPlan(store.plan).maxProducts;
    const count = await prisma.product.count({ where: { storeId: store.id } });
    if (max != null && count >= max) {
      return { error: `Tu plan ${getPlan(store.plan).name} permite hasta ${max} productos. Mejora tu plan para agregar más.` };
    }
  }
  const categoryId = str(form, "categoryId");
  const validCategory = categoryId ? await prisma.category.findFirst({ where: { id: categoryId, storeId: store.id } }) : null;

  let imageUrl: string | null;
  try {
    imageUrl = await resolveImage(form, "imageFile", "imageUrl", existing?.imageUrl ?? null);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const data = {
    name,
    description: str(form, "description"),
    price,
    salePrice,
    stock: Math.max(0, Math.floor(num(form, "stock"))),
    sku: optStr(form, "sku"),
    categoryId: validCategory?.id ?? null,
    imageUrl,
    active: bool(form, "active"),
    featured: bool(form, "featured"),
  };
  if (existing) await prisma.product.update({ where: { id: existing.id }, data });
  else await prisma.product.create({ data: { ...data, storeId: store.id } });
  revalidatePath("/panel/productos");
  revalidatePath(`/t/${store.slug}`, "layout");
  redirect("/panel/productos");
}

export async function deleteProductAction(form: FormData) {
  const { store } = await requireStore();
  await prisma.product.deleteMany({ where: { id: str(form, "id"), storeId: store.id } });
  revalidatePath("/panel/productos");
  revalidatePath(`/t/${store.slug}`, "layout");
}

export async function toggleProductAction(form: FormData) {
  const { store } = await requireStore();
  const p = await prisma.product.findFirst({ where: { id: str(form, "id"), storeId: store.id } });
  if (p) await prisma.product.update({ where: { id: p.id }, data: { active: !p.active } });
  revalidatePath("/panel/productos");
  revalidatePath(`/t/${store.slug}`, "layout");
}

/* ---------------- Pedidos ---------------- */

export async function updateOrderStatusAction(form: FormData) {
  const { store } = await requireStore();
  const order = await prisma.order.findFirst({ where: { id: str(form, "id"), storeId: store.id }, include: { items: true } });
  const status = str(form, "status");
  if (!order || !["pendiente", "pagado", "enviado", "entregado", "cancelado"].includes(status)) return;
  await prisma.$transaction(async (tx) => {
    // Al cancelar se devuelve el stock; al reactivar un pedido cancelado se vuelve a descontar.
    if (status === "cancelado" && order.status !== "cancelado") {
      for (const it of order.items) if (it.productId) await tx.product.updateMany({ where: { id: it.productId }, data: { stock: { increment: it.quantity } } });
    } else if (order.status === "cancelado" && status !== "cancelado") {
      for (const it of order.items) if (it.productId) await tx.product.updateMany({ where: { id: it.productId }, data: { stock: { decrement: it.quantity } } });
    }
    await tx.order.update({ where: { id: order.id }, data: { status } });
  });
  revalidatePath("/panel", "layout");
}

/* ---------------- Cupones ---------------- */

export async function createCouponAction(_: FormState, form: FormData): Promise<FormState> {
  const { store } = await requireStore();
  if (store.plan === "gratis") return { error: "Los cupones están disponibles desde el plan Emprendedor." };
  const code = str(form, "code").toUpperCase().replace(/\s+/g, "");
  const type = str(form, "type") === "monto" ? "monto" : "porcentaje";
  const value = num(form, "value");
  if (!/^[A-Z0-9_-]{3,20}$/.test(code)) return { error: "El código debe tener entre 3 y 20 letras o números." };
  if (value <= 0 || (type === "porcentaje" && value > 100)) return { error: "Ingresa un valor de descuento válido." };
  if (await prisma.coupon.findUnique({ where: { storeId_code: { storeId: store.id, code } } })) return { error: "Ya existe un cupón con ese código." };
  await prisma.coupon.create({ data: { storeId: store.id, code, type, value, minAmount: num(form, "minAmount") } });
  revalidatePath("/panel/cupones");
  return { ok: `Cupón ${code} creado.` };
}

export async function toggleCouponAction(form: FormData) {
  const { store } = await requireStore();
  const c = await prisma.coupon.findFirst({ where: { id: str(form, "id"), storeId: store.id } });
  if (c) await prisma.coupon.update({ where: { id: c.id }, data: { active: !c.active } });
  revalidatePath("/panel/cupones");
}

export async function deleteCouponAction(form: FormData) {
  const { store } = await requireStore();
  await prisma.coupon.deleteMany({ where: { id: str(form, "id"), storeId: store.id } });
  revalidatePath("/panel/cupones");
}
