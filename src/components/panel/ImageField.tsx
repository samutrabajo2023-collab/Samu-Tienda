"use client";

import { useState } from "react";

export function ImageField({ label, fileName, urlName, current, aspect = "aspect-square" }: { label: string; fileName: string; urlName: string; current?: string | null; aspect?: string }) {
  const [preview, setPreview] = useState<string | null>(current ?? null);
  const [url, setUrl] = useState(current ?? "");
  return (
    <div>
      <span className="label">{label}</span>
      <div className={`${aspect} mb-3 flex items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50`}>
        {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <span className="text-sm text-slate-400">Sin imagen</span>}
      </div>
      <input
        type="file"
        name={fileName}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setPreview(URL.createObjectURL(f));
        }}
      />
      <p className="my-2 text-center text-xs text-slate-400">o pega una URL de imagen</p>
      <input
        name={urlName}
        value={url}
        onChange={(e) => { setUrl(e.target.value); setPreview(e.target.value || null); }}
        className="input py-2"
        placeholder="https://..."
      />
    </div>
  );
}
