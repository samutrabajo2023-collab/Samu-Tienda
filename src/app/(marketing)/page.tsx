import Link from "next/link";
import { PlanCards } from "@/components/marketing/PlanCards";
import { Faq } from "@/components/marketing/Faq";

const features = [
  { icon: "🛍️", title: "Catálogo de productos", text: "Sube productos con fotos, precios, ofertas, stock y categorías en segundos." },
  { icon: "🛒", title: "Carrito de compras", text: "Tus clientes compran 24/7 con un carrito rápido y optimizado para celulares." },
  { icon: "💳", title: "Pagos peruanos", text: "Recibe pagos con Yape, Plin, transferencias, tarjetas o contraentrega." },
  { icon: "💬", title: "Pedidos por WhatsApp", text: "Cada pedido llega a tu panel y tu cliente puede enviártelo por WhatsApp." },
  { icon: "🚚", title: "Envíos a todo el Perú", text: "Configura tarifas para Lima y provincias, envío gratis y recojo en tienda." },
  { icon: "🎨", title: "Diseño personalizable", text: "Tu logo, banner y colores de marca. Sin saber programar ni diseñar." },
  { icon: "🏷️", title: "Cupones de descuento", text: "Crea códigos por porcentaje o monto fijo para impulsar tus ventas." },
  { icon: "📊", title: "Reportes de ventas", text: "Mira tus ventas, pedidos y ticket promedio desde un panel simple." },
  { icon: "🌐", title: "Dominio propio", text: "Conecta tu dominio .pe o .com y proyecta una imagen profesional." },
];

const steps = [
  { n: "1", title: "Regístrate gratis", text: "Crea tu cuenta en menos de un minuto. No necesitas tarjeta de crédito." },
  { n: "2", title: "Personaliza tu tienda", text: "Elige nombre, sube tu logo y agrega tus productos con fotos y precios." },
  { n: "3", title: "Comparte y vende", text: "Comparte tu link en redes sociales y WhatsApp y empieza a recibir pedidos." },
];

const payments = ["Yape", "Plin", "Visa", "Mastercard", "BCP", "Interbank", "BBVA", "Culqi", "Izipay", "Niubiz", "Contraentrega"];

