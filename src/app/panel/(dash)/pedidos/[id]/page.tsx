import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStore } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, soles, waLink } from "@/lib/format";
import { ORDER_STATUSES, PAYMENT_METHODS } from "@/lib/constants";
import { PageHeader } from "@/components/panel/PageHeader";
import { StatusBadge } from "@/components/panel/StatusBadge";
import { updateOrderStatusAction } from "@/app/actions/panel";

export const metadata = { title: "Detalle de pedido" };

export default async function PedidoPage({ params }: { params: { id: string } }) {
  const { store } = await requireStore();
  const order = await prisma.order.findFirst({ where: { id: params.id, storeId: store.id }, include: { items: true } });
  if (!order) notFound();
  const msg = `Hola ${order.customerName.split(" ")[0]}, te escribimos de ${store.name} sobre tu pedido #${order.code} por ${soles(order.total)}.`;

  return (
    <>
      <Link href="/panel/pedidos" className="mb-3 inline-block text-sm text-slate-500 hover:text-brand-600">← Volver a pedidos</Link>
      <PageHeader
        title={`Pedido #${order.code}`}
        subtitle={formatDate(order.createdAt)}
        actions={
          <a href={waLink(order.customerPhone, msg)} target="_blank" className="btn bg-green-500 text-white hover:bg-green-600">
            💬 Escribir por WhatsApp
          </a>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <h3 className="font-bold text-slate-900">Productos</h3>
              <StatusBadge status={order.status} />
            </div>
            <table className="w-full text-sm">
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.id} className="border-t border-slate-100">
                    <td className="px-5 py-3">{it.name}</td>
                    <td className="px-5 py-3 text-slate-500">{it.quantity} × {soles(it.price)}</td>
                    <td className="px-5 py-3 text-right font-semibold">{soles(it.quantity * it.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="space-y-1 border-t border-slate-200 bg-slate-50 p-5 text-sm">
              <Row label="Subtotal" value={soles(order.subtotal)} />
              {order.discount > 0 && <Row label={`Descuento${order.couponCode ? ` (${order.couponCode})` : ""}`} value={`- ${soles(order.discount)}`} />}
              <Row label="Envío" value={order.shipping ? soles(order.shipping) : "Gratis"} />
              <div className="flex justify-between pt-2 text-base font-extrabold text-slate-900"><span>Total</span><span>{soles(order.total)}</span></div>
            </div>
          </div>
          <div className="card p-5">
            <h3 className="mb-3 font-bold text-slate-900">Actualizar estado</h3>
            <div className="flex flex-wrap gap-2">
              {ORDER_STATUSES.map((s) => (
                <form key={s.id} action={updateOrderStatusAction}>
                  <input type="hidden" name="id" value={order.id} />
                  <input type="hidden" name="status" value={s.id} />
                  <button
                    disabled={order.status === s.id}
                    className={`btn px-4 py-2 ${order.status === s.id ? "bg-brand-600 text-white disabled:opacity-100" : "btn-outline"}`}
                  >
                    {s.label}
                  </button>
                </form>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="card space-y-2 p-5 text-sm">
            <h3 className="mb-2 font-bold text-slate-900">Cliente</h3>
            <p className="font-medium text-slate-800">{order.customerName}</p>
            <p>📱 {order.customerPhone}</p>
            {order.customerEmail && <p>✉️ {order.customerEmail}</p>}
            {order.customerDoc && <p>🪪 DNI/RUC: {order.customerDoc}</p>}
          </div>
          <div className="card space-y-2 p-5 text-sm">
            <h3 className="mb-2 font-bold text-slate-900">Entrega</h3>
            {order.deliveryType === "recojo" ? (
              <p>🏬 Recojo en tienda</p>
            ) : (
              <>
                <p>🚚 Envío a domicilio</p>
                <p>{order.address}</p>
                <p className="text-slate-500">{[order.district, order.department].filter(Boolean).join(", ")}</p>
                {order.reference && <p className="text-slate-500">Ref.: {order.reference}</p>}
              </>
            )}
          </div>
          <div className="card space-y-2 p-5 text-sm">
            <h3 className="mb-2 font-bold text-slate-900">Pago</h3>
            <p>{PAYMENT_METHODS[order.paymentMethod] ?? order.paymentMethod}</p>
            {order.notes && <p className="rounded-lg bg-amber-50 p-3 text-amber-900">📝 {order.notes}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-slate-600"><span>{label}</span><span>{value}</span></div>;
}
