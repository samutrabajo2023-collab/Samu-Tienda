import Link from "next/link";
import { PLANS } from "@/lib/plans";

export function PlanCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {PLANS.map((p) => (
        <div
          key={p.id}
          className={`relative flex flex-col rounded-3xl border p-7 ${
            p.highlight ? "border-brand-600 bg-brand-600 text-white shadow-2xl shadow-brand-600/30 lg:-mt-4 lg:mb-4" : "border-slate-200 bg-white"
          }`}
        >
          {p.highlight && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white">
              Más elegido
            </span>
          )}
          <h3 className="text-lg font-bold">{p.name}</h3>
          <p className={`mt-1 text-sm ${p.highlight ? "text-brand-100" : "text-slate-500"}`}>{p.tagline}</p>
          <div className="mt-5 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold">{p.price === 0 ? "S/ 0" : `S/ ${p.price}`}</span>
            <span className={p.highlight ? "text-brand-100" : "text-slate-500"}>/mes</span>
          </div>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className={p.highlight ? "text-accent-400" : "text-brand-600"}>✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/registro?plan=${p.id}`}
            className={`mt-7 ${p.highlight ? "btn bg-white text-brand-700 hover:bg-brand-50" : "btn-outline"}`}
          >
            {p.price === 0 ? "Empezar gratis" : "Elegir plan"}
          </Link>
        </div>
      ))}
    </div>
  );
}
