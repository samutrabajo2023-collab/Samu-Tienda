"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";

const items = [
  { href: "/panel", label: "Inicio", icon: "🏠" },
  { href: "/panel/pedidos", label: "Pedidos", icon: "📦" },
  { href: "/panel/productos", label: "Productos", icon: "🛍️" },
  { href: "/panel/cupones", label: "Cupones", icon: "🏷️" },
  { href: "/panel/diseno", label: "Diseño", icon: "🎨" },
  { href: "/panel/configuracion", label: "Configuración", icon: "⚙️" },
  { href: "/panel/plan", label: "Mi plan", icon: "⭐" },
];

export function Sidebar({ storeName, slug, planName, pending }: { storeName: string; slug: string; planName: string; pending: number }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="flex flex-col gap-1">
      {items.map((it) => {
        const active = it.href === "/panel" ? path === "/panel" : path.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active ? "bg-brand-600 text-white shadow" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>{it.icon}</span>
            <span className="flex-1">{it.label}</span>
            {it.href === "/panel/pedidos" && pending > 0 && (
              <span className={`badge ${active ? "bg-white text-brand-700" : "bg-accent-500 text-white"}`}>{pending}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Logo href="/panel" />
        <button className="btn-outline px-3 py-2" onClick={() => setOpen(!open)} aria-label="Menú">☰</button>
      </div>
      {open && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white p-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 px-2"><Logo href="/panel" /></div>
        <div className="mb-5 rounded-2xl bg-slate-50 p-3">
          <div className="truncate font-semibold text-slate-900">{storeName}</div>
          <div className="mt-0.5 text-xs text-slate-500">Plan {planName}</div>
          <a href={`/t/${slug}`} target="_blank" className="mt-2 inline-flex text-xs font-semibold text-brand-600 hover:underline">
            Ver mi tienda ↗
          </a>
        </div>
        {nav}
        <div className="mt-auto pt-4 text-xs text-slate-400">¿Ayuda? WhatsApp +51 999 999 999</div>
      </aside>
    </>
  );
}
