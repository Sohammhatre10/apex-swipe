export default function MetricBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs text-slate-200">
      <span className="text-slate-400">{label}</span>
      <span className="mono ml-1">{value}</span>
    </div>
  );
}
