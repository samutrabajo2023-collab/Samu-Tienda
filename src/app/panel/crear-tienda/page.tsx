import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { CreateStoreForm } from "@/components/panel/CreateStoreForm";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Crea tu tienda" };

export default async function CrearTiendaPage() {
  const user = await requireUser();
  if (await prisma.store.findFirst({ where: { ownerId: user.id } })) redirect("/panel");
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white py-12">
      <div className="container-x max-w-xl">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="card p-8">
          <p className="text-sm font-semibold text-brand-600">Paso final</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">¡Hola {user.name.split(" ")[0]}! Creemos tu tienda</h1>
          <p className="mb-6 mt-1 text-slate-500">Podrás cambiar todo esto después desde tu panel.</p>
          <CreateStoreForm />
        </div>
      </div>
    </div>
  );
}
