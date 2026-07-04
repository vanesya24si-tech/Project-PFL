export default function ReportTableHeader() {
  return (
    <thead>
      <tr className="bg-laundry-50">
        <th className="px-8 py-4 text-left text-sm font-bold text-slate-500 uppercase tracking-widest">Tanggal</th>
        <th className="px-8 py-4 text-left text-sm font-bold text-slate-500 uppercase tracking-widest">Jumlah Order</th>
        <th className="px-8 py-4 text-left text-sm font-bold text-slate-500 uppercase tracking-widest">Layanan Terlaris</th>
        <th className="px-8 py-4 text-right text-sm font-bold text-slate-500 uppercase tracking-widest">Total Omzet</th>
      </tr>
    </thead>
  );
}
