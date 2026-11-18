import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <LogoMark className="h-14 w-14" />
      <h1 className="mt-6 text-3xl font-extrabold text-slate-900">Página no encontrada</h1>
      <p className="mt-2 text-slate-500">La página o tienda que buscas no existe o fue movida.</p>
      <Link href="/" className="btn-primary mt-6">Ir al inicio</Link>
    </div>
  );
}
