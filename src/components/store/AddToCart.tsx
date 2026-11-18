"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "./Cart";

export function AddToCart({ product, compact = false }: { product: Omit<CartItem, "quantity">; compact?: boolean }) {
  const { add, slug } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const out = product.stock <= 0;

  if (compact) {
    return (
      <button
        type="button"
        disabled={out}
        onClick={() => { add(product, 1); setAdded(true); setTimeout(() => setAdded(false), 1200); }}
        className="btn w-full py-2 text-white disabled:bg-slate-300"
        style={out ? undefined : { background: "var(--store)" }}
      >
        {out ? "Agotado" : added ? "✓ Agregado" : "Agregar al carrito"}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {!out && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600">Cantidad</span>
          <div className="flex items-center rounded-xl border border-slate-300">
            <button type="button" className="px-3 py-2 text-lg" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <span className="w-10 text-center font-semibold">{qty}</span>
            <button type="button" className="px-3 py-2 text-lg" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
          </div>
          <span className="text-xs text-slate-500">{product.stock} disponibles</span>
        </div>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={out}
          onClick={() => { add(product, qty); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
          className="btn flex-1 py-3 text-base text-white disabled:bg-slate-300"
          style={out ? undefined : { background: "var(--store)" }}
        >
          {out ? "Producto agotado" : added ? "✓ Agregado al carrito" : "Agregar al carrito"}
        </button>
        {!out && (
          <button type="button" onClick={() => { add(product, qty); router.push(`/t/${slug}/checkout`); }} className="btn-outline flex-1 py-3 text-base">
            Comprar ahora
          </button>
        )}
      </div>
    </div>
  );
}
