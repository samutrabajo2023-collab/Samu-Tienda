export function soles(n: number) {
  return "S/ " + n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function waLink(phone: string, text: string) {
  let p = phone.replace(/\D/g, "");
  if (p.length === 9) p = "51" + p;
  return `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
}

export function effectivePrice(p: { price: number; salePrice: number | null }) {
  return p.salePrice != null && p.salePrice > 0 && p.salePrice < p.price ? p.salePrice : p.price;
}
