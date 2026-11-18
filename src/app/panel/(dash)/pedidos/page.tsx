import Link from "next/link";
import { requireStore } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, soles } from "@/lib/format";
import { ORDER_STATUSES, PAYMENT_METHODS } from "@/lib/constants";
import { PageHeader } from "@/components/panel/PageHeader";
import { StatusBadge } from "@/components/panel/StatusBadge";

export const metadata = { title: "Pedidos" };

export default async function PedidosPage({ searchParams }: { searchParams: { estado?: string; q?: string } }) {
  const { store } = await requireStore();
  const q = searchParams.q?.trim();
  const [orders, counts] = await Promise.all([
    prisma.order.findMany({
      where: {
        storeId: store.id,
        ...(searchParams.estado ? { status: searchParams.estado } : {}),
        ...(q ? { OR: [{ code: { contains: q.toUpperCase() } }, { customerName: { contains: q } }, { customerPhone: { contains: q } }] } : {}),
      },
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.order.groupBy({ by: ["status"], where: { storeId: store.id }, _count: true }),
  ]);
  const countOf = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;
  const all = counts.reduce((s, c) => s + c._count, 0);
  const tab = (estado: string | undefined, label: string, n: number) => {
    const active = searchParams.estado === estado;
    return (
      <Link
        key={label}
        href={estado ? `/panel/pedidos?estado=${estado}` : "/panel/pedidos"}
        className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium ${active ? "bg-brand-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}
      >
        {label} <span className="opacity-70">({n})</span>
      </Link>
    );
  };

  return (
    <>
      <PageHeader title="Pedidos" subtitle="Gestiona y actualiza el estado de tus ventas." />
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {tab(undefined, "Todos", all)}
        {ORDER_STATUSES.map((s) => tab(s.id, s.label, countOf(s.id)))}
      </div>
      <form className="mb-4 flex gap-2">
        {searchParams.estado && <input type="hidden" name="estado" value={searchParams.estado} />}
        <input name="q" defaultValue={q} className="input" placeholder="Buscar por código, cliente o celular..." />
        <button className="btn-outline">Buscar</button>
      </form>
      {orders.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          <div className="text-4xl">📦</div>
          <p className="mt-3">No hay pedidos para mostrar.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                <th className="p-3 font-medium">Pedido</th>
                <th className="p-3 font-medium">Cliente</th>
                <th className="p-3 font-medium">Fecha</th>
                <th className="p-3 font-medium">Pago</th>
                <th className="p-3 font-medium">Estado</th>
                <th className="p-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="p-3">
                    <Link href={`/panel/pedidos/${o.id}`} className="font-semibold text-brand-600 hover:underline">#{o.code}</Link>
                    <div className="text-xs text-slate-400">{o._count.items} ítem(s)</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-slate-800">{o.customerName}</div>
                    <div className="text-xs text-slate-500">{o.customerPhone}</div>
                  </td>
                  <td className="p-3 text-slate-500">{formatDate(o.createdAt)}</td>
                  <td className="p-3">{PAYMENT_METHODS[o.paymentMethod] ?? o.paymentMethod}</td>
                  <td className="p-3"><StatusBadge status={o.status} /></td>
                  <td className="p-3 text-right font-semibold">{soles(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
