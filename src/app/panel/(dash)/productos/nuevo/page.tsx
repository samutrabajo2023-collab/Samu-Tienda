import { requireStore } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/panel/PageHeader";
import { ProductForm } from "@/components/panel/ProductForm";

export const metadata = { title: "Nuevo producto" };

export default async function NuevoProductoPage() {
  const { store } = await requireStore();
  const categories = await prisma.category.findMany({ where: { storeId: store.id }, orderBy: { name: "asc" } });
  return (
    <>
      <PageHeader title="Nuevo producto" subtitle="Completa la información y publícalo en tu tienda." />
      <ProductForm categories={categories} />
    </>
  );
}
