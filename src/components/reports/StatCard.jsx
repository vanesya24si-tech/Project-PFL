import TrendBadge from "./TrendBadge";

export default function StatCard({ icon, label, value, trend, trendColor }) {
  const colorClass = trendColor || "text-aqua-bright";

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-laundry-border flex items-center gap-5 relative overflow-hidden group hover:shadow-lg transition-all">
      <div className="p-4 rounded-2xl bg-laundry-100 text-aqua-bright text-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-black text-navy-deep mt-1">{value}</h3>
        <TrendBadge value={trend} colorClass={colorClass} />
      </div>
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-laundry-100 rounded-full opacity-40 group-hover:scale-150 transition-transform" />
    </div>
  );
}
