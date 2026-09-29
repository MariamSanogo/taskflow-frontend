export function StatCard({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "danger" | "success" }) {
  const toneClass = tone === "danger" ? "text-danger" : tone === "success" ? "text-success" : "text-text";
  return (
    <div className="flex-1 rounded-xl border border-border bg-white px-4.5 py-4">
      <div className="mb-2 text-[11.5px] font-bold tracking-wide text-text-3">{label}</div>
      <div className={`text-[26px] font-extrabold ${toneClass}`}>{value}</div>
    </div>
  );
}
