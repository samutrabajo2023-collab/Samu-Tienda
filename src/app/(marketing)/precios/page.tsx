import { PlanCards } from "@/components/marketing/PlanCards";
import { Faq } from "@/components/marketing/Faq";

export const metadata = { title: "Planes y precios" };

const rows: [string, string[]][] = [
  ["Productos", ["10", "200", "2,000", "Ilimitados"]],
  ["Comisión por venta", ["0%", "0%", "0%", "0%"]],
  ["Pedidos por WhatsApp", ["✓", "✓", "✓", "✓"]],
  ["Yape y contraentrega", ["✓", "✓", "✓", "✓"]],
  ["Plin y transferencias", ["—", "✓", "✓", "✓"]],
  ["Pagos con tarjeta", ["—", "✓", "✓", "✓"]],
  ["Cupones de descuento", ["—", "✓", "✓", "✓"]],
  ["Personalización de marca", ["Básica", "✓", "✓", "✓"]],
  ["Reportes de ventas", ["Básico", "✓", "✓", "✓"]],
  ["Dominio propio", ["—", "—", "✓", "✓"]],
  ["Pasarelas Culqi / Izipay / Niubiz", ["—", "—", "✓", "✓"]],
  ["Usuarios administradores", ["1", "1", "3", "Ilimitados"]],
  ["Soporte", ["Email", "WhatsApp", "Prioritario", "Asesor dedicado"]],
];

export default function PreciosPage() {
  return (
    <div className="bg-gradient-to-b from-brand-50 to-white">
      <section className="container-x py-16 text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Planes y precios</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Elige el plan ideal para tu negocio</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Todos los planes incluyen hosting, certificado SSL, tienda adaptada a celulares y 0% de comisión por venta.
        </p>
      </section>
      <section className="container-x pb-16"><PlanCards /></section>
      <section className="container-x pb-20">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-slate-900">Compara los planes</h2>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="p-4 font-semibold">Funcionalidad</th>
                {["Gratis", "Emprendedor", "Pyme", "Pro"].map((h) => (
                  <th key={h} className="p-4 text-center font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, vals]) => (
                <tr key={label} className="border-b border-slate-100 last:border-0">
                  <td className="p-4 font-medium text-slate-700">{label}</td>
                  {vals.map((v, i) => (
                    <td key={i} className={`p-4 text-center ${v === "✓" ? "text-brand-600 font-bold" : v === "—" ? "text-slate-300" : "text-slate-700"}`}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="container-x max-w-3xl pb-20">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-slate-900">Preguntas frecuentes</h2>
        <Faq />
      </section>
    </div>
  );
}
