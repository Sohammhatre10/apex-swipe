export default function SkeletonCard() {
  return (
    <div className="glass-panel h-[520px] w-full max-w-md animate-pulse rounded-[24px] p-5">
      <div className="mb-4 h-10 w-2/3 rounded-xl bg-white/10" />
      <div className="h-28 w-full rounded-2xl bg-white/10" />
      <div className="mt-4 h-6 w-full rounded-xl bg-white/10" />
      <div className="mt-2 h-6 w-4/5 rounded-xl bg-white/10" />
    </div>
  );
}
