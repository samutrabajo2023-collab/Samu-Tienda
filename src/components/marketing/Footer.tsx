import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed">
            La plataforma peruana para crear y gestionar tu tienda virtual de forma fácil, rápida y económica.
          </p>
          <p className="mt-4 text-sm">Lima, Perú 🇵🇪</p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Producto</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#caracteristicas" className="hover:text-white">Características</Link></li>
            <li><Link href="/precios" className="hover:text-white">Planes y precios</Link></li>
            <li><Link href="/#pagos" className="hover:text-white">Medios de pago</Link></li>
            <li><Link href="/t/samu-demo" className="hover:text-white">Ver tienda demo</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Recursos</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#como-funciona" className="hover:text-white">Cómo crear tu tienda</Link></li>
            <li><Link href="/#faq" className="hover:text-white">Preguntas frecuentes</Link></li>
            <li><Link href="/registro" className="hover:text-white">Empieza gratis</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Contacto</h4>
          <ul className="space-y-2 text-sm">
            <li>WhatsApp: +51 999 999 999</li>
            <li>hola@samutienda.pe</li>
            <li>Lun a Sáb, 9:00 a.m. – 7:00 p.m.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} Samu Tienda. Todos los derechos reservados.</p>
          <p>Términos y condiciones · Política de privacidad · Libro de reclamaciones</p>
        </div>
      </div>
    </footer>
  );
}
