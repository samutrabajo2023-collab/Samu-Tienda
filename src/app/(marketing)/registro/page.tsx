import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/AuthForms";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Crea tu tienda gratis" };

export default async function RegistroPage() {
  if (await getCurrentUser()) redirect("/panel");
  return (
    <div className="bg-gradient-to-b from-brand-50 to-white py-16">
      <div className="container-x grid max-w-5xl items-center gap-12 lg:grid-cols-2">
        <div className="hidden lg:block">
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900">Empieza a vender online hoy mismo</h1>
          <ul className="mt-6 space-y-4 text-slate-700">
            <li>✅ Tu tienda lista en menos de 5 minutos</li>
            <li>✅ Acepta Yape, Plin, transferencias y tarjetas</li>
            <li>✅ Recibe pedidos por WhatsApp</li>
            <li>✅ Plan gratuito para siempre, sin tarjeta</li>
          </ul>
        </div>
        <div className="card p-8">
          <h2 className="text-2xl font-extrabold text-slate-900">Crea tu cuenta</h2>
          <p className="mb-6 mt-1 text-slate-500">Gratis, sin tarjeta de crédito.</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
