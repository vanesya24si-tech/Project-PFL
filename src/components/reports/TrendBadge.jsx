export default function TrendBadge({ value, colorClass }) {
  return (
    <span className={`text-sm font-bold flex items-center gap-1 mt-1 ${colorClass}`}>
      {value} <span className="text-slate-400 font-normal">vs bulan lalu</span>
    </span>
  );
}
