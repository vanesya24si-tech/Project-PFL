import React, { useState, useEffect, useMemo } from "react";
import { 
  HiChartPie, 
  HiUsers, 
  HiLightningBolt, 
  HiStar, 
  HiTrendingUp, 
  HiClock, 
  HiUserAdd, 
  HiSparkles,
  HiLightBulb
} from "react-icons/hi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { loadCustomers } from "../utils/customerStorage";

export default function Segmentation() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchCustomers() {
      try {
        const data = await loadCustomers();
        if (active) {
          setCustomers(data || []);
        }
      } catch (err) {
        console.error("Gagal memuat pelanggan di Segmentation:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    fetchCustomers();
    return () => {
      active = false;
    };
  }, []);

  // SEGMENTASI DISESUAIKAN DENGAN STRATEGI PROMOSI OPERASIONAL LAUNDRY
  const segments = useMemo(() => {
    // 1. Pelanggan Loyal (Segment VIP/Loyal atau total transaksi >= 15)
    const loyalCount = customers.filter(
      (c) => c.segment === "Loyal" || c.segment === "VIP" || c.totalTransactions >= 15
    ).length;

    // 2. Pelanggan Aktif (Segment Regular dengan keaktifan Aktif dan total transaksi < 15)
    const activeCount = customers.filter(
      (c) => (c.segment === "Regular" || c.segment === "Regular Customer") && c.status === "Aktif" && c.totalTransactions < 15
    ).length;

    // 3. Pelanggan Baru (Segment New/Baru)
    const newCount = customers.filter(
      (c) => c.segment === "New" || c.segment === "Baru" || c.segment === "New Customer"
    ).length;

    // 4. Jarang Menggunakan (Status Tidak Aktif atau Segment Dormant)
    const dormantCount = customers.filter(
      (c) => c.status === "Tidak Aktif" || c.segment === "Dormant"
    ).length;

    return [
      { 
        name: "Pelanggan Loyal", 
        count: loyalCount, 
        order: "🌟 > 15 Transaksi", 
        color: "#2563EB", 
        icon: <HiStar />, 
        desc: "Karakteristik: Frekuensi tinggi & volume besar. Strategi: Berikan reward poin ganda otomatis & prioritas antrean express." 
      },
      { 
        name: "Pelanggan Aktif", 
        count: activeCount, 
        order: "⚡ 5-14 Transaksi", 
        color: "#06B6D4", 
        icon: <HiLightningBolt />, 
        desc: "Karakteristik: Rutin mencuci mingguan. Strategi: Ajak langganan paket hemat bulanan deposit saldo (Lock-in pelanggan)." 
      },
      { 
        name: "Pelanggan Baru", 
        count: newCount, 
        order: "✨ 1-2 Transaksi", 
        color: "#10B981", 
        icon: <HiUserAdd />, 
        desc: "Karakteristik: Pengguna baru masa trial. Strategi: Kirimkan WhatsApp voucher diskon 20% otomatis untuk order berikutnya." 
      },
      { 
        name: "Jarang Menggunakan", 
        count: dormantCount, 
        order: "💤 > 30 Hari Absen", 
        color: "#64748B", 
        icon: <HiClock />, 
        desc: "Karakteristik: Risiko churn (pindah laundry). Strategi: Kirim promo 'We Miss You' diskon cuci bedcover gratis setrika." 
      },
    ];
  }, [customers]);

  const totalDatabase = useMemo(() => segments.reduce((acc, curr) => acc + curr.count, 0), [segments]);
  const chartData = useMemo(() => segments.map(s => ({ name: s.name, value: s.count })), [segments]);

  return (
    <div className="w-full min-h-screen bg-transparent p-1 md:p-6 text-[#0F172A] antialiased font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-xl shadow-blue-900/5 border border-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-800 italic uppercase flex items-center gap-3">
              <HiChartPie className="text-blue-600 not-italic animate-spin-slow" size={32} /> 
              CUSTOMER <span className="text-blue-600 font-black not-italic">SEGMENTATION</span>
            </h1>
            <p className="text-sm font-bold text-slate-400">
              Pengelompokan karakteristik pelanggan untuk menentukan strategi promosi digital yang tepat sasaran.
            </p>
          </div>
          
          <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:brightness-105 text-white text-sm font-black px-5 py-3.5 rounded-2xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer active:scale-95 shrink-0 uppercase tracking-widest">
            <HiTrendingUp size={16} /> Unduh Basis Data (.CSV)
          </button>
        </div>

        {/* EDU-BOX STRATEGI (Mengutip Konsep Dokumen Anda) */}
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 p-5 rounded-3xl flex items-start gap-4 shadow-inner">
          <div className="p-3 bg-white rounded-2xl text-blue-600 border border-blue-100 shadow-xs shrink-0">
            <HiLightBulb size={22} className="animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              Prinsip Strategi Tepat Sasaran <HiSparkles size={14}/>
            </h4>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Dengan mengelompokkan pelanggan berdasarkan karakteristik keaktifan, kita dapat menghindari pemborosan biaya iklan (burn budget). Promosi dirancang spesifik: menyambut pelanggan baru, mengunci pelanggan aktif, mengapresiasi loyalitas, serta memicu kembali pelanggan yang mulai jarang menggunakan layanan.
            </p>
          </div>
        </div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: ANALYTICS CHART & PROPORTION */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-xl shadow-blue-900/5">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Proporsi Distribusi Segmen</h3>
              <p className="text-sm text-slate-400 mt-0.5 font-medium">Persentase pembagian pangsa pasar operasional kasir.</p>
              
              {/* Donut Chart Canvas */}
              <div className="h-56 w-full relative flex items-center justify-center mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={68}
                      outerRadius={88}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {segments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderRadius: '16px', 
                        border: 'none', 
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Core Info */}
                <div className="absolute text-center pointer-events-none">
                  <span className="text-4xl font-black text-slate-800 tracking-tight italic">{totalDatabase}</span>
                  <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-black mt-0.5">Total User</span>
                </div>
              </div>

              {/* Data Legend Mapping */}
              <div className="mt-4 space-y-2 pt-4 border-t border-slate-100">
                {segments.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-sm p-1 font-bold">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      {s.name}
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-slate-400 font-medium">{s.count} Pelanggan</span>
                      <span className="text-slate-800 font-black w-8">{Math.round((s.count / totalDatabase) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* METRIC OVERVIEW MINI-CARD */}
            <div className="bg-white/80 backdrop-blur-md border border-white p-5 rounded-[2rem] shadow-xl shadow-blue-900/5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pertumbuhan Sistem CRM</p>
                <h4 className="text-xl font-black text-slate-800 tracking-tight">+5 Pelanggan Baru Minggu Ini</h4>
                <p className="text-sm text-slate-400 font-medium font-sans">Mengurangi tingkat churn rate hingga 12% bulan ini.</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs shrink-0">
                <HiUsers size={20} />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTIONABLE STRATEGIC KANBAN */}
          <div className="lg:col-span-7 space-y-4">
            <div className="px-1">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Rekomendasi Kampanye & Eksekusi Otomatis</h3>
              <p className="text-sm text-slate-400 mt-0.5 font-medium">Kirim dorongan notifikasi WhatsApp / Voucher Blast berdasarkan target personal.</p>
            </div>

            <div className="space-y-3">
              {segments.map((s) => (
                <div 
                  key={s.name} 
                  className="group bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Dynamic Segment Colored Icon Wrapper */}
                    <div 
                      className="w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center text-xl text-white shadow-md transition-transform group-hover:scale-105" 
                      style={{ backgroundColor: s.color }}
                    >
                      {s.icon}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">{s.name}</h4>
                        <span className="bg-slate-50 text-slate-500 text-[9px] px-2 py-0.5 rounded-md font-black border border-slate-100 uppercase tracking-wider">
                          {s.order}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-md">{s.desc}</p>
                    </div>
                  </div>

                  {/* Quantitative Statistics & Action Trigger */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t border-slate-50 sm:border-0">
                    <div className="text-left sm:text-right sm:px-4 font-bold">
                      <span className="block text-xl font-black text-slate-800 leading-none">{s.count}</span>
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">User</span>
                    </div>
                    
                    <button 
                      className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200/60 text-slate-400 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-sky-500 group-hover:text-white group-hover:border-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all cursor-pointer active:scale-95" 
                      title="Kirim Otomatisasi Strategi Promosi"
                    >
                      <HiLightningBolt size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SYSTEM FOOTER DISCLAIMER */}
            <div className="p-4 bg-white/50 border border-dashed border-slate-200 rounded-2xl text-center">
              <p className="text-slate-400 text-[10px] font-black italic tracking-wide">
                *Sistem CRM menyinkronkan data di atas secara berkala setiap jam dari riwayat timbangan kasir utama.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}