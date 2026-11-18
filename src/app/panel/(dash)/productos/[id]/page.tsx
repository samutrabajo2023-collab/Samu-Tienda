import { notFound } from "next/navigation";
import { requireStore } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/panel/PageHeader";
import { ProductForm } from "@/components/panel/ProductForm";

export const metadata = { title: "Editar producto" };

export default async function EditarProductoPage({ params }: { params: { id: string } }) {
  const { store } = await requireStore();
  const [product, categories] = await Promise.all([
    prisma.product.findFirst({ where: { id: params.id, storeId: store.id } }),
    prisma.category.findMany({ where: { storeId: store.id }, orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();
  return (
    <>
      <PageHeader title="Editar producto" subtitle={product.name} actions={<a href={`/t/${store.slug}/p/${product.id}`} target="_blank" className="btn-outline">Ver en tienda ↗</a>} />
      <ProductForm product={product} categories={categories} />
    </>
  );
}
