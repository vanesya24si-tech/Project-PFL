import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  HiChartPie, HiUsers, HiLightningBolt, HiFire, HiStar, 
  HiTrendingUp, HiSearch, HiFilter 
} from "react-icons/hi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import customers from "../data/customers.json";

export default function Member() {
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.status.toLowerCase().includes(search.toLowerCase()) ||
    c.lastOrder.toLowerCase().includes(search.toLowerCase())
  );

  const segments = [
    { name: "Pelanggan Loyal", count: 12, order: "30+ Order", color: "#1ABC9C", icon: <HiStar />, desc: "Berikan reward poin ganda" },
    { name: "Pelanggan Reguler", count: 45, order: "5-10 Order", color: "#3498DB", icon: <HiLightningBolt />, desc: "Ajak langganan paket bulanan" },
    { name: "Pelanggan Baru", count: 28, order: "1-2 Order", color: "#94A3B8", icon: <HiFire />, desc: "Kirimkan voucher diskon 20%" },
  ];

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
        <div className="flex gap-3">
            <button className="bg-white border-2 border-slate-200 p-2.5 rounded-2xl text-slate-500 hover:bg-slate-50 shadow-sm transition-all">
                <HiFilter size={20} />
            </button>
            <button className="bg-[#1ABC9C] px-6 py-2.5 rounded-2xl font-bold text-white hover:bg-[#16A085] transition-all flex items-center gap-2 shadow-lg shadow-[#1ABC9C]/30">
                <HiTrendingUp /> Unduh Laporan
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* KOLOM KIRI: GRAFIK & STATS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
             <h2 className="text-lg font-black text-slate-800 mb-6">Proporsi Segmen</h2>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                      {segments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={10} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
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
        </div>

        {/* KOLOM KANAN: TABEL DATA DUMMY */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-black text-slate-800">Daftar Pelanggan Terbaru</h3>
                <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Cari pelanggan..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1ABC9C] outline-none"
                    />
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Pelanggan</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-center">Total Order</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredCustomers.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#1ABC9C]/10 text-[#1ABC9C] flex items-center justify-center font-black text-xs">
                                            {c.avatar}
                                        </div>
                                        <div>
                                            <Link to={`/members/${c.id}`} className="text-sm font-bold text-slate-800 hover:text-[#1ABC9C]">
                                              {c.name}
                                            </Link>
                                            <p className="text-[10px] text-slate-400 font-medium">Terakhir: {c.lastOrder}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase ${
                                        c.status === 'Loyal' ? 'bg-[#1ABC9C]/10 text-[#1ABC9C]' : 
                                        c.status === 'Reguler' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <p className="text-sm font-black text-slate-700">{c.orders}</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link to={`/members/${c.id}`} className="text-slate-400 hover:text-[#1ABC9C] font-bold text-xs">
                                      Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          {/* Tips Strategi Cepat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-blue-500 rounded-[2rem] text-white">
                <HiLightningBolt className="text-2xl mb-2" />
                <h4 className="font-black">Promo Terjadwal</h4>
                <p className="text-xs opacity-80 mt-1">Kirim broadcast otomatis ke segmen Reguler setiap hari Jumat.</p>
            </div>
            <div className="p-6 bg-slate-800 rounded-[2rem] text-white">
                <HiFire className="text-2xl mb-2 text-orange-400" />
                <h4 className="font-black">Retensi Baru</h4>
                <p className="text-xs opacity-80 mt-1">Gunakan diskon 10% untuk pelanggan yang baru 1x order.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}