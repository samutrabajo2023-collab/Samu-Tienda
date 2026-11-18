import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Guarda una imagen subida y devuelve su URL pública, o null si no hay archivo válido. */
export async function saveImage(value: FormDataEntryValue | null): Promise<string | null> {
  if (!value || typeof value === "string" || value.size === 0) return null;
  const ext = ALLOWED[value.type];
  if (!ext) throw new Error("Formato de imagen no permitido (usa JPG, PNG, WEBP o GIF).");
  if (value.size > 4 * 1024 * 1024) throw new Error("La imagen no debe superar 4 MB.");
  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await value.arrayBuffer()));
  return `/api/files/${name}`;
}

/** Usa la imagen subida si existe, si no la URL escrita, si no el valor actual. */
export async function resolveImage(form: FormData, fileField: string, urlField: string, current: string | null) {
  const uploaded = await saveImage(form.get(fileField));
  if (uploaded) return uploaded;
  const url = String(form.get(urlField) ?? "").trim();
  if (form.has(urlField)) return url || null;
  return current;
}
