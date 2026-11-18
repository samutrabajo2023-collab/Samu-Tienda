"use client";

import Link from "next/link";
import { useCart } from "./Cart";

export function CartButton() {
  const { count, slug } = useCart();
  return (
    <Link href={`/t/${slug}/carrito`} className="relative flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100">
      <span className="text-xl">🛒</span>
      <span className="hidden sm:inline">Carrito</span>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold text-white" style={{ background: "var(--store)" }}>
          {count}
        </span>
      )}
    </Link>
  );
}
