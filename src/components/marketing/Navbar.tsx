import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getCurrentUser } from "@/lib/auth";

const links = [
  { href: "/#caracteristicas", label: "Características" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/precios", label: "Precios" },
  { href: "/#pagos", label: "Medios de pago" },
  { href: "/#faq", label: "Preguntas" },
];

export async function Navbar() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link href="/panel" className="btn-primary">Ir a mi panel</Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost hidden sm:inline-flex">Ingresar</Link>
              <Link href="/registro" className="btn-primary">Crear tienda gratis</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
