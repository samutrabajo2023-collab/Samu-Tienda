"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  quantity: number;
}

interface CartCtx {
  slug: string;
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  const key = `samu-cart-${slug}`;
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {}
  }, [items, key, ready]);

  const add = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const ex = prev.find((i) => i.productId === item.productId);
      if (ex) return prev.map((i) => (i.productId === item.productId ? { ...i, ...item, quantity: Math.min(i.quantity + qty, item.stock) } : i));
      return [...prev, { ...item, quantity: Math.min(qty, item.stock) }];
    });
  }, []);
  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock)) } : i)));
  }, []);
  const remove = useCallback((productId: string) => setItems((prev) => prev.filter((i) => i.productId !== productId)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      slug,
      items,
      ready,
      count: items.reduce((s, i) => s + i.quantity, 0),
      subtotal: items.reduce((s, i) => s + i.quantity * i.price, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [slug, items, ready, add, setQty, remove, clear]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart debe usarse dentro de CartProvider");
  return c;
}
