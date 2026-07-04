import FavoriteBadge from "./FavoriteBadge";
import ProgressBar from "./ProgressBar";

export default function ReportTableRow({ row }) {
  return (
    <tr className="hover:bg-[#E8F8F5]/30 transition-colors">
      <td className="px-8 py-5 text-[#1A2E35] font-semibold">{row.date}</td>
      <td className="px-8 py-5">
        <div className="flex items-center gap-2">
          <ProgressBar value={row.orders} max={25} />
          <span className="font-bold text-[#1A2E35]">{row.orders}</span>
        </div>
      </td>
      <td className="px-8 py-5">
        <FavoriteBadge label={row.favorite} />
      </td>
      <td className="px-8 py-5 text-right font-black text-[#1A2E35]">{row.revenue}</td>
    </tr>
  );
}