const testimonials = [
  { name: "Rosa Quispe", store: "Dulces Rosita · Arequipa", text: "En una tarde armé mi tienda y esa misma semana recibí mis primeros pedidos por Yape. ¡Súper fácil!" },
  { name: "Luis Mendoza", store: "TecnoLuis · Lima", text: "Antes vendía solo por Instagram y perdía pedidos. Ahora todo llega ordenado a mi panel." },
  { name: "Carla Huamán", store: "Alpaca Andina · Cusco", text: "Envío mis productos a todo el Perú y mis clientes pagan con la opción que prefieren." },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-brand-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="badge bg-white text-brand-700 ring-1 ring-brand-200">🇵🇪 Hecho para emprendedores peruanos</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Crea tu <span className="text-brand-600">tienda virtual</span> en minutos y vende en todo el Perú
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600">
              Samu Tienda es la plataforma de comercio electrónico más fácil, rápida y económica para lanzar tu negocio online.
              Acepta Yape, Plin y tarjetas, recibe pedidos por WhatsApp y gestiona todo desde un solo lugar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/registro" className="btn-primary px-7 py-3.5 text-base">Crear mi tienda gratis</Link>
              <Link href="/t/samu-demo" className="btn-outline px-7 py-3.5 text-base">Ver tienda demo →</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <span>✓ Sin tarjeta de crédito</span>
              <span>✓ Sin comisiones por venta</span>
              <span>✓ Soporte en español</span>
            </div>
          </div>
          <HeroMockup />
        </div>
        <div className="container-x relative grid grid-cols-2 gap-6 pb-16 text-center md:grid-cols-4">
          {[
            ["+5,000", "tiendas creadas"],
            ["+120,000", "pedidos procesados"],
            ["25", "regiones del Perú"],
            ["0%", "comisión por venta"],
          ].map(([n, l]) => (
            <div key={l} className="card p-5">
              <div className="text-3xl font-extrabold text-brand-600">{n}</div>
              <div className="mt-1 text-sm text-slate-500">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="caracteristicas" className="scroll-mt-20 py-20">
        <div className="container-x">
          <SectionTitle eyebrow="Características" title="Todo lo que necesitas para vender online" text="Herramientas pensadas para el mercado peruano, listas desde el primer día." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">{f.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="scroll-mt-20 bg-slate-50 py-20">
        <div className="container-x">
          <SectionTitle eyebrow="Cómo funciona" title="Tu tienda online en 3 simples pasos" text="Sin programadores, sin complicaciones y sin grandes inversiones." />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative card p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-xl font-extrabold text-white">{s.n}</div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/registro" className="btn-accent px-8 py-3.5 text-base">Empezar ahora, es gratis</Link>
          </div>
        </div>
      </section>

      {/* PAYMENTS */}
      <section id="pagos" className="scroll-mt-20 py-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle align="left" eyebrow="Medios de pago" title="Cobra como prefieren tus clientes" text="Integra los medios de pago más usados en el Perú. El dinero llega directo a tu cuenta, sin intermediarios." />
            <ul className="mt-8 space-y-3 text-slate-700">
              <li>✅ Billeteras digitales: Yape y Plin con tu número o QR</li>
              <li>✅ Transferencias a BCP, Interbank, BBVA, Scotiabank</li>
              <li>✅ Tarjetas de crédito y débito vía Culqi, Izipay o Niubiz</li>
              <li>✅ Pago contraentrega y recojo en tienda</li>
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
            {payments.map((p) => (
              <div key={p} className="card flex h-20 items-center justify-center p-3 text-center text-sm font-bold text-slate-700">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="precios" className="scroll-mt-20 bg-gradient-to-b from-white to-brand-50 py-20">
        <div className="container-x">
          <SectionTitle eyebrow="Precios" title="Planes en soles, sin sorpresas" text="Empieza gratis y mejora tu plan cuando tu negocio crezca. Sin comisiones por venta." />
          <div className="mt-14"><PlanCards /></div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Precios incluyen IGV. <Link href="/precios" className="font-semibold text-brand-600">Compara todos los planes →</Link>
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="container-x">
          <SectionTitle eyebrow="Testimonios" title="Emprendedores que ya venden con Samu Tienda" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="card p-7">
                <div className="text-accent-500">★★★★★</div>
                <blockquote className="mt-3 text-slate-700">“{t.text}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.store}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-slate-50 py-20">
        <div className="container-x max-w-3xl">
          <SectionTitle eyebrow="Preguntas frecuentes" title="¿Tienes dudas? Te ayudamos" />
          <div className="mt-12"><Faq /></div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-8 py-14 text-center text-white sm:px-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
            <h2 className="text-3xl font-extrabold sm:text-4xl">Tu negocio merece estar en internet</h2>
            <p className="mx-auto mt-4 max-w-2xl text-brand-100">
              Únete a miles de emprendedores peruanos que ya venden online con Samu Tienda. Crea tu tienda hoy mismo.
            </p>
            <Link href="/registro" className="btn mt-8 bg-white px-8 py-3.5 text-base text-brand-700 hover:bg-brand-50">
              Crear mi tienda gratis
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionTitle({ eyebrow, title, text, align = "center" }: { eyebrow: string; title: string; text?: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : ""}>
      <p className="text-sm font-bold uppercase tracking-wider text-brand-600">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-lg text-slate-600">{text}</p>}
    </div>
  );
}

function HeroMockup() {
  const products = [
    { name: "Polo Algodón Pima", price: "S/ 59.90", color: "from-sky-200 to-sky-400" },
    { name: "Chompa de Alpaca", price: "S/ 149.00", color: "from-amber-200 to-orange-400" },
    { name: "Taza Artesanal", price: "S/ 25.00", color: "from-emerald-200 to-emerald-400" },
    { name: "Mochila Andina", price: "S/ 89.90", color: "from-rose-200 to-rose-400" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="card overflow-hidden shadow-2xl shadow-brand-900/10">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
          <span className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-xs text-slate-400">samutienda.pe/t/tu-tienda</span>
        </div>
        <div className="bg-gradient-to-r from-brand-600 to-brand-400 px-5 py-6 text-white">
          <div className="text-lg font-bold">Tu Tienda</div>
          <div className="text-sm text-brand-100">Envíos a todo el Perú 🚚</div>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4">
          {products.map((p) => (
            <div key={p.name} className="rounded-xl border border-slate-100 p-2">
              <div className={`aspect-square rounded-lg bg-gradient-to-br ${p.color}`} />
              <div className="mt-2 truncate text-xs font-semibold text-slate-800">{p.name}</div>
              <div className="text-xs font-bold text-brand-600">{p.price}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-6 -left-6 card flex items-center gap-3 px-4 py-3 shadow-xl">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">✅</span>
        <div>
          <div className="text-xs text-slate-500">Nuevo pedido · Yape</div>
          <div className="text-sm font-bold text-slate-900">S/ 208.90</div>
        </div>
      </div>
      <div className="absolute -right-4 -top-5 card px-4 py-3 shadow-xl">
        <div className="text-xs text-slate-500">Ventas del mes</div>
        <div className="text-sm font-bold text-green-600">▲ S/ 4,820</div>
      </div>
    </div>
  );
}
