import Link from "next/link";
import { requireStore } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { soles } from "@/lib/format";
import { getPlan } from "@/lib/plans";
import { PageHeader } from "@/components/panel/PageHeader";
import { createCategoryAction, deleteCategoryAction, deleteProductAction, toggleProductAction } from "@/app/actions/panel";
import { ConfirmButton } from "@/components/panel/ConfirmButton";

export const metadata = { title: "Productos" };

export default async function ProductosPage({ searchParams }: { searchParams: { q?: string; cat?: string } }) {
  const { store } = await requireStore();
  const q = searchParams.q?.trim();
  const [products, categories, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        storeId: store.id,
        ...(q ? { name: { contains: q } } : {}),
        ...(searchParams.cat ? { categoryId: searchParams.cat } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ where: { storeId: store.id }, include: { _count: { select: { products: true } } }, orderBy: { name: "asc" } }),
    prisma.product.count({ where: { storeId: store.id } }),
  ]);
  const plan = getPlan(store.plan);

  return (
    <>
      <PageHeader
        title="Productos"
        subtitle={`${total} producto(s)${plan.maxProducts ? ` de ${plan.maxProducts} permitidos en tu plan` : ""}`}
        actions={<Link href="/panel/productos/nuevo" className="btn-primary">+ Nuevo producto</Link>}
      />
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <form className="mb-4 flex gap-2">
            <input name="q" defaultValue={q} className="input" placeholder="Buscar producto..." />
            {searchParams.cat && <input type="hidden" name="cat" value={searchParams.cat} />}
            <button className="btn-outline">Buscar</button>
          </form>
          {products.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="text-4xl">🛍️</div>
              <p className="mt-3 font-semibold text-slate-800">No hay productos todavía</p>
              <p className="text-sm text-slate-500">Agrega tu primer producto para empezar a vender.</p>
              <Link href="/panel/productos/nuevo" className="btn-primary mt-5">Agregar producto</Link>
            </div>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                    <th className="p-3 font-medium">Producto</th>
                    <th className="p-3 font-medium">Precio</th>
                    <th className="p-3 font-medium">Stock</th>
                    <th className="p-3 font-medium">Estado</th>
                    <th className="p-3" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            {p.imageUrl && <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />}
                          </div>
                          <div className="min-w-0">
                            <Link href={`/panel/productos/${p.id}`} className="block truncate font-semibold text-slate-900 hover:text-brand-600">{p.name}</Link>
                            <span className="text-xs text-slate-500">{p.category?.name ?? "Sin categoría"}{p.featured ? " · ⭐ Destacado" : ""}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        {p.salePrice ? (
                          <>
                            <div className="font-semibold text-slate-900">{soles(p.salePrice)}</div>
                            <div className="text-xs text-slate-400 line-through">{soles(p.price)}</div>
                          </>
                        ) : (
                          <span className="font-semibold">{soles(p.price)}</span>
                        )}
                      </td>
                      <td className={`p-3 ${p.stock === 0 ? "font-bold text-red-600" : p.stock <= 3 ? "text-amber-600" : ""}`}>{p.stock}</td>
                      <td className="p-3">
                        <form action={toggleProductAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button className={`badge ${p.active ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"}`} title="Cambiar visibilidad">
                            {p.active ? "Visible" : "Oculto"}
                          </button>
                        </form>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <Link href={`/panel/productos/${p.id}`} className="btn-ghost px-3 py-1.5">Editar</Link>
                          <form action={deleteProductAction}>
                            <input type="hidden" name="id" value={p.id} />
                            <ConfirmButton message={`¿Eliminar "${p.name}"?`} className="btn-danger px-3 py-1.5">Eliminar</ConfirmButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card h-fit p-5">
          <h3 className="font-bold text-slate-900">Categorías</h3>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <Link href="/panel/productos" className={`block rounded-lg px-2 py-1.5 ${!searchParams.cat ? "bg-brand-50 font-semibold text-brand-700" : "hover:bg-slate-50"}`}>Todas</Link>
            </li>
            {categories.map((c) => (
              <li key={c.id} className="flex items-center gap-1">
                <Link href={`/panel/productos?cat=${c.id}`} className={`flex-1 rounded-lg px-2 py-1.5 ${searchParams.cat === c.id ? "bg-brand-50 font-semibold text-brand-700" : "hover:bg-slate-50"}`}>
                  {c.name} <span className="text-slate-400">({c._count.products})</span>
                </Link>
                <form action={deleteCategoryAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <ConfirmButton message={`¿Eliminar la categoría "${c.name}"? Los productos quedarán sin categoría.`} className="px-2 text-slate-400 hover:text-red-600">×</ConfirmButton>
                </form>
              </li>
            ))}
          </ul>
          <form action={createCategoryAction} className="mt-4 flex gap-2">
            <input name="name" required className="input py-2" placeholder="Nueva categoría" />
            <button className="btn-primary px-3 py-2">+</button>
          </form>
        </div>
      </div>
    </>
  );
}
