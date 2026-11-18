import { readFile } from "fs/promises";
import path from "path";
import { UPLOAD_DIR } from "@/lib/upload";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };

export async function GET(_: Request, { params }: { params: { name: string } }) {
  const name = path.basename(params.name);
  const ext = name.split(".").pop() || "";
  if (!TYPES[ext]) return new Response("No encontrado", { status: 404 });
  try {
    const data = await readFile(path.join(UPLOAD_DIR, name));
    return new Response(data, {
      headers: { "Content-Type": TYPES[ext], "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("No encontrado", { status: 404 });
  }
}
