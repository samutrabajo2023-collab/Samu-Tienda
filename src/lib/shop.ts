import type { Coupon, Store } from "@prisma/client";

export const LIMA_ZONES = ["Lima", "Callao"];

export function couponDiscount(c: Coupon | null, subtotal: number) {
  if (!c || !c.active || subtotal < c.minAmount) return 0;
  const d = c.type === "porcentaje" ? (subtotal * c.value) / 100 : c.value;
  return Math.round(Math.min(d, subtotal) * 100) / 100;
}

export function shippingCost(store: Store, deliveryType: string, department: string | null, amount: number) {
  if (deliveryType === "recojo") return 0;
  if (store.freeShippingFrom != null && amount >= store.freeShippingFrom) return 0;
  return department && LIMA_ZONES.includes(department) ? store.shippingLima : store.shippingProvince;
}

export function enabledPayments(store: Store) {
  const list: string[] = [];
  if (store.payYape) list.push("yape");
  if (store.payPlin) list.push("plin");
  if (store.payTransfer) list.push("transferencia");
  if (store.payCard) list.push("tarjeta");
  if (store.payCash) list.push("contraentrega");
  return list;
}
