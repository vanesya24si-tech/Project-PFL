export default function ReportTableFooter({ total }) {
  return (
    <tfoot>
      <tr className="bg-[#E8F8F5]/50">
        <td colSpan="3" className="px-8 py-5 font-bold text-[#0D2D26] text-right uppercase tracking-tighter">
          Total Omzet Periode Ini
        </td>
        <td className="px-8 py-5 text-right font-black text-[#17A589] text-2xl">{total}</td>
      </tr>
    </tfoot>
  );
}
