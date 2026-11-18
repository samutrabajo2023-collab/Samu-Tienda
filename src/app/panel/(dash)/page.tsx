import Link from "next/link";
import { requireStore } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, soles } from "@/lib/format";
import { getPlan } from "@/lib/plans";
import { PageHeader } from "@/components/panel/PageHeader";
import { StatusBadge } from "@/components/panel/StatusBadge";
import { CopyLink } from "@/components/panel/CopyLink";

export const metadata = { title: "Panel" };

export default async function DashboardPage({ searchParams }: { searchParams: { bienvenida?: string } }) {
  const { store } = await requireStore();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const since = new Date(now.getTime() - 13 * 864e5);
  since.setHours(0, 0, 0, 0);

  const [monthOrders, productCount, recent, pending, lowStock, chartOrders] = await Promise.all([
    prisma.order.findMany({ where: { storeId: store.id, createdAt: { gte: monthStart }, status: { not: "cancelado" } }, select: { total: true } }),
    prisma.product.count({ where: { storeId: store.id } }),
    prisma.order.findMany({ where: { storeId: store.id }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.order.count({ where: { storeId: store.id, status: "pendiente" } }),
    prisma.product.findMany({ where: { storeId: store.id, active: true, stock: { lte: 3 } }, take: 5, orderBy: { stock: "asc" } }),
    prisma.order.findMany({ where: { storeId: store.id, createdAt: { gte: since }, status: { not: "cancelado" } }, select: { total: true, createdAt: true } }),
  ]);

  const sales = monthOrders.reduce((s, o) => s + o.total, 0);
  const avg = monthOrders.length ? sales / monthOrders.length : 0;
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(since.getTime() + i * 864e5);
    const total = chartOrders.filter((o) => new Date(o.createdAt).toDateString() === d.toDateString()).reduce((s, o) => s + o.total, 0);
    return { label: d.toLocaleDateString("es-PE", { day: "2-digit", month: "short" }), total };
  });
  const maxDay = Math.max(...days.map((d) => d.total), 1);
  const plan = getPlan(store.plan);
  const storeUrl = `/t/${store.slug}`;

  return (
    <>
      {searchParams.bienvenida && (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 p-6 text-white">
          <h2 className="text-xl font-bold">🎉 ¡Tu tienda {store.name} ya está online!</h2>
          <p className="mt-1 text-brand-100">Agrega tus productos, configura tus medios de pago y comparte tu link.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/panel/productos/nuevo" className="btn bg-white text-brand-700 hover:bg-brand-50">Agregar producto</Link>
            <Link href="/panel/configuracion" className="btn border border-white/40 text-white hover:bg-white/10">Configurar pagos</Link>
          </div>
        </div>
      )}
      <PageHeader title="Resumen" subtitle={`Así va ${store.name} este mes`} actions={<Link href="/panel/productos/nuevo" className="btn-primary">+ Nuevo producto</Link>} />

      <div className="card mb-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm text-slate-500">Link de tu tienda</div>
          <a href={storeUrl} target="_blank" className="font-semibold text-brand-600 hover:underline">samutienda.pe{storeUrl}</a>
        </div>
        <CopyLink path={storeUrl} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ventas del mes" value={soles(sales)} />
        <Stat label="Pedidos del mes" value={String(monthOrders.length)} />
        <Stat label="Ticket promedio" value={soles(avg)} />
        <Stat label="Productos" value={`${productCount}${plan.maxProducts ? ` / ${plan.maxProducts}` : ""}`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-bold text-slate-900">Ventas de los últimos 14 días</h3>
          <div className="mt-6 flex h-48 gap-1.5">
            {days.map((d) => (
              <div key={d.label} className="group flex flex-1 flex-col items-center gap-1">
                <div className="relative w-full flex-1">
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-brand-500 transition group-hover:bg-brand-700"
                    style={{ height: `${Math.max((d.total / maxDay) * 100, d.total ? 4 : 1)}%` }}
                    title={`${d.label}: ${soles(d.total)}`}
                  />
                </div>
                <span className="hidden text-[10px] text-slate-400 sm:block">{d.label.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-slate-900">Por atender</h3>
          <Link href="/panel/pedidos?estado=pendiente" className="mt-4 flex items-center justify-between rounded-xl bg-amber-50 p-4 hover:bg-amber-100">
            <span className="text-sm font-medium text-amber-900">Pedidos pendientes</span>
            <span className="text-2xl font-extrabold text-amber-700">{pending}</span>
          </Link>
          <h4 className="mt-5 text-sm font-semibold text-slate-700">Stock bajo</h4>
          {lowStock.length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">Todo en orden 👌</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm">
              {lowStock.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <Link href={`/panel/productos/${p.id}`} className="truncate text-slate-700 hover:text-brand-600">{p.name}</Link>
                  <span className={p.stock === 0 ? "font-bold text-red-600" : "text-amber-600"}>{p.stock} und.</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <h3 className="font-bold text-slate-900">Últimos pedidos</h3>
          <Link href="/panel/pedidos" className="text-sm font-semibold text-brand-600">Ver todos →</Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 pb-8 text-sm text-slate-500">Aún no tienes pedidos. ¡Comparte el link de tu tienda en tus redes!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-3"><Link href={`/panel/pedidos/${o.id}`} className="font-semibold text-brand-600">#{o.code}</Link></td>
                    <td className="px-5 py-3">{o.customerName}</td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(o.createdAt)}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3 text-right font-semibold">{soles(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-slate-900">{value}</div>
    </div>
  );
}
