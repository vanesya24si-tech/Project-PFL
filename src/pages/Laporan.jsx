import { useState } from "react";
import { HiCash, HiShoppingBag, HiTrendingUp, HiSparkles, HiLightBulb, HiUserGroup, HiChartBar } from "react-icons/hi";
import ReportPageWrapper from "../components/reports/ReportPageWrapper";
import ReportPageHeader from "../components/reports/ReportPageHeader";
import PeriodSelect from "../components/reports/PeriodSelect";
import ExportButton from "../components/reports/ExportButton";
import StatsGrid from "../components/reports/StatsGrid";
import StatCard from "../components/reports/StatCard";
import ReportTable from "../components/reports/ReportTable";
import ReportTableHeader from "../components/reports/ReportTableHeader";
import ReportTableRow from "../components/reports/ReportTableRow";
import ReportTableFooter from "../components/reports/ReportTableFooter";
import InsightCard from "../components/reports/InsightCard";

const stats = [
  { label: "Omzet Bruto", value: "Rp 12.840.000", icon: <HiCash size={22} />, trend: "+14.2%", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Volume Produksi", value: "842 Kg", icon: <HiChartBar size={22} />, trend: "+5.4%", color: "text-sky-600", bg: "bg-sky-50" },
  { label: "Retensi Member", value: "88%", icon: <HiUserGroup size={22} />, trend: "+2.1%", color: "text-indigo-600", bg: "bg-indigo-50" },
];

const reportData = [
  { id: 1, date: "15 Mei 2026", orders: 42, revenue: "Rp 1.250.000", favorite: "Cuci Komplit (Aroma Sakura)", status: "Stabil" },
  { id: 2, date: "16 Mei 2026", orders: 58, revenue: "Rp 2.100.000", favorite: "Express 6 Jam", status: "Peak" },
  { id: 3, date: "17 Mei 2026", orders: 35, revenue: "Rp 980.000", favorite: "Cuci Satuan (Bedcover)", status: "Normal" },
  { id: 4, date: "18 Mei 2026", orders: 62, revenue: "Rp 2.450.000", favorite: "Express 6 Jam", status: "Peak" },
  { id: 5, date: "19 Mei 2026", orders: 48, revenue: "Rp 1.520.000", favorite: "Cuci Komplit (Aroma Ocean)", status: "Stabil" },
];

const periodOptions = ["Hari Ini", "7 Hari Terakhir", "Bulan Mei 2026", "Laporan Tahunan"];

export default function Reports() {
  const [period, setPeriod] = useState("Bulan Mei 2026");

  return (
    <ReportPageWrapper>
      <div className="w-full text-[#0F172A] antialiased font-sans space-y-8">
        
        {/* HEADER: Dibuat lebih clean tanpa border bawah hitam */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-10 bg-blue-600 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Executive Summary</span>
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">
              ANALITIK <span className="text-blue-600 italic">BISNIS</span>
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-3 max-w-md leading-relaxed">
              Data performa operasional dan finansial Netto Laundry periode <span className="text-slate-600 font-bold">{period}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <PeriodSelect
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              options={periodOptions}
              className="rounded-2xl text-xs font-bold text-slate-600 border-none bg-white px-5 py-4 shadow-xl shadow-blue-900/5 outline-none cursor-pointer hover:bg-blue-50/50 transition-all"
            />
            <ExportButton 
              onClick={() => {}} 
              label="UNDUH LAPORAN" 
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-6 py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 uppercase tracking-wider"
            />
          </div>
        </div>

        {/* STATS: Tanpa border, fokus ke Shadow dan White Space */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((item) => (
            <div key={item.label} className="bg-white p-7 rounded-[2rem] shadow-xl shadow-blue-900/5 relative overflow-hidden group">
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  {item.icon}
                </div>
                <div className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-lg border border-emerald-100">
                  {item.trend}
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{item.value}</h2>
              {/* Dekorasi halus biar ga sepi */}
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-slate-50 rounded-full opacity-50 group-hover:bg-blue-50 transition-colors" />
            </div>
          ))}
        </div>

        {/* DATA TABLE: Konsep Sheet Putih Bersih */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 overflow-hidden">
          <div className="px-8 py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Rincian Transaksi Harian</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Menampilkan 5 aktivitas volume tertinggi</p>
            </div>
            <div className="flex gap-2">
               <span className="w-3 h-3 rounded-full bg-emerald-400" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status: Berjalan Normal</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tanggal</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Order</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pendapatan</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kategori Terlaris</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reportData.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5 text-xs font-bold text-slate-600">{row.date}</td>
                    <td className="px-8 py-5 text-xs font-black text-slate-800">{row.orders} <span className="text-slate-300 font-medium ml-1">Selesai</span></td>
                    <td className="px-8 py-5 text-xs font-black text-blue-600">{row.revenue}</td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl group-hover:bg-white transition-colors">
                        {row.favorite}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`text-[10px] font-black uppercase ${row.status === 'Peak' ? 'text-orange-500' : 'text-emerald-500'}`}>
                         ● {row.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50/80 px-8 py-6 flex justify-between items-center">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Akumulasi</span>
            <span className="text-xl font-black text-slate-800 tracking-tight">Rp 8.300.000</span>
          </div>
        </div>

        {/* INSIGHT: Lebih informatif & strategis */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0 shadow-inner">
              <HiLightBulb size={40} className="text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h4 className="text-lg font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                REKOMENDASI STRATEGIS <HiSparkles className="text-sky-300" />
              </h4>
              <p className="text-sm font-medium leading-relaxed text-blue-50 opacity-90">
                Layanan <span className="text-white font-black underline decoration-sky-400 underline-offset-4">Express 6 Jam</span> mendominasi pendapatan sebesar 40% di minggu ini. Kami menyarankan untuk mengoptimalkan jadwal shift kurir di jam makan siang guna mempertahankan kecepatan layanan dan kepuasan member.
              </p>
            </div>
          </div>
          {/* Dekorasi Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        </div>

      </div>
    </ReportPageWrapper>
  );
}