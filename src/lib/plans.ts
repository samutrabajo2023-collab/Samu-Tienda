export type PlanId = "gratis" | "emprendedor" | "pyme" | "pro";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  tagline: string;
  maxProducts: number | null;
  highlight?: boolean;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "gratis",
    name: "Gratis",
    price: 0,
    tagline: "Para empezar a vender hoy",
    maxProducts: 10,
    features: [
      "Hasta 10 productos",
      "Subdominio samutienda.pe/t/tu-tienda",
      "Pedidos por WhatsApp",
      "Pagos con Yape y contraentrega",
      "Panel de pedidos",
    ],
  },
  {
    id: "emprendedor",
    name: "Emprendedor",
    price: 49,
    tagline: "Ideal para emprendimientos en crecimiento",
    maxProducts: 200,
    highlight: true,
    features: [
      "Hasta 200 productos",
      "Yape, Plin, transferencia y tarjetas",
      "Cupones de descuento",
      "Personalización de colores y banner",
      "Reportes de ventas",
      "Soporte por WhatsApp",
    ],
  },
  {
    id: "pyme",
    name: "Pyme",
    price: 99,
    tagline: "Para negocios con catálogo amplio",
    maxProducts: 2000,
    features: [
      "Hasta 2,000 productos",
      "Dominio propio (.pe / .com)",
      "Todo lo del plan Emprendedor",
      "Integración con pasarelas Culqi, Izipay y Niubiz",
      "Envíos a todo el Perú con tarifas por zona",
      "Soporte prioritario",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 199,
    tagline: "Para marcas que venden a gran escala",
    maxProducts: null,
    features: [
      "Productos ilimitados",
      "Todo lo del plan Pyme",
      "Facturación electrónica SUNAT (próximamente)",
      "Múltiples usuarios administradores",
      "Asesor de e-commerce dedicado",
      "API e integraciones a medida",
    ],
  },
];

export function getPlan(id: string): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}
