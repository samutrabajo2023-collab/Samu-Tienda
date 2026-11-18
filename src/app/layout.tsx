import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Samu Tienda | Crea tu tienda virtual en Perú", template: "%s | Samu Tienda" },
  description:
    "Samu Tienda es la plataforma de comercio electrónico para crear y gestionar tu tienda virtual en Perú de forma fácil, rápida y económica. Acepta Yape, Plin, tarjetas y vende por WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={font.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
