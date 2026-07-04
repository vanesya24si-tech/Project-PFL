import { useState, useEffect, useRef, useMemo } from "react";
import { HiCash, HiShoppingBag, HiTrendingUp, HiSparkles, HiLightBulb, HiUserGroup, HiChartBar } from "react-icons/hi";
import { loadCustomers } from "../utils/customerStorage";
import { getAllOrders } from "../utils/ordersStorage";
import { exportReportToExcel, exportReportToPdf } from "../utils/reportExport";
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

const periodOptions = ["Hari Ini", "7 Hari Terakhir", "Bulan Ini", "Semua Waktu"];

export default function Reports() {
  const [period, setPeriod] = useState("Bulan Ini");
  const reportRef = useRef(null);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchAll() {
      try {
        const [custData, ordersRes] = await Promise.all([
          loadCustomers(),
          getAllOrders(),
        ]);
        if (active) {
          setCustomers(custData || []);
          setOrders(ordersRes.data || []);
        }
      } catch (err) {
        console.error("Gagal memuat data laporan:", err);
      } finally {
        if (active) setLoadingData(false);
      }
    }
    fetchAll();
    return () => { active = false; };
  }, []);

  // Hitung semua stats secara dinamis dari Supabase
  const totalOmzet = useMemo(() => orders.reduce((s, o) => s + (Number(o.price) || 0), 0), [orders]);
  const omzetLabel = useMemo(() => {
    if (totalOmzet >= 1000000) return `Rp ${(totalOmzet / 1000000).toFixed(2)}Jt`;
    return `Rp ${totalOmzet.toLocaleString("id-ID")}`;
  }, [totalOmzet]);

  const stats = useMemo(() => {
    const total = customers.length;
    const aktif = customers.filter((c) => c.status === "Aktif").length;
    const retensiPct = total > 0 ? Math.round((aktif / total) * 100) : 0;
    return [
      { label: "Omzet Bruto", value: loadingData ? "..." : omzetLabel, icon: <HiCash size={22} />, trend: "+14.2%", color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Total Order", value: loadingData ? "..." : orders.length, icon: <HiChartBar size={22} />, trend: "+5.4%", color: "text-sky-600", bg: "bg-sky-50" },
      { label: "Retensi Member", value: loadingData ? "..." : `${retensiPct}%`, icon: <HiUserGroup size={22} />, trend: "+2.1%", color: "text-indigo-600", bg: "bg-indigo-50" },
    ];
  }, [customers, orders, omzetLabel, loadingData]);

  // reportData = 10 order terbaru
  const reportData = useMemo(() => orders.slice(0, 10), [orders]);

  const handleExportPdf = async () => {
    const el = reportRef.current || document.getElementById("crm-report-area");
    if (!el) {
      alert("Area laporan tidak tersedia untuk diekspor.");
      return;
    }

    const filename = `laporan-crm-${period.replace(/\s+/g, "-")}.pdf`;

    try {
      await exportReportToPdf(el, filename);
    } catch (error) {
      console.error(error);
      alert(error.message || "Gagal membuat PDF. Coba lagi setelah halaman dimuat ulang.");
    }
  };

  const handleExportExcel = () => {
    const filename = `laporan-crm-${period.replace(/\s+/g, "-")}.xlsx`;
    exportReportToExcel({
      summary: stats,
      details: reportData.map(o => ({
        id: o.id,
        date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("id-ID") : "-",
        orders: 1,
        revenue: `Rp ${Number(o.price || 0).toLocaleString("id-ID")}`,
        favorite: o.service || "-",
        status: o.status || "-",
      })),
      filename,
      period,
    });
  };

  return (
    <ReportPageWrapper>
      <div id="crm-report-area" ref={reportRef} className="w-full text-[#0F172A] antialiased font-sans space-y-8">
        
        {/* HEADER: Dibuat lebih clean tanpa border bawah hitam */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-10 bg-blue-600 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Executive Summary</span>
            </div>
            <h1 className="text-5xl font-black text-slate-800 tracking-tight leading-none">
              ANALITIK <span className="text-blue-600 italic">BISNIS</span>
            </h1>
            <p className="text-base font-medium text-slate-400 mt-3 max-w-md leading-relaxed">
              Data performa operasional dan finansial Netto Laundry periode <span className="text-slate-600 font-bold">{period}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <PeriodSelect
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              options={periodOptions}
              className="rounded-2xl text-sm font-bold text-slate-600 border-none bg-white px-5 py-4 shadow-xl shadow-blue-900/5 outline-none cursor-pointer hover:bg-blue-50/50 transition-all"
            />
            <div className="flex flex-wrap gap-2">
              <ExportButton onClick={handleExportPdf} label="PDF" />
              <ExportButton onClick={handleExportExcel} label="Excel" />
            </div>
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
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">{item.value}</h2>
              {/* Dekorasi halus biar ga sepi */}
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-slate-50 rounded-full opacity-50 group-hover:bg-blue-50 transition-colors" />
            </div>
          ))}
        </div>

        {/* DATA TABLE: Konsep Sheet Putih Bersih */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 overflow-hidden">
          <div className="px-8 py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50">
            <div>
              <h3 className="text-base font-black text-slate-800 uppercase tracking-widest">Rincian Transaksi Harian</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Menampilkan 5 aktivitas volume tertinggi</p>
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
                {reportData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-bold">
                      {loadingData ? "Memuat data..." : "Belum ada data order."}
                    </td>
                  </tr>
                ) : reportData.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5 text-sm font-bold text-slate-600">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-slate-800">
                      {row.id} <span className="text-slate-300 font-medium ml-1 text-xs">{row.user}</span>
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-blue-600">
                      Rp {Number(row.price || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl group-hover:bg-white transition-colors">
                        {row.service || "-"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-sm font-black uppercase ${
                        row.status === "Bisa Diambil" ? "text-emerald-500" :
                        row.status === "Lagi Dicuci" || row.status === "Tahap Setrika" ? "text-amber-500" : "text-blue-500"
                      }`}>
                        ● {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50/80 px-8 py-6 flex justify-between items-center">
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Akumulasi</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight">{omzetLabel}</span>
          </div>
        </div>

        {/* INSIGHT: Lebih informatif & strategis */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0 shadow-inner">
              <HiLightBulb size={40} className="text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xl font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                REKOMENDASI STRATEGIS <HiSparkles className="text-sky-300" />
              </h4>
              <p className="text-base font-medium leading-relaxed text-blue-50 opacity-90">
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