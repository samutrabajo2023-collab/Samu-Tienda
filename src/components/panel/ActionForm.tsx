"use client";

import { useFormState } from "react-dom";
import type { FormState } from "@/app/actions/auth";

export function ActionForm({
  action,
  children,
  className = "space-y-5",
  resetOnOk = false,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  children: React.ReactNode;
  className?: string;
  resetOnOk?: boolean;
}) {
  const [state, formAction] = useFormState(action, undefined);
  return (
    <form
      action={formAction}
      className={className}
      key={resetOnOk && state?.ok ? state.ok + Math.random() : undefined}
    >
      {state?.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      {state?.ok && <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">✓ {state.ok}</p>}
      {children}
    </form>
  );
}
