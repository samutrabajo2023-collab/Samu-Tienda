"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { loginAction, registerAction } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useFormState(loginAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next || "/panel"} />
      {state?.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      <div>
        <label className="label" htmlFor="email">Correo electrónico</label>
        <input id="email" name="email" type="email" required className="input" placeholder="tucorreo@gmail.com" />
      </div>
      <div>
        <label className="label" htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" required className="input" placeholder="••••••••" />
      </div>
      <SubmitButton className="btn-primary w-full py-3" pendingText="Ingresando...">Ingresar</SubmitButton>
      <p className="text-center text-sm text-slate-500">
        ¿No tienes cuenta? <Link href="/registro" className="font-semibold text-brand-600">Crea tu tienda gratis</Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [state, action] = useFormState(registerAction, undefined);
  return (
    <form action={action} className="space-y-4">
      {state?.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      <div>
        <label className="label" htmlFor="name">Nombre completo</label>
        <input id="name" name="name" required className="input" placeholder="Ej. Samuel Pérez" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="email">Correo electrónico</label>
          <input id="email" name="email" type="email" required className="input" placeholder="tucorreo@gmail.com" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Celular (opcional)</label>
          <input id="phone" name="phone" className="input" placeholder="987 654 321" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" required minLength={6} className="input" placeholder="Mínimo 6 caracteres" />
      </div>
      <SubmitButton className="btn-primary w-full py-3" pendingText="Creando cuenta...">Crear mi cuenta gratis</SubmitButton>
      <p className="text-center text-xs text-slate-500">Al registrarte aceptas los Términos y la Política de privacidad.</p>
      <p className="text-center text-sm text-slate-500">
        ¿Ya tienes cuenta? <Link href="/login" className="font-semibold text-brand-600">Ingresa aquí</Link>
      </p>
    </form>
  );
}
