"use client";

import { useState } from "react";

export function CopyLink({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn-outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.origin + path);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {}
      }}
    >
      {copied ? "¡Copiado!" : "📋 Copiar link"}
    </button>
  );
}
