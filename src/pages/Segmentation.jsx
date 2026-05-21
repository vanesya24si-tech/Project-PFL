import React from "react";
import { HiChartPie, HiUsers, HiLightningBolt, HiFire, HiStar, HiTrendingUp } from "react-icons/hi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Segmentation() {
  const segments = [
    { name: "Pelanggan Loyal", count: 12, order: "30+ Order", color: "#10B981", icon: <HiStar />, desc: "Berikan reward poin ganda otomatis" },
    { name: "Pelanggan Reguler", count: 45, order: "5-10 Order", color: "#3B82F6", icon: <HiLightningBolt />, desc: "Ajak langganan paket hemat bulanan" },
    { name: "Pelanggan Baru", count: 28, order: "1-2 Order", color: "#64748B", icon: <HiFire />, desc: "Kirimkan voucher diskon selamat datang 20%" },
  ];

  const totalDatabase = 85;
  const chartData = segments.map(s => ({ name: s.name, value: s.count }));

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-900 antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
              <HiChartPie className="text-emerald-600" size={28} /> Segmentasi Pelanggan
            </h1>
            <p className="text-sm text-slate-500 mt-1">Analisis perilaku demografis dan konversi strategi promosi tepat sasaran.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <HiTrendingUp className="text-slate-500" size={18} /> Unduh Laporan (.CSV)
          </button>
        </div>

        {/* Dashboard Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Analytics Chart & Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Proporsi Distribusi Segmen</h3>
              <p className="text-xs text-slate-400 mb-6">Persentase pembagian data market share pelanggan saat ini.</p>
              
              <div className="h-56 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={65}
                      outerRadius={85}
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
                        borderRadius: '8px', 
                        border: 'none', 
                        color: '#fff',
                        fontSize: '12px' 
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Badge Indicator */}
                <div className="absolute text-center pointer-events-none">
                  <span className="text-2xl font-bold text-slate-900">{totalDatabase}</span>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total User</span>
                </div>
              </div>

              <div className="mt-6 space-y-2.5 pt-4 border-t border-slate-100">
                {segments.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs p-1">
                    <div className="flex items-center gap-2.5 font-medium text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      {s.name}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-normal">{s.count} Mitra</span>
                      <span className="text-slate-900 font-semibold w-8 text-right">{Math.round((s.count / totalDatabase) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metric Overview Mini-Card */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pertumbuhan Akun</p>
                <h4 className="text-2xl font-bold text-slate-900">+5 Pelanggan Baru</h4>
                <p className="text-xs text-slate-500">Terdaftar masuk dalam sistem minggu ini.</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
                <HiUsers size={22} />
              </div>
            </div>
          </div>

          {/* Right Column: Execution Action Strategies */}
          <div className="lg:col-span-7 space-y-4">
            <div className="px-1">
              <h3 className="text-sm font-semibold text-slate-900">Rekomendasi Strategi & Otomatisasi Kampanye</h3>
              <p className="text-xs text-slate-400 mt-0.5">Eksekusi taktik promosi langsung berdasarkan aktivitas log transaksi.</p>
            </div>

            <div className="space-y-3">
              {segments.map((s) => (
                <div key={s.name} className="group bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Icon Container with subtle borders instead of harsh shadows */}
                    <div className="w-11 h-11 shrink-0 rounded-lg flex items-center justify-center text-lg text-white" style={{ backgroundColor: s.color }}>
                      {s.icon}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                        <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-medium tracking-wide border border-slate-200/30">{s.order}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>

                  {/* Quantitative Metric Badge */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0">
                    <div className="text-left sm:text-right sm:px-4">
                      <span className="block text-base font-bold text-slate-900">{s.count}</span>
                      <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">User</span>
                    </div>
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-colors" title="Eksekusi Campaign">
                      <HiLightningBolt size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer System Disclaimer */}
            <div className="p-4 bg-slate-100/70 border border-slate-200/50 rounded-xl text-center">
              <p className="text-slate-400 text-[11px] font-medium italic">
                *Algoritma pengelompokan (clustering) diperbarui secara real-time berdasarkan akumulasi aktivitas log transaksi 30 hari terakhir.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}