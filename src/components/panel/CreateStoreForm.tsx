"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { createStoreAction } from "@/app/actions/panel";
import { SubmitButton } from "@/components/SubmitButton";
import { slugify } from "@/lib/format";
import { RUBROS } from "@/lib/constants";

export function CreateStoreForm() {
  const [state, action] = useFormState(createStoreAction, undefined);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [touched, setTouched] = useState(false);
  const effective = touched ? slugify(slug) : slugify(name);
  return (
    <form action={action} className="space-y-5">
      {state?.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      <div>
        <label className="label" htmlFor="name">Nombre de tu tienda</label>
        <input id="name" name="name" required className="input" placeholder="Ej. Dulces Rosita" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="label" htmlFor="slug">Dirección de tu tienda</label>
        <div className="flex items-center overflow-hidden rounded-xl border border-slate-300 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100">
          <span className="whitespace-nowrap bg-slate-50 px-3 py-2.5 text-sm text-slate-500">samutienda.pe/t/</span>
          <input
            id="slug"
            name="slug"
            className="w-full px-2 py-2.5 text-sm outline-none"
            value={effective}
            onChange={(e) => { setTouched(true); setSlug(e.target.value); }}
            placeholder="dulces-rosita"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="category">Rubro</label>
          <select id="category" name="category" className="input" defaultValue="General">
            {RUBROS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="whatsapp">WhatsApp para pedidos</label>
          <input id="whatsapp" name="whatsapp" className="input" placeholder="987 654 321" />
        </div>
      </div>
      <SubmitButton className="btn-primary w-full py-3" pendingText="Creando tu tienda...">Crear mi tienda 🚀</SubmitButton>
    </form>
  );
}
