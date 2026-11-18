import Link from "next/link";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="#1f47f5" />
      <path d="M11 15h18l-1.6 13.2a2 2 0 0 1-2 1.8H14.6a2 2 0 0 1-2-1.8L11 15Z" fill="#fff" />
      <path d="M15.5 15v-1.5a4.5 4.5 0 0 1 9 0V15" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="22" r="3" fill="#ff9f1c" />
    </svg>
  );
}

export function Logo({ href = "/", light = false }: { href?: string; light?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <LogoMark />
      <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
        Samu<span className="text-brand-600">Tienda</span>
      </span>
    </Link>
  );
}
