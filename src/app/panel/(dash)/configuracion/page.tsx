import Link from "next/link";
import { requireStore } from "@/lib/auth";
import { RUBROS } from "@/lib/constants";
import { PageHeader } from "@/components/panel/PageHeader";
import { ActionForm } from "@/components/panel/ActionForm";
import { SubmitButton } from "@/components/SubmitButton";
import { updateSettingsAction } from "@/app/actions/panel";

export const metadata = { title: "Configuración" };

export default async function ConfiguracionPage() {
  const { store } = await requireStore();
  const paid = store.plan !== "gratis";
  const domainOk = store.plan === "pyme" || store.plan === "pro";
  const Lock = ({ show }: { show: boolean }) =>
    show ? <Link href="/panel/plan" className="badge bg-accent-400/20 text-accent-600">🔒 Plan Emprendedor</Link> : null;

  return (
    <>
      <PageHeader title="Configuración" subtitle="Medios de pago, envíos, contacto y dominio." />
      <ActionForm action={updateSettingsAction} className="space-y-6">
        <Section title="💳 Medios de pago" text="Elige cómo te pagarán tus clientes. El dinero llega directo a ti.">
          <div className="grid gap-4 md:grid-cols-2">
            <PayBox name="payYape" label="Yape" checked={store.payYape}>
              <input name="yapeNumber" defaultValue={store.yapeNumber ?? ""} className="input py-2" placeholder="Número Yape (9 dígitos)" />
            </PayBox>
            <PayBox name="payPlin" label="Plin" checked={store.payPlin} disabled={!paid} badge={<Lock show={!paid} />}>
              <input name="plinNumber" defaultValue={store.plinNumber ?? ""} className="input py-2" placeholder="Número Plin" disabled={!paid} />
            </PayBox>
            <PayBox name="payTransfer" label="Transferencia bancaria" checked={store.payTransfer} disabled={!paid} badge={<Lock show={!paid} />}>
              <textarea name="bankInfo" defaultValue={store.bankInfo ?? ""} rows={2} className="input py-2" placeholder="BCP Cta. Ahorros 191-... / CCI 002-..." disabled={!paid} />
            </PayBox>
            <PayBox name="payCard" label="Tarjeta (Culqi / Izipay / Niubiz)" checked={store.payCard} disabled={!paid} badge={<Lock show={!paid} />}>
              <p className="text-xs text-slate-500">Modo demostración: el pago con tarjeta se simula. Conecta tus llaves de pasarela en producción.</p>
            </PayBox>
            <PayBox name="payCash" label="Pago contraentrega / en tienda" checked={store.payCash} />
          </div>
        </Section>

        <Section title="🚚 Envíos y entregas" text="Define cuánto cobras por envío en Lima y provincias.">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Envío Lima Metropolitana (S/)"><input name="shippingLima" type="number" step="0.1" min="0" defaultValue={store.shippingLima} className="input" /></Field>
            <Field label="Envío a provincias (S/)"><input name="shippingProvince" type="number" step="0.1" min="0" defaultValue={store.shippingProvince} className="input" /></Field>
            <Field label="Envío gratis desde (S/)"><input name="freeShippingFrom" type="number" step="0.1" min="0" defaultValue={store.freeShippingFrom ?? ""} className="input" placeholder="Opcional" /></Field>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" name="pickupEnabled" defaultChecked={store.pickupEnabled} className="h-4 w-4 accent-brand-600" /> Permitir recojo en tienda</label>
        </Section>

        <Section title="📇 Datos de contacto y redes">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Rubro">
              <select name="category" defaultValue={store.category} className="input">{RUBROS.map((r) => <option key={r}>{r}</option>)}</select>
            </Field>
            <Field label="WhatsApp para pedidos"><input name="whatsapp" defaultValue={store.whatsapp ?? ""} className="input" placeholder="987654321" /></Field>
            <Field label="Correo de contacto"><input name="email" type="email" defaultValue={store.email ?? ""} className="input" /></Field>
            <Field label="Dirección física"><input name="address" defaultValue={store.address ?? ""} className="input" placeholder="Av. ... , Miraflores, Lima" /></Field>
            <Field label="Instagram"><input name="instagram" defaultValue={store.instagram ?? ""} className="input" placeholder="@mitienda" /></Field>
            <Field label="Facebook"><input name="facebook" defaultValue={store.facebook ?? ""} className="input" placeholder="facebook.com/mitienda" /></Field>
            <Field label="TikTok"><input name="tiktok" defaultValue={store.tiktok ?? ""} className="input" placeholder="@mitienda" /></Field>
          </div>
        </Section>

        <Section title="🌐 Dominio y visibilidad">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Dirección gratuita">
              <input disabled value={`samutienda.pe/t/${store.slug}`} className="input bg-slate-50" />
            </Field>
            <Field label={domainOk ? "Dominio propio" : "Dominio propio (planes Pyme y Pro)"}>
              <input name="customDomain" defaultValue={store.customDomain ?? ""} disabled={!domainOk} className="input" placeholder="www.mitienda.pe" />
            </Field>
          </div>
          {domainOk && store.customDomain && (
            <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              Para conectar <b>{store.customDomain}</b>, crea un registro <b>CNAME</b> en tu proveedor de dominio apuntando a <b>tiendas.samutienda.pe</b>.
            </p>
          )}
          <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={store.published} className="h-4 w-4 accent-brand-600" /> Tienda publicada (visible para clientes)</label>
        </Section>

        <div className="sticky bottom-4 flex justify-end">
          <SubmitButton className="btn-primary px-8 py-3 shadow-lg">Guardar configuración</SubmitButton>
        </div>
      </ActionForm>
    </>
  );
}

function Section({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h3 className="font-bold text-slate-900">{title}</h3>
      {text && <p className="mb-4 mt-1 text-sm text-slate-500">{text}</p>}
      <div className={text ? "" : "mt-4"}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><span className="label">{label}</span>{children}</div>;
}

function PayBox({ name, label, checked, disabled, badge, children }: { name: string; label: string; checked: boolean; disabled?: boolean; badge?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className={`rounded-xl border border-slate-200 p-4 ${disabled ? "bg-slate-50" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <label className="flex items-center gap-2 font-semibold text-slate-800">
          <input type="checkbox" name={name} defaultChecked={checked && !disabled} disabled={disabled} className="h-4 w-4 accent-brand-600" />
          {label}
        </label>
        {badge}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
