import Link from "next/link";
import { requireStore } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { soles } from "@/lib/format";
import { PageHeader } from "@/components/panel/PageHeader";
import { ActionForm } from "@/components/panel/ActionForm";
import { SubmitButton } from "@/components/SubmitButton";
import { ConfirmButton } from "@/components/panel/ConfirmButton";
import { createCouponAction, deleteCouponAction, toggleCouponAction } from "@/app/actions/panel";

export const metadata = { title: "Cupones" };

export default async function CuponesPage() {
  const { store } = await requireStore();
  const coupons = await prisma.coupon.findMany({ where: { storeId: store.id }, orderBy: { createdAt: "desc" } });
  const locked = store.plan === "gratis";
  return (
    <>
      <PageHeader title="Cupones de descuento" subtitle="Crea códigos promocionales para tus clientes." />
      {locked && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-accent-400/15 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-800">🔒 Los cupones están disponibles desde el plan <b>Emprendedor</b>.</p>
          <Link href="/panel/plan" className="btn-accent">Mejorar plan</Link>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card h-fit p-6">
          <h3 className="mb-4 font-bold text-slate-900">Nuevo cupón</h3>
          <ActionForm action={createCouponAction} className="space-y-4" resetOnOk>
            <fieldset disabled={locked} className="space-y-4">
              <div>
                <label className="label" htmlFor="code">Código</label>
                <input id="code" name="code" required className="input uppercase" placeholder="BIENVENIDO10" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="type">Tipo</label>
                  <select id="type" name="type" className="input">
                    <option value="porcentaje">% Porcentaje</option>
                    <option value="monto">S/ Monto fijo</option>
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="value">Valor</label>
                  <input id="value" name="value" type="number" step="0.01" min="0" required className="input" placeholder="10" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="minAmount">Compra mínima (S/)</label>
                <input id="minAmount" name="minAmount" type="number" step="0.01" min="0" defaultValue={0} className="input" />
              </div>
              <SubmitButton className="btn-primary w-full">Crear cupón</SubmitButton>
            </fieldset>
          </ActionForm>
        </div>
        <div className="lg:col-span-2">
          {coupons.length === 0 ? (
            <div className="card p-10 text-center text-slate-500"><div className="text-4xl">🏷️</div><p className="mt-3">Aún no tienes cupones.</p></div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {coupons.map((c) => (
                <div key={c.id} className={`card p-5 ${c.active ? "" : "opacity-60"}`}>
                  <div className="flex items-start justify-between">
                    <span className="rounded-lg border-2 border-dashed border-brand-300 bg-brand-50 px-3 py-1 font-mono font-bold text-brand-700">{c.code}</span>
                    <span className={`badge ${c.active ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"}`}>{c.active ? "Activo" : "Inactivo"}</span>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-slate-900">{c.type === "porcentaje" ? `${c.value}% dscto.` : `${soles(c.value)} dscto.`}</p>
                  <p className="text-sm text-slate-500">{c.minAmount > 0 ? `Compra mínima ${soles(c.minAmount)}` : "Sin compra mínima"} · {c.uses} uso(s)</p>
                  <div className="mt-4 flex gap-2">
                    <form action={toggleCouponAction}>
                      <input type="hidden" name="id" value={c.id} />
                      <button className="btn-outline px-3 py-1.5">{c.active ? "Desactivar" : "Activar"}</button>
                    </form>
                    <form action={deleteCouponAction}>
                      <input type="hidden" name="id" value={c.id} />
                      <ConfirmButton message={`¿Eliminar el cupón ${c.code}?`} className="btn-danger px-3 py-1.5">Eliminar</ConfirmButton>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
