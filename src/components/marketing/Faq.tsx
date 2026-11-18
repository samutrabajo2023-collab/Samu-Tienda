const faqs = [
  ["¿Cuánto cuesta crear una tienda en Samu Tienda?", "Puedes empezar totalmente gratis con hasta 10 productos. Cuando necesites más funciones, eliges un plan desde S/ 49 al mes. No cobramos comisión por tus ventas."],
  ["¿Necesito saber programar o diseñar?", "No. Solo eliges el nombre de tu tienda, subes tu logo y tus productos. Nosotros nos encargamos de la tecnología, la seguridad y el hosting."],
  ["¿Cómo recibo los pagos de mis clientes?", "Tus clientes pueden pagar con Yape, Plin, transferencia bancaria, tarjeta o contraentrega. El dinero llega directamente a tus cuentas."],
  ["¿Puedo usar mi propio dominio?", "Sí. Con los planes Pyme y Pro puedes conectar tu dominio .pe o .com. En el plan gratuito tu tienda tendrá una dirección samutienda.pe/t/tu-tienda."],
  ["¿Puedo enviar pedidos a provincias?", "Claro. Configura una tarifa para Lima y otra para provincias, envío gratis desde cierto monto y la opción de recojo en tienda."],
  ["¿Puedo cambiar de plan o cancelar?", "Sí, puedes subir o bajar de plan en cualquier momento desde tu panel, sin contratos de permanencia."],
];

export function Faq() {
  return (
    <div className="space-y-3">
      {faqs.map(([q, a]) => (
        <details key={q} className="group card p-5 open:shadow-md">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
            {q}
            <span className="text-brand-600 transition group-open:rotate-45">＋</span>
          </summary>
          <p className="mt-3 text-slate-600">{a}</p>
        </details>
      ))}
    </div>
  );
}
