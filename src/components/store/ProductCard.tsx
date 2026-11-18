import Link from "next/link";
import type { Product } from "@prisma/client";
import { effectivePrice, soles } from "@/lib/format";
import { AddToCart } from "./AddToCart";

export function ProductCard({ product, slug }: { product: Product; slug: string }) {
  const price = effectivePrice(product);
  const onSale = price < product.price;
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg">
      <Link href={`/t/${slug}/p/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-100">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-slate-300">🛍️</div>
        )}
        {onSale && (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
            -{Math.round((1 - price / product.price) * 100)}%
          </span>
        )}
        {product.stock <= 0 && <span className="absolute right-2 top-2 rounded-full bg-slate-800 px-2 py-0.5 text-xs font-bold text-white">Agotado</span>}
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <Link href={`/t/${slug}/p/${product.id}`} className="line-clamp-2 text-sm font-semibold text-slate-800 hover:underline">{product.name}</Link>
        <div className="mb-3 mt-1 flex items-baseline gap-2">
          <span className="font-extrabold" style={{ color: "var(--store)" }}>{soles(price)}</span>
          {onSale && <span className="text-xs text-slate-400 line-through">{soles(product.price)}</span>}
        </div>
        <div className="mt-auto">
          <AddToCart compact product={{ productId: product.id, name: product.name, price, imageUrl: product.imageUrl, stock: product.stock }} />
        </div>
      </div>
    </div>
  );
}
