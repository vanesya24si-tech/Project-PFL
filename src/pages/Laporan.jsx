import { useState } from "react";
import { 
  HiDocumentReport, 
  HiTrendingUp, 
  HiCash, 
  HiShoppingBag, 
  HiDownload,
  HiFilter
} from "react-icons/hi";

// Konstanta Warna Terpadu
const COLORS = {
  primary: "#17A589",       // Teal Utama
  primaryDark: "#0D2D26",   // Teal Gelap
  primaryLight: "#E8F8F5",  // Hijau Muda
  textMain: "#1A2E35",      // Navy Gelap
  textMuted: "#7F9E97",     // Abu Hijau
};

export default function Reports() {
  const [period, setPeriod] = useState("Bulan Ini");

  // Data Dummy Statistik (Diselaraskan warnanya)
  const stats = [
    { label: "Total Pendapatan", value: "Rp 8.450.000", icon: <HiCash />, trend: "+12.5%", color: "teal" },
    { label: "Order Selesai", value: "142", icon: <HiShoppingBag />, trend: "+8%", color: "emerald" },
    { label: "Member Baru", value: "24", icon: <HiTrendingUp />, trend: "+18%", color: "cyan" },
  ];

  const reportData = [
    { id: 1, date: "01 Mei 2026", orders: 12, revenue: "Rp 450.000", favorite: "Cuci Komplit" },
    { id: 2, date: "02 Mei 2026", orders: 15, revenue: "Rp 620.000", favorite: "Express" },
    { id: 3, date: "03 Mei 2026", orders: 10, revenue: "Rp 380.000", favorite: "Cuci Komplit" },
    { id: 4, date: "04 Mei 2026", orders: 22, revenue: "Rp 940.000", favorite: "Setrika" },
    { id: 5, date: "05 Mei 2026", orders: 18, revenue: "Rp 710.000", favorite: "Cuci Komplit" },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F3] p-6 font-sans text-[#1A2E35]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER & EXPORT */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A2E35] flex items-center gap-2">
              <HiDocumentReport className="text-[#17A589]" />
              Laporan Analitik
            </h1>
            <p className="text-[#7F9E97] text-sm mt-1">Pantau performa bisnis Netto Laundry Anda</p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="appearance-none bg-white border border-[#E0EEEA] pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-[#1A2E35] focus:outline-none focus:ring-4 focus:ring-[#E8F8F5] transition-all cursor-pointer"
              >
                <option>Hari Ini</option>
                <option>Minggu Ini</option>
                <option>Bulan Ini</option>
                <option>Tahun Ini</option>
              </select>
              <HiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7F9E97] pointer-events-none" />
            </div>
            
            <button className="flex items-center gap-2 bg-[#0D2D26] hover:bg-[#1A2E35] text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-[#0D2D26]/20">
              <HiDownload />
              Export PDF
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#E0EEEA] flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="p-4 rounded-2xl bg-[#E8F8F5] text-[#17A589] text-2xl group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <p className="text-[#7F9E97] text-xs font-bold uppercase tracking-wider">{item.label}</p>
                <h3 className="text-2xl font-black text-[#1A2E35] mt-1">{item.value}</h3>
                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1 mt-1">
                  {item.trend} <span className="text-[#7F9E97] font-normal">vs bulan lalu</span>
                </span>
              </div>
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#E8F8F5] rounded-full opacity-40 group-hover:scale-150 transition-transform" />
            </div>
          ))}
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/30 border border-[#E0EEEA] overflow-hidden">
          <div className="p-7 border-b border-[#F0F4F3] flex justify-between items-center">
            <h3 className="font-bold text-[#1A2E35] text-lg">Ringkasan Harian</h3>
            <span className="text-xs font-bold text-[#17A589] bg-[#E8F8F5] px-3 py-1 rounded-full uppercase tracking-wider">Mei 2026</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F0F4F3]/50">
                  <th className="px-8 py-4 text-left text-xs font-bold text-[#7F9E97] uppercase tracking-widest">Tanggal</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-[#7F9E97] uppercase tracking-widest">Jumlah Order</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-[#7F9E97] uppercase tracking-widest">Layanan Terlaris</th>
                  <th className="px-8 py-4 text-right text-xs font-bold text-[#7F9E97] uppercase tracking-widest">Total Omzet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F3]">
                {reportData.map((row) => (
                  <tr key={row.id} className="hover:bg-[#E8F8F5]/30 transition-colors">
                    <td className="px-8 py-5 text-[#1A2E35] font-semibold">{row.date}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className="w-12 h-2 bg-[#E0EEEA] rounded-full overflow-hidden">
                          <div className="bg-[#17A589] h-full rounded-full" style={{ width: `${(row.orders/25)*100}%` }} />
                        </span>
                        <span className="font-bold text-[#1A2E35]">{row.orders}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold py-1 px-3 bg-[#E8F8F5] text-[#17A589] rounded-lg border border-[#A3DDD0]">
                        {row.favorite}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-[#1A2E35]">
                      {row.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#E8F8F5]/50">
                  <td colSpan="3" className="px-8 py-5 font-bold text-[#0D2D26] text-right uppercase tracking-tighter">Total Omzet Periode Ini</td>
                  <td className="px-8 py-5 text-right font-black text-[#17A589] text-xl">Rp 3.100.000</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* INSIGHT CARD (Tema Teal Gelap) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#A3DDD0] flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="w-24 h-24 bg-[#17A589] rounded-3xl rotate-6 flex items-center justify-center text-white text-4xl shadow-xl shadow-[#17A589]/20 shrink-0">
            💡
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#1A2E35]">Insight Bisnis Minggu Ini</h4>
            <p className="text-[#7F9E97] mt-2 leading-relaxed">
              Layanan <span className="font-bold text-[#17A589]">Cuci Komplit</span> mengalami kenaikan permintaan sebesar 20%. 
              Pertimbangkan untuk menambah stok deterjen dan pewangi di gudang untuk mengantisipasi lonjakan di akhir pekan.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}