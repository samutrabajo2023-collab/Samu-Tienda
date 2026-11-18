import Link from "next/link";
import type { Metadata } from "next";
import { getStoreBySlug, isOwner } from "@/lib/store";
import { CartProvider } from "@/components/store/Cart";
import { CartButton } from "@/components/store/CartButton";
import { LogoMark } from "@/components/Logo";
import { waLink } from "@/lib/format";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const store = await getStoreBySlug(params.slug);
  return { title: { default: store.name, template: `%s | ${store.name}` }, description: store.description };
}

export default async function StoreLayout({ children, params }: { children: React.ReactNode; params: { slug: string } }) {
  const store = await getStoreBySlug(params.slug);
  const owner = await isOwner(store.ownerId);

  if (!store.published && !owner) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="text-5xl">🛠️</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">{store.name}</h1>
        <p className="mt-2 text-slate-500">Esta tienda está en mantenimiento. Vuelve pronto.</p>
      </div>
    );
  }

  const base = `/t/${store.slug}`;
  return (
    <CartProvider slug={store.slug}>
      <div className="flex min-h-screen flex-col bg-slate-50" style={{ ["--store" as string]: store.primaryColor }}>
        {owner && (
          <div className="bg-slate-900 px-4 py-2 text-center text-xs text-white">
            Estás viendo tu tienda{!store.published && " (no publicada)"} · <Link href="/panel" className="font-semibold underline">Volver al panel</Link>
          </div>
        )}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="container-x flex h-16 items-center justify-between gap-4">
            <Link href={base} className="flex min-w-0 items-center gap-3">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="h-10 w-10 rounded-xl object-cover" />
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white" style={{ background: "var(--store)" }}>
                  {store.name[0]}
                </span>
              )}
              <span className="truncate text-lg font-extrabold text-slate-900">{store.name}</span>
            </Link>
            <div className="flex items-center gap-1">
              {store.whatsapp && (
                <a href={waLink(store.whatsapp, `Hola ${store.name}, tengo una consulta.`)} target="_blank" className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-green-600 hover:bg-green-50 sm:block">
                  💬 WhatsApp
                </a>
              )}
              <CartButton />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="container-x grid gap-6 py-10 text-sm text-slate-600 sm:grid-cols-3">
            <div>
              <div className="font-bold text-slate-900">{store.name}</div>
              <p className="mt-2 line-clamp-3">{store.description}</p>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-slate-900">Contacto</div>
              {store.whatsapp && <p>📱 {store.whatsapp}</p>}
              {store.email && <p>✉️ {store.email}</p>}
              {store.address && <p>📍 {store.address}</p>}
            </div>
            <div className="space-y-1">
              <div className="font-bold text-slate-900">Síguenos</div>
              {store.instagram && <p>Instagram: {store.instagram}</p>}
              {store.facebook && <p>Facebook: {store.facebook}</p>}
              {store.tiktok && <p>TikTok: {store.tiktok}</p>}
              {!store.instagram && !store.facebook && !store.tiktok && <p className="text-slate-400">Pronto en redes</p>}
            </div>
          </div>
          <div className="border-t border-slate-100 py-4">
            <Link href="/" className="flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-600">
              Tienda creada con <LogoMark className="h-4 w-4" /> <b>Samu Tienda</b>
            </Link>
          </div>
        </footer>
        {store.whatsapp && (
          <a
            href={waLink(store.whatsapp, `Hola ${store.name}, tengo una consulta.`)}
            target="_blank"
            aria-label="WhatsApp"
            className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg hover:bg-green-600"
          >
            💬
          </a>
        )}
      </div>
    </CartProvider>
  );
}
