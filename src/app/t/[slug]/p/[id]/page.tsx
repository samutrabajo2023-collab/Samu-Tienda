import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getStoreBySlug } from "@/lib/store";
import { effectivePrice, soles, waLink } from "@/lib/format";
import { AddToCart } from "@/components/store/AddToCart";
import { ProductCard } from "@/components/store/ProductCard";
import { enabledPayments } from "@/lib/shop";
import { PAYMENT_METHODS } from "@/lib/constants";

async function load(slug: string, id: string) {
  const store = await getStoreBySlug(slug);
  const product = await prisma.product.findFirst({ where: { id, storeId: store.id, active: true }, include: { category: true } });
  if (!product) notFound();
  return { store, product };
}

export async function generateMetadata({ params }: { params: { slug: string; id: string } }): Promise<Metadata> {
  const { product } = await load(params.slug, params.id);
  return { title: product.name, description: product.description.slice(0, 160) };
}

export default async function ProductPage({ params }: { params: { slug: string; id: string } }) {
  const { store, product } = await load(params.slug, params.id);
  const price = effectivePrice(product);
  const related = await prisma.product.findMany({
    where: { storeId: store.id, active: true, id: { not: product.id }, ...(product.categoryId ? { categoryId: product.categoryId } : {}) },
    take: 4,
  });
  const base = `/t/${store.slug}`;
  return (
    <div className="container-x py-8">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href={base} className="hover:underline">Inicio</Link>
        {product.category && <> / <Link href={`${base}?cat=${product.categoryId}`} className="hover:underline">{product.category.name}</Link></>}
        {" / "}<span className="text-slate-800">{product.name}</span>
      </nav>
      <div className="grid gap-10 rounded-3xl bg-white p-6 ring-1 ring-slate-200 md:grid-cols-2 md:p-10">
        <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-6xl text-slate-300">🛍️</div>}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{product.name}</h1>
          {product.sku && <p className="mt-1 text-xs text-slate-400">SKU: {product.sku}</p>}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold" style={{ color: "var(--store)" }}>{soles(price)}</span>
            {price < product.price && <span className="text-lg text-slate-400 line-through">{soles(product.price)}</span>}
          </div>
          <p className="mt-6 whitespace-pre-line text-slate-600">{product.description || "Sin descripción."}</p>
          <div className="mt-8"><AddToCart product={{ productId: product.id, name: product.name, price, imageUrl: product.imageUrl, stock: product.stock }} /></div>
          {store.whatsapp && (
            <a href={waLink(store.whatsapp, `Hola, me interesa "${product.name}" (${soles(price)}).`)} target="_blank" className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-green-500 py-3 font-semibold text-green-600 hover:bg-green-50">
              💬 Consultar por WhatsApp
            </a>
          )}
          <div className="mt-8 space-y-2 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
            <p>🚚 Envío Lima: {soles(store.shippingLima)} · Provincias: {soles(store.shippingProvince)}</p>
            {store.freeShippingFrom != null && <p>🎁 Envío gratis por compras desde {soles(store.freeShippingFrom)}</p>}
            {store.pickupEnabled && <p>🏬 Recojo en tienda disponible</p>}
            <p>💳 Paga con: {enabledPayments(store).map((m) => PAYMENT_METHODS[m]).join(", ")}</p>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-extrabold text-slate-900">También te puede gustar</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} slug={store.slug} />)}
          </div>
        </section>
      )}
    </div>
  );
}
