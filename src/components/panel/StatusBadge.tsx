import { statusInfo } from "@/lib/constants";

export function StatusBadge({ status }: { status: string }) {
  const s = statusInfo(status);
  return <span className={`badge ${s.color}`}>{s.label}</span>;
}
