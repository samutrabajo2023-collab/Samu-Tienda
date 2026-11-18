import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getStoreBySlug } from "@/lib/store";
import { soles, waLink } from "@/lib/format";
import { PAYMENT_METHODS, statusInfo } from "@/lib/constants";

export const metadata = { title: "Pedido confirmado" };

export default async function PedidoConfirmado({ params }: { params: { slug: string; code: string } }) {
  const store = await getStoreBySlug(params.slug);
  const order = await prisma.order.findFirst({ where: { code: params.code.toUpperCase(), storeId: store.id }, include: { items: true } });
  if (!order) notFound();
  const base = `/t/${store.slug}`;
  const lines = order.items.map((i) => `• ${i.quantity} x ${i.name} — ${soles(i.price * i.quantity)}`).join("\n");
  const waText = `¡Hola ${store.name}! 👋 Acabo de hacer el pedido *#${order.code}*\n\n${lines}\n\n*Total: ${soles(order.total)}*\nPago: ${PAYMENT_METHODS[order.paymentMethod]}\nEntrega: ${order.deliveryType === "recojo" ? "Recojo en tienda" : `${order.address}, ${order.district}, ${order.department}`}\nNombre: ${order.customerName}`;

  return (
    <div className="container-x max-w-2xl py-10">
      <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-slate-200">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">✅</div>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">¡Gracias por tu compra, {order.customerName.split(" ")[0]}!</h1>
        <p className="mt-1 text-slate-500">Tu pedido <b className="text-slate-900">#{order.code}</b> fue registrado.</p>
        <span className={`badge mt-3 ${statusInfo(order.status).color}`}>{statusInfo(order.status).label}</span>
      </div>

      {order.status === "pendiente" && order.paymentMethod !== "contraentrega" && (
        <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-slate-200">
          <h2 className="font-bold text-slate-900">Completa tu pago de {soles(order.total)}</h2>
          {order.paymentMethod === "yape" && <PayInfo label="Yapea al número" value={store.yapeNumber || store.whatsapp || "—"} name={store.name} />}
          {order.paymentMethod === "plin" && <PayInfo label="Plinea al número" value={store.plinNumber || "—"} name={store.name} />}
          {order.paymentMethod === "transferencia" && (
            <div className="mt-4 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{store.bankInfo || "El vendedor te enviará los datos bancarios."}</div>
          )}
          <p className="mt-4 text-sm text-slate-500">Envía la captura de tu pago por WhatsApp indicando el código de pedido <b>#{order.code}</b>.</p>
        </div>
      )}
      {order.paymentMethod === "contraentrega" && (
        <div className="mt-6 rounded-3xl bg-white p-6 text-sm text-slate-600 ring-1 ring-slate-200">💵 Pagarás <b>{soles(order.total)}</b> al momento de recibir tu pedido.</div>
      )}

      <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="mb-3 font-bold text-slate-900">Resumen</h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between"><span className="text-slate-600">{i.quantity} × {i.name}</span><span>{soles(i.price * i.quantity)}</span></li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-sm">
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Descuento</span><span>- {soles(order.discount)}</span></div>}
          <div className="flex justify-between text-slate-600"><span>Envío</span><span>{order.shipping ? soles(order.shipping) : "Gratis"}</span></div>
          <div className="flex justify-between text-lg font-extrabold"><span>Total</span><span>{soles(order.total)}</span></div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {store.whatsapp && (
          <a href={waLink(store.whatsapp, waText)} target="_blank" className="btn flex-1 bg-green-500 py-3 text-base text-white hover:bg-green-600">💬 Enviar pedido por WhatsApp</a>
        )}
        <Link href={base} className="btn-outline flex-1 py-3 text-base">Seguir comprando</Link>
      </div>
    </div>
  );
}

function PayInfo({ label, value, name }: { label: string; value: string; name: string }) {
  return (
    <div className="mt-4 flex items-center gap-4 rounded-xl bg-purple-50 p-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl ring-1 ring-purple-100">📱</div>
      <div>
        <div className="text-sm text-slate-600">{label}</div>
        <div className="text-2xl font-extrabold tracking-wide text-purple-900">{value}</div>
        <div className="text-sm text-slate-500">A nombre de {name}</div>
      </div>
    </div>
  );
}
