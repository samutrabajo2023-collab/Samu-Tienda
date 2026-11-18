import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getStoreBySlug } from "@/lib/store";
import { ProductCard } from "@/components/store/ProductCard";
import { soles } from "@/lib/format";

export default async function StoreHome({ params, searchParams }: { params: { slug: string }; searchParams: { q?: string; cat?: string; orden?: string } }) {
  const store = await getStoreBySlug(params.slug);
  const q = searchParams.q?.trim();
  const orderBy: Prisma.ProductOrderByWithRelationInput =
    searchParams.orden === "precio-asc" ? { price: "asc" } : searchParams.orden === "precio-desc" ? { price: "desc" } : { createdAt: "desc" };
  const [categories, products, featured] = await Promise.all([
    prisma.category.findMany({ where: { storeId: store.id, products: { some: { active: true } } }, orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { storeId: store.id, active: true, ...(q ? { name: { contains: q } } : {}), ...(searchParams.cat ? { categoryId: searchParams.cat } : {}) },
      orderBy: [{ featured: "desc" as const }, orderBy],
    }),
    q || searchParams.cat ? Promise.resolve([]) : prisma.product.findMany({ where: { storeId: store.id, active: true, featured: true }, take: 4 }),
  ]);
  const base = `/t/${store.slug}`;
  const qs = (extra: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q, cat: searchParams.cat, orden: searchParams.orden, ...extra };
    Object.entries(merged).forEach(([k, v]) => v && p.set(k, v));
    const s = p.toString();
    return s ? `${base}?${s}` : base;
  };

  return (
    <>
      <section className="relative overflow-hidden" style={{ background: "var(--store)" }}>
        {store.bannerUrl && <img src={store.bannerUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="container-x relative py-14 text-white sm:py-20">
          <h1 className="max-w-2xl text-3xl font-extrabold sm:text-5xl">{store.name}</h1>
          <p className="mt-3 max-w-xl text-white/90">{store.description}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">🚚 Envíos a todo el Perú</span>
            {store.freeShippingFrom != null && <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">🎁 Envío gratis desde {soles(store.freeShippingFrom)}</span>}
            {store.payYape && <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">💜 Aceptamos Yape</span>}
          </div>
        </div>
      </section>

      <div className="container-x py-8">
        <form action={base} className="flex flex-col gap-3 sm:flex-row">
          <input name="q" defaultValue={q} className="input" placeholder="¿Qué estás buscando?" />
          {searchParams.cat && <input type="hidden" name="cat" value={searchParams.cat} />}
          <select name="orden" defaultValue={searchParams.orden ?? ""} className="input sm:w-56">
            <option value="">Más recientes</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
          <button className="btn text-white" style={{ background: "var(--store)" }}>Buscar</button>
        </form>

        {categories.length > 0 && (
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            <Link href={qs({ cat: undefined })} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold ${!searchParams.cat ? "text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`} style={!searchParams.cat ? { background: "var(--store)" } : undefined}>
              Todos
            </Link>
            {categories.map((c) => {
              const active = searchParams.cat === c.id;
              return (
                <Link key={c.id} href={qs({ cat: c.id })} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold ${active ? "text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`} style={active ? { background: "var(--store)" } : undefined}>
                  {c.name}
                </Link>
              );
            })}
          </div>
        )}

        {featured.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-extrabold text-slate-900">⭐ Destacados</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {featured.map((p) => <ProductCard key={p.id} product={p} slug={store.slug} />)}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-extrabold text-slate-900">{q ? `Resultados para "${q}"` : "Todos los productos"}</h2>
          {products.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center text-slate-500 ring-1 ring-slate-200">No encontramos productos.</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => <ProductCard key={p.id} product={p} slug={store.slug} />)}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
