import { requireStore } from "@/lib/auth";
import { PageHeader } from "@/components/panel/PageHeader";
import { ActionForm } from "@/components/panel/ActionForm";
import { ImageField } from "@/components/panel/ImageField";
import { SubmitButton } from "@/components/SubmitButton";
import { updateDesignAction } from "@/app/actions/panel";

export const metadata = { title: "Diseño de tienda" };

const COLORS = ["#3366ff", "#0ea5e9", "#10b981", "#16a34a", "#f59e0b", "#ef4444", "#e11d48", "#db2777", "#9333ea", "#0f172a"];

export default async function DisenoPage() {
  const { store } = await requireStore();
  return (
    <>
      <PageHeader title="Diseño de tu tienda" subtitle="Personaliza la imagen de tu marca." actions={<a href={`/t/${store.slug}`} target="_blank" className="btn-outline">Ver tienda ↗</a>} />
      <ActionForm action={updateDesignAction} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card space-y-5 p-6">
            <div>
              <label className="label" htmlFor="name">Nombre de la tienda</label>
              <input id="name" name="name" defaultValue={store.name} required className="input" />
            </div>
            <div>
              <label className="label" htmlFor="description">Descripción / mensaje de bienvenida</label>
              <textarea id="description" name="description" rows={3} defaultValue={store.description} className="input" />
            </div>
            <div>
              <span className="label">Color principal</span>
              <div className="flex flex-wrap items-center gap-2">
                {COLORS.map((c) => (
                  <label key={c} className="cursor-pointer">
                    <input type="radio" name="primaryColor" value={c} defaultChecked={store.primaryColor === c} className="peer sr-only" />
                    <span className="block h-9 w-9 rounded-full ring-offset-2 peer-checked:ring-2 peer-checked:ring-slate-900" style={{ background: c }} />
                  </label>
                ))}
                {!COLORS.includes(store.primaryColor) && (
                  <label className="cursor-pointer">
                    <input type="radio" name="primaryColor" value={store.primaryColor} defaultChecked className="peer sr-only" />
                    <span className="block h-9 w-9 rounded-full ring-offset-2 peer-checked:ring-2 peer-checked:ring-slate-900" style={{ background: store.primaryColor }} />
                  </label>
                )}
              </div>
            </div>
          </div>
          <div className="card p-6">
            <ImageField label="Banner de portada (recomendado 1600×500)" fileName="bannerFile" urlName="bannerUrl" current={store.bannerUrl} aspect="aspect-[16/5]" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <ImageField label="Logo" fileName="logoFile" urlName="logoUrl" current={store.logoUrl} />
          </div>
          <SubmitButton className="btn-primary w-full py-3">Guardar diseño</SubmitButton>
        </div>
      </ActionForm>
    </>
  );
}
