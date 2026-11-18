"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useCart } from "./Cart";
import { soles } from "@/lib/format";
import { DEPARTAMENTOS, PAYMENT_METHODS } from "@/lib/constants";
import { checkCouponAction, placeOrderAction } from "@/app/actions/shop";

interface StoreInfo {
  slug: string;
  shippingLima: number;
  shippingProvince: number;
  freeShippingFrom: number | null;
  pickupEnabled: boolean;
  address: string | null;
  couponsEnabled: boolean;
  payments: string[];
}

const PAY_ICONS: Record<string, string> = { yape: "💜", plin: "💙", transferencia: "🏦", tarjeta: "💳", contraentrega: "💵" };

export function Checkout({ store }: { store: StoreInfo }) {
  const { items, subtotal, clear, ready } = useCart();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<"envio" | "recojo">("envio");
  const [department, setDepartment] = useState("Lima");
  const [payment, setPayment] = useState(store.payments[0] ?? "");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  const base = `/t/${store.slug}`;
  const discount = coupon ? Math.min(coupon.discount, subtotal) : 0;
  const afterDiscount = subtotal - discount;
  const shipping =
    delivery === "recojo"
      ? 0
      : store.freeShippingFrom != null && afterDiscount >= store.freeShippingFrom
        ? 0
        : ["Lima", "Callao"].includes(department)
          ? store.shippingLima
          : store.shippingProvince;
  const total = afterDiscount + shipping;

  if (!ready) return <div className="container-x py-16 text-center text-slate-400">Cargando...</div>;
  if (items.length === 0) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <Link href={base} className="btn mt-6 text-white" style={{ background: "var(--store)" }}>Ver productos</Link>
      </div>
    );
  }

  async function applyCoupon() {
    setCouponMsg(null);
    if (!couponInput.trim()) return;
    const r = await checkCouponAction(store.slug, couponInput, subtotal);
    if ("error" in r && r.error) { setCoupon(null); setCouponMsg(r.error); }
    else if ("code" in r && r.code) { setCoupon({ code: r.code, discount: r.discount ?? 0 }); setCouponMsg(`Cupón ${r.code} aplicado.`); }
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "");
    start(async () => {
      const r = await placeOrderAction({
        slug: store.slug,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        customerName: g("name"),
        customerPhone: g("phone"),
        customerEmail: g("email"),
        customerDoc: g("doc"),
        deliveryType: delivery,
        department,
        district: g("district"),
        address: g("address"),
        reference: g("reference"),
        notes: g("notes"),
        paymentMethod: payment,
        couponCode: coupon?.code,
      });
      if (r.error) { setError(r.error); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
      clear();
      router.push(`${base}/pedido/${r.code}`);
    });
  }

  return (
    <div className="container-x py-8">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-900">Finalizar compra</h1>
      {error && <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Box title="1. Tus datos">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className="label">Nombre completo *</label><input name="name" required className="input" /></div>
              <div><label className="label">Celular *</label><input name="phone" required inputMode="tel" className="input" placeholder="987 654 321" /></div>
              <div><label className="label">Correo</label><input name="email" type="email" className="input" /></div>
              <div><label className="label">DNI / RUC</label><input name="doc" className="input" /></div>
            </div>
          </Box>
          <Box title="2. Entrega">
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice active={delivery === "envio"} onClick={() => setDelivery("envio")} title="🚚 Envío a domicilio" text={`Lima ${soles(store.shippingLima)} · Provincias ${soles(store.shippingProvince)}`} />
              {store.pickupEnabled && <Choice active={delivery === "recojo"} onClick={() => setDelivery("recojo")} title="🏬 Recojo en tienda" text={store.address || "Coordinamos el punto de recojo"} />}
            </div>
            {delivery === "envio" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Departamento *</label>
                  <select value={department} onChange={(e) => setDepartment(e.target.value)} className="input">
                    {DEPARTAMENTOS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div><label className="label">Distrito *</label><input name="district" required className="input" placeholder="Ej. Miraflores" /></div>
                <div className="sm:col-span-2"><label className="label">Dirección *</label><input name="address" required className="input" placeholder="Av. / Jr. / Calle, número, dpto." /></div>
                <div className="sm:col-span-2"><label className="label">Referencia</label><input name="reference" className="input" placeholder="Frente al parque..." /></div>
              </div>
            )}
          </Box>
          <Box title="3. Medio de pago">
            <div className="grid gap-3 sm:grid-cols-2">
              {store.payments.map((m) => (
                <Choice key={m} active={payment === m} onClick={() => setPayment(m)} title={`${PAY_ICONS[m]} ${PAYMENT_METHODS[m]}`} text={m === "tarjeta" ? "Visa, Mastercard, Amex (demo)" : m === "contraentrega" ? "Paga al recibir" : "Te mostraremos los datos al confirmar"} />
              ))}
            </div>
            {payment === "tarjeta" && (
              <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
                <p className="text-xs text-slate-500 sm:col-span-3">🔒 Modo demostración: no ingreses datos reales. El pago se aprobará automáticamente.</p>
                <input className="input sm:col-span-3" placeholder="4111 1111 1111 1111" />
                <input className="input" placeholder="MM/AA" />
                <input className="input" placeholder="CVV" />
              </div>
            )}
            <div className="mt-4"><label className="label">Notas para el vendedor</label><textarea name="notes" rows={2} className="input" placeholder="Talla, color, horario de entrega..." /></div>
          </Box>
        </div>
        <div className="h-fit space-y-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200 lg:sticky lg:top-24">
          <h2 className="font-bold text-slate-900">Tu pedido</h2>
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-2"><span className="text-slate-600">{i.quantity} × {i.name}</span><span className="whitespace-nowrap font-medium">{soles(i.price * i.quantity)}</span></li>
            ))}
          </ul>
          {store.couponsEnabled && (
            <div>
              <div className="flex gap-2">
                <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="input py-2 uppercase" placeholder="Código de cupón" />
                <button type="button" onClick={applyCoupon} className="btn-outline px-3 py-2">Aplicar</button>
              </div>
              {couponMsg && <p className={`mt-1 text-xs ${coupon ? "text-green-600" : "text-red-600"}`}>{couponMsg}</p>}
            </div>
          )}
          <div className="space-y-1 border-t border-slate-100 pt-3 text-sm">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{soles(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Descuento</span><span>- {soles(discount)}</span></div>}
            <div className="flex justify-between text-slate-600"><span>Envío</span><span>{shipping ? soles(shipping) : "Gratis"}</span></div>
            <div className="flex justify-between pt-2 text-lg font-extrabold text-slate-900"><span>Total</span><span>{soles(total)}</span></div>
          </div>
          <button disabled={pending || !payment} className="btn w-full py-3 text-base text-white disabled:opacity-60" style={{ background: "var(--store)" }}>
            {pending ? "Procesando..." : payment === "tarjeta" ? `Pagar ${soles(total)}` : "Confirmar pedido"}
          </button>
          <p className="text-center text-xs text-slate-400">🔒 Compra segura</p>
        </div>
      </form>
    </div>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
      <h2 className="mb-4 font-bold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function Choice({ active, onClick, title, text }: { active: boolean; onClick: () => void; title: string; text: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 p-4 text-left transition ${active ? "bg-slate-50" : "border-slate-200 hover:border-slate-300"}`}
      style={active ? { borderColor: "var(--store)" } : undefined}
    >
      <div className="font-semibold text-slate-900">{title}</div>
      <div className="mt-0.5 text-xs text-slate-500">{text}</div>
    </button>
  );
}
