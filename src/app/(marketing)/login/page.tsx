import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/AuthForms";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Ingresar" };

export default async function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  if (await getCurrentUser()) redirect("/panel");
  return (
    <div className="bg-gradient-to-b from-brand-50 to-white py-16">
      <div className="container-x max-w-md">
        <div className="card p-8">
          <h1 className="text-2xl font-extrabold text-slate-900">Bienvenido de vuelta 👋</h1>
          <p className="mb-6 mt-1 text-slate-500">Ingresa para gestionar tu tienda.</p>
          <LoginForm next={searchParams.next} />
        </div>
        <p className="mt-6 rounded-xl bg-white/70 p-4 text-center text-sm text-slate-500 ring-1 ring-slate-200">
          Cuenta demo: <b>demo@samutienda.pe</b> / <b>demo123</b>
        </p>
      </div>
    </div>
  );
}
