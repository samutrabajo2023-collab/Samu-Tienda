export const DEPARTAMENTOS = [
  "Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao", "Cusco",
  "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque", "Lima", "Loreto",
  "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali",
];

export const RUBROS = [
  "Moda y accesorios", "Belleza y cuidado personal", "Tecnología", "Hogar y decoración",
  "Alimentos y bebidas", "Mascotas", "Juguetes y bebés", "Deportes", "Librería y oficina",
  "Salud", "Artesanía", "Servicios", "General",
];

export const ORDER_STATUSES = [
  { id: "pendiente", label: "Pendiente de pago", color: "bg-amber-100 text-amber-800" },
  { id: "pagado", label: "Pagado", color: "bg-blue-100 text-blue-800" },
  { id: "enviado", label: "Enviado", color: "bg-indigo-100 text-indigo-800" },
  { id: "entregado", label: "Entregado", color: "bg-green-100 text-green-800" },
  { id: "cancelado", label: "Cancelado", color: "bg-gray-200 text-gray-700" },
];

export const PAYMENT_METHODS: Record<string, string> = {
  yape: "Yape",
  plin: "Plin",
  transferencia: "Transferencia bancaria",
  tarjeta: "Tarjeta de crédito/débito",
  contraentrega: "Pago contraentrega",
};

export function statusInfo(id: string) {
  return ORDER_STATUSES.find((s) => s.id === id) ?? ORDER_STATUSES[0];
}
