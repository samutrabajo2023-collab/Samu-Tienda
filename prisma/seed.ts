import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function img(emoji: string, c1: string, c2: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><text x="200" y="245" font-size="150" text-anchor="middle">${emoji}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function banner() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7c2d12"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><rect width="1600" height="500" fill="url(#g)"/><g font-size="120" opacity="0.5"><text x="1000" y="200">🦙</text><text x="1200" y="380">🧶</text><text x="1380" y="180">🏔️</text></g></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

async function main() {
  await prisma.user.deleteMany({ where: { email: "demo@samutienda.pe" } });
  const user = await prisma.user.create({
    data: { name: "Samuel Demo", email: "demo@samutienda.pe", phone: "987654321", password: await bcrypt.hash("demo123", 10) },
  });
  const store = await prisma.store.create({
    data: {
      ownerId: user.id,
      name: "Alpaca Andina",
      slug: "samu-demo",
      category: "Moda y accesorios",
      description: "Prendas y accesorios artesanales hechos por manos peruanas. Fibra de alpaca 100% natural con envíos a todo el Perú.",
      primaryColor: "#c2410c",
      bannerUrl: banner(),
      whatsapp: "987654321",
      email: "ventas@alpacaandina.pe",
      instagram: "@alpaca.andina",
      facebook: "facebook.com/alpacaandina",
      address: "Av. El Sol 123, Cusco",
      plan: "emprendedor",
      payYape: true,
      yapeNumber: "987654321",
      payPlin: true,
      plinNumber: "987654321",
      payTransfer: true,
      bankInfo: "BCP Ahorros Soles: 191-12345678-0-12\nCCI: 002-191-112345678012-55\nTitular: Alpaca Andina SAC",
      payCard: true,
      payCash: true,
      shippingLima: 10,
      shippingProvince: 18,
      freeShippingFrom: 250,
    },
  });
  const [chompas, accesorios, hogar] = await Promise.all(
    ["Chompas y abrigos", "Accesorios", "Hogar"].map((name) => prisma.category.create({ data: { name, storeId: store.id } }))
  );
  const products = [
    { name: "Chompa de Alpaca Clásica", price: 189, salePrice: 159, stock: 12, cat: chompas.id, img: img("🧥", "#fed7aa", "#ea580c"), featured: true, d: "Chompa tejida a mano con fibra de baby alpaca. Suave, abrigadora e hipoalergénica.\nTallas: S, M, L, XL." },
    { name: "Poncho Andino Tradicional", price: 249, stock: 6, cat: chompas.id, img: img("🦙", "#fde68a", "#b45309"), featured: true, d: "Poncho con diseños tradicionales de los Andes, ideal para climas fríos." },
    { name: "Cardigan Tejido Mujer", price: 169, stock: 8, cat: chompas.id, img: img("🧶", "#fecdd3", "#e11d48"), d: "Cardigan liviano de alpaca con botones de tagua." },
    { name: "Chullo Multicolor", price: 45, salePrice: 39, stock: 30, cat: accesorios.id, img: img("🧢", "#bae6fd", "#0284c7"), featured: true, d: "Chullo tradicional con orejeras y pompones. Talla única." },
    { name: "Chalina de Alpaca", price: 69, stock: 25, cat: accesorios.id, img: img("🧣", "#ddd6fe", "#7c3aed"), d: "Chalina suave de 180 cm, disponible en varios colores." },
    { name: "Guantes Tejidos", price: 35, stock: 2, cat: accesorios.id, img: img("🧤", "#bbf7d0", "#16a34a"), d: "Guantes térmicos de alpaca para el invierno." },
    { name: "Manta de Alpaca 150x200", price: 320, stock: 4, cat: hogar.id, img: img("🛏️", "#e7e5e4", "#78716c"), featured: true, d: "Manta tejida en telar artesanal, perfecta para sala o dormitorio." },
    { name: "Cojín Bordado Ayacuchano", price: 55, stock: 15, cat: hogar.id, img: img("🪡", "#fef08a", "#ca8a04"), d: "Funda de cojín con bordados de Ayacucho. 45x45 cm." },
    { name: "Peluche de Alpaca", price: 49, stock: 0, cat: hogar.id, img: img("🧸", "#fbcfe8", "#db2777"), d: "Peluche suave hecho con fibra natural. ¡El regalo perfecto!" },
  ];
  const created = [];
  for (const p of products) {
    created.push(
      await prisma.product.create({
        data: { storeId: store.id, name: p.name, description: p.d, price: p.price, salePrice: p.salePrice ?? null, stock: p.stock, categoryId: p.cat, imageUrl: p.img, featured: !!p.featured },
      })
    );
  }
  await prisma.coupon.create({ data: { storeId: store.id, code: "BIENVENIDO10", type: "porcentaje", value: 10 } });
  await prisma.coupon.create({ data: { storeId: store.id, code: "ENVIOGRATIS", type: "monto", value: 15, minAmount: 100 } });

  const customers = [
    ["María López", "Lima", "Miraflores"], ["Jorge Ramírez", "Arequipa", "Yanahuara"], ["Lucía Torres", "Lima", "San Isidro"],
    ["Pedro Castillo", "Cusco", "Wanchaq"], ["Ana Flores", "La Libertad", "Trujillo"], ["Diego Vargas", "Lima", "Surco"],
    ["Sofía Rojas", "Piura", "Castilla"], ["Carlos Díaz", "Callao", "Bellavista"],
  ];
  const statuses = ["entregado", "entregado", "enviado", "pagado", "pendiente", "pendiente", "entregado", "cancelado"];
  const methods = ["yape", "plin", "tarjeta", "transferencia", "yape", "contraentrega", "yape", "plin"];
  for (let i = 0; i < 18; i++) {
    const c = customers[i % customers.length];
    const picks = [created[i % 8], created[(i * 3 + 1) % 8]].filter((p, idx, arr) => arr.findIndex((x) => x.id === p.id) === idx);
    const items = picks.map((p, k) => ({ productId: p.id, name: p.name, price: p.salePrice ?? p.price, quantity: 1 + ((i + k) % 2) }));
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const shipping = subtotal >= 250 ? 0 : ["Lima", "Callao"].includes(c[1]) ? 10 : 18;
    const createdAt = new Date(Date.now() - (i * 0.8 + Math.random()) * 864e5);
    await prisma.order.create({
      data: {
        code: `SAM${(1001 + i).toString(36).toUpperCase()}`,
        storeId: store.id,
        customerName: c[0],
        customerPhone: `9${String(10000000 + i * 7654321).slice(0, 8)}`,
        department: c[1],
        district: c[2],
        address: `Calle Los Olivos ${100 + i}`,
        paymentMethod: methods[i % methods.length],
        status: statuses[i % statuses.length],
        subtotal,
        shipping,
        total: subtotal + shipping,
        createdAt,
        items: { create: items },
      },
    });
  }
  console.log("✔ Datos de demostración creados. Ingresa con demo@samutienda.pe / demo123 — tienda: /t/samu-demo");
}

main().finally(() => prisma.$disconnect());
