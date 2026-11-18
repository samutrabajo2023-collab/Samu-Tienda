import { requireStore } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PLANS, getPlan } from "@/lib/plans";
import { PageHeader } from "@/components/panel/PageHeader";
import { changePlanAction } from "@/app/actions/panel";

export const metadata = { title: "Mi plan" };

export default async function PlanPage({ searchParams }: { searchParams: { ok?: string } }) {
  const { store } = await requireStore();
  const current = getPlan(store.plan);
  const count = await prisma.product.count({ where: { storeId: store.id } });
  return (
    <>
      <PageHeader title="Mi plan" subtitle={`Estás en el plan ${current.name}. Cambia cuando quieras, sin permanencia.`} />
      {searchParams.ok && <p className="mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">✓ Tu plan fue actualizado a <b>{current.name}</b>.</p>}
      <div className="card mb-6 p-5">
        <div className="flex justify-between text-sm"><span className="text-slate-600">Productos usados</span><span className="font-semibold">{count} / {current.maxProducts ?? "∞"}</span></div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-600" style={{ width: `${current.maxProducts ? Math.min(100, (count / current.maxProducts) * 100) : 5}%` }} />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p) => {
          const isCurrent = p.id === current.id;
          return (
            <div key={p.id} className={`card flex flex-col p-6 ${isCurrent ? "ring-2 ring-brand-600" : ""}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{p.name}</h3>
                {isCurrent && <span className="badge bg-brand-600 text-white">Actual</span>}
              </div>
              <div className="mt-2 text-3xl font-extrabold">S/ {p.price}<span className="text-sm font-normal text-slate-500">/mes</span></div>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
                {p.features.map((f) => <li key={f}>✓ {f}</li>)}
              </ul>
              <form action={changePlanAction} className="mt-5">
                <input type="hidden" name="plan" value={p.id} />
                <button disabled={isCurrent} className={isCurrent ? "btn-outline w-full" : "btn-primary w-full"}>
                  {isCurrent ? "Plan actual" : p.price > current.price ? "Mejorar a " + p.name : "Cambiar a " + p.name}
                </button>
              </form>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-center text-xs text-slate-500">Modo demostración: el cambio de plan es inmediato y no realiza cobros. En producción se integra con la pasarela de pagos.</p>
    </>
  );
}
