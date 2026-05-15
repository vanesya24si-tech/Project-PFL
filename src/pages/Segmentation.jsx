import { HiChartPie, HiUsers, HiLightningBolt, HiFire, HiStar, HiTrendingUp } from "react-icons/hi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function Segmentation() {
  const segments = [
    { name: "Pelanggan Loyal", count: 12, order: "30+ Order", color: "#1ABC9C", icon: <HiStar />, desc: "Berikan reward poin ganda" },
    { name: "Pelanggan Reguler", count: 45, order: "5-10 Order", color: "#3498DB", icon: <HiLightningBolt />, desc: "Ajak langganan paket bulanan" },
    { name: "Pelanggan Baru", count: 28, order: "1-2 Order", color: "#94A3B8", icon: <HiFire />, desc: "Kirimkan voucher diskon 20%" },
  ];

  // Data untuk Grafik Lingkaran
  const chartData = segments.map(s => ({ name: s.name, value: s.count }));

  return (
    <div className="p-8 bg-[#F8FAFB] min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <HiChartPie className="text-[#1ABC9C]" /> Segmentasi Pelanggan
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Analisis perilaku dan strategi promosi tepat sasaran.</p>
        </div>
        <button className="bg-white border-2 border-slate-200 px-6 py-2.5 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
          <HiTrendingUp className="text-[#1ABC9C]" /> Unduh Laporan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Ringkasan & Grafik */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
             <h2 className="text-lg font-black text-slate-800 mb-6">Proporsi Segmen</h2>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {segments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={10} />
                      ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="mt-4 space-y-3">
                {segments.map((s) => (
                    <div key={s.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></span>
                            {s.name}
                        </div>
                        <span className="text-slate-800 font-black">{Math.round((s.count / 85) * 100)}%</span>
                    </div>
                ))}
             </div>
          </div>

          <div className="bg-gradient-to-br from-[#1ABC9C] to-[#16A085] p-6 rounded-[2rem] text-white shadow-lg shadow-[#1ABC9C]/20">
             <p className="text-white/80 text-sm font-bold uppercase tracking-wider">Total Database</p>
             <h2 className="text-4xl font-black mt-1">85 <span className="text-lg font-medium opacity-80">Mitra</span></h2>
             <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2 text-sm font-medium">
                <HiUsers className="text-white/60" /> +5 Pelanggan baru minggu ini
             </div>
          </div>
        </div>

        {/* Kolom Kanan: Card Detail & Strategi */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-lg font-black text-slate-800 mb-2 px-2">Rekomendasi Strategi</h2>
          {segments.map((s) => (
            <div key={s.name} className="group bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:border-[#1ABC9C] hover:shadow-md transition-all duration-300">
              <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg`} style={{ backgroundColor: s.color }}>
                {s.icon}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                    <h3 className="text-xl font-black text-slate-800">{s.name}</h3>
                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">{s.order}</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">{s.desc}</p>
              </div>

              <div className="text-center md:text-right px-6 border-l border-slate-50 hidden md:block">
                <h4 className="text-2xl font-black text-slate-800">{s.count}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Pelanggan</p>
              </div>

              <button className="bg-slate-50 group-hover:bg-[#1ABC9C] group-hover:text-white p-3 rounded-2xl transition-colors">
                <HiLightningBolt />
              </button>
            </div>
          ))}

          <div className="mt-8 p-6 bg-slate-100/50 rounded-3xl border border-dashed border-slate-300 text-center">
            <p className="text-slate-500 text-xs font-bold italic">
              *Algoritma segmentasi diperbarui secara otomatis berdasarkan aktivitas transaksi 30 hari terakhir.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}