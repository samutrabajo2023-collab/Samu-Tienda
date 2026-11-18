"use server";

import { randomInt } from "crypto";
import { prisma } from "@/lib/db";
import { effectivePrice } from "@/lib/format";
import { couponDiscount, enabledPayments, shippingCost } from "@/lib/shop";
import { DEPARTAMENTOS } from "@/lib/constants";

export interface CheckoutInput {
  slug: string;
  items: { productId: string; quantity: number }[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerDoc?: string;
  deliveryType: "envio" | "recojo";
  department?: string;
  district?: string;
  address?: string;
  reference?: string;
  notes?: string;
  paymentMethod: string;
  couponCode?: string;
}

export async function checkCouponAction(slug: string, code: string, subtotal: number) {
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store || store.plan === "gratis") return { error: "Cupón no válido." };
  const coupon = await prisma.coupon.findUnique({ where: { storeId_code: { storeId: store.id, code: code.trim().toUpperCase() } } });
  if (!coupon || !coupon.active) return { error: "Cupón no válido o vencido." };
  if (subtotal < coupon.minAmount) return { error: `Este cupón requiere una compra mínima de S/ ${coupon.minAmount.toFixed(2)}.` };
  return { code: coupon.code, discount: couponDiscount(coupon, subtotal) };
}

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[randomInt(chars.length)]).join("");
}

export async function placeOrderAction(input: CheckoutInput): Promise<{ error?: string; code?: string }> {
  const store = await prisma.store.findUnique({ where: { slug: input.slug } });
  if (!store || !store.published) return { error: "La tienda no está disponible." };

  const name = input.customerName?.trim();
  const phone = input.customerPhone?.replace(/[^\d+]/g, "");
  if (!name || !phone || phone.length < 9) return { error: "Ingresa tu nombre y un celular válido." };
  const deliveryType = input.deliveryType === "recojo" && store.pickupEnabled ? "recojo" : "envio";
  if (deliveryType === "envio") {
    if (!input.department || !DEPARTAMENTOS.includes(input.department)) return { error: "Selecciona tu departamento." };
    if (!input.address?.trim() || !input.district?.trim()) return { error: "Completa tu distrito y dirección de entrega." };
  }
  if (!enabledPayments(store).includes(input.paymentMethod)) return { error: "Selecciona un medio de pago válido." };

  const qty = new Map<string, number>();
  for (const it of input.items ?? []) {
    const q = Math.floor(Number(it.quantity));
    if (q > 0) qty.set(it.productId, (qty.get(it.productId) ?? 0) + q);
  }
  if (qty.size === 0) return { error: "Tu carrito está vacío." };

  try {
    const code = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({ where: { id: { in: [...qty.keys()] }, storeId: store.id, active: true } });
      if (products.length !== qty.size) throw new Error("Algunos productos ya no están disponibles. Revisa tu carrito.");
      for (const p of products) {
        if (p.stock < qty.get(p.id)!) throw new Error(`Solo quedan ${p.stock} unidad(es) de "${p.name}".`);
      }
      const subtotal = products.reduce((s, p) => s + effectivePrice(p) * qty.get(p.id)!, 0);
      let discount = 0;
      let couponCode: string | null = null;
      if (input.couponCode && store.plan !== "gratis") {
        const c = await tx.coupon.findUnique({ where: { storeId_code: { storeId: store.id, code: input.couponCode.trim().toUpperCase() } } });
        discount = couponDiscount(c, subtotal);
        if (c && discount > 0) {
          couponCode = c.code;
          await tx.coupon.update({ where: { id: c.id }, data: { uses: { increment: 1 } } });
        }
      }
      const shipping = shippingCost(store, deliveryType, input.department ?? null, subtotal - discount);
      const total = Math.round((subtotal - discount + shipping) * 100) / 100;

      let code = genCode();
      while (await tx.order.findUnique({ where: { code } })) code = genCode();

      for (const p of products) {
        await tx.product.update({ where: { id: p.id }, data: { stock: { decrement: qty.get(p.id)! } } });
      }
      await tx.order.create({
        data: {
          code,
          storeId: store.id,
          customerName: name,
          customerPhone: phone,
          customerEmail: input.customerEmail?.trim() || null,
          customerDoc: input.customerDoc?.trim() || null,
          deliveryType,
          department: deliveryType === "envio" ? input.department : null,
          district: deliveryType === "envio" ? input.district?.trim() : null,
          address: deliveryType === "envio" ? input.address?.trim() : null,
          reference: input.reference?.trim() || null,
          notes: input.notes?.trim() || null,
          paymentMethod: input.paymentMethod,
          // El pago con tarjeta se simula como aprobado en modo demostración.
          status: input.paymentMethod === "tarjeta" ? "pagado" : "pendiente",
          subtotal,
          discount,
          shipping,
          total,
          couponCode,
          items: { create: products.map((p) => ({ productId: p.id, name: p.name, price: effectivePrice(p), quantity: qty.get(p.id)! })) },
        },
      });
      return code;
    });
    return { code };
  } catch (e) {
    return { error: (e as Error).message || "No se pudo registrar el pedido." };
  }
}
