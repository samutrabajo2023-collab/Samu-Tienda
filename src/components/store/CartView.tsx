"use client";

import Link from "next/link";
import { useCart } from "./Cart";
import { soles } from "@/lib/format";

export function CartView() {
  const { items, subtotal, setQty, remove, slug, ready } = useCart();
  const base = `/t/${slug}`;
  if (!ready) return <div className="container-x py-16 text-center text-slate-400">Cargando carrito...</div>;
  if (items.length === 0) {
    return (
      <div className="container-x py-20 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Tu carrito está vacío</h1>
        <p className="mt-2 text-slate-500">Descubre nuestros productos y agrega tus favoritos.</p>
        <Link href={base} className="btn mt-6 text-white" style={{ background: "var(--store)" }}>Seguir comprando</Link>
      </div>
    );
  }
  return (
    <div className="container-x py-8">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-900">Tu carrito</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((it) => (
            <div key={it.productId} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {it.imageUrl && <img src={it.imageUrl} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`${base}/p/${it.productId}`} className="line-clamp-2 font-semibold text-slate-800 hover:underline">{it.name}</Link>
                <div className="text-sm text-slate-500">{soles(it.price)} c/u</div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-slate-300">
                    <button className="px-2.5 py-1" onClick={() => setQty(it.productId, it.quantity - 1)}>−</button>
                    <span className="w-8 text-center text-sm font-semibold">{it.quantity}</span>
                    <button className="px-2.5 py-1" onClick={() => setQty(it.productId, it.quantity + 1)}>+</button>
                  </div>
                  <button className="text-sm text-red-600 hover:underline" onClick={() => remove(it.productId)}>Quitar</button>
                </div>
              </div>
              <div className="font-bold text-slate-900">{soles(it.price * it.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="h-fit rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <h2 className="font-bold text-slate-900">Resumen</h2>
          <div className="mt-4 flex justify-between text-slate-600"><span>Subtotal</span><span className="font-semibold text-slate-900">{soles(subtotal)}</span></div>
          <p className="mt-1 text-xs text-slate-500">El envío y los descuentos se calculan en el siguiente paso.</p>
          <Link href={`${base}/checkout`} className="btn mt-5 w-full py-3 text-base text-white" style={{ background: "var(--store)" }}>Continuar compra</Link>
          <Link href={base} className="mt-3 block text-center text-sm text-slate-500 hover:underline">Seguir comprando</Link>
        </div>
      </div>
    </div>
  );
}
