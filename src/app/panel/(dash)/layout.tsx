import { Sidebar } from "@/components/panel/Sidebar";
import { requireStore } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPlan } from "@/lib/plans";
import { logoutAction } from "@/app/actions/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user, store } = await requireStore();
  const pending = await prisma.order.count({ where: { storeId: store.id, status: "pendiente" } });
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar storeName={store.name} slug={store.slug} planName={getPlan(store.plan).name} pending={pending} />
      <div className="min-w-0 flex-1">
        <header className="hidden items-center justify-end gap-4 border-b border-slate-200 bg-white px-8 py-3 lg:flex">
          <span className="text-sm text-slate-500">Hola, <b className="text-slate-800">{user.name.split(" ")[0]}</b></span>
          <form action={logoutAction}><button className="btn-ghost px-3 py-1.5">Cerrar sesión</button></form>
        </header>
        <main className="mx-auto max-w-6xl p-4 sm:p-8">{children}</main>
        <form action={logoutAction} className="p-4 text-center lg:hidden"><button className="btn-ghost">Cerrar sesión</button></form>
      </div>
    </div>
  );
}
