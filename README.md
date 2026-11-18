# Samu Tienda 🛍️🇵🇪

Plataforma de comercio electrónico para **crear y gestionar tu propia tienda virtual en Perú** de forma fácil, rápida y económica. Inspirada en plataformas como mitienda.pe.

## Funcionalidades

**Sitio público**
- Landing con características, cómo funciona, medios de pago, planes, testimonios y preguntas frecuentes
- Página de precios en soles con tabla comparativa (Gratis, Emprendedor S/ 49, Pyme S/ 99, Pro S/ 199)
- Registro e inicio de sesión

**Panel del vendedor** (`/panel`)
- Creación de tienda con dirección propia (`/t/tu-tienda`)
- Resumen: ventas del mes, pedidos, ticket promedio, gráfico de 14 días, stock bajo
- Productos: alta/edición, ofertas, stock, SKU, imágenes (subida o URL), categorías, destacados, límite por plan
- Pedidos: filtros por estado, búsqueda, detalle, cambio de estado (devuelve el stock al cancelar), contacto por WhatsApp
- Cupones de descuento (% o monto fijo, compra mínima)
- Diseño: nombre, descripción, color de marca, logo y banner
- Configuración: Yape, Plin, transferencia, tarjeta (demo), contraentrega; tarifas de envío Lima/provincias, envío gratis, recojo en tienda; redes sociales; dominio propio; publicar/ocultar tienda
- Cambio de plan (simulado, sin cobro)

**Tienda pública** (`/t/[slug]`)
- Catálogo con buscador, categorías, orden por precio y destacados
- Detalle de producto, carrito persistente, compra rápida
- Checkout con datos del cliente, 25 departamentos del Perú, cupones, cálculo de envío y medio de pago
- Confirmación con instrucciones de pago (Yape/Plin/transferencia) y botón para enviar el pedido por WhatsApp

## Tecnología
Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma · SQLite · autenticación con cookie JWT (jose + bcrypt).

## Instalación

```bash
npm install
cp .env.example .env    # cambia AUTH_SECRET
npm run setup           # crea la base de datos y carga datos demo
npm run dev             # http://localhost:3000
```

Producción: `npm run build && npm start`.

**Cuenta demo:** `demo@samutienda.pe` / `demo123` — tienda demo en `/t/samu-demo`.

## Notas
- Los pagos con tarjeta y los cambios de plan están en **modo demostración**. Para producción, integra las llaves de Culqi, Izipay o Niubiz en `src/app/actions/shop.ts`.
- Las imágenes subidas se guardan en `uploads/` y se sirven desde `/api/files/...`.
- Para producción con varios servidores, cambia SQLite por PostgreSQL en `prisma/schema.prisma`.
