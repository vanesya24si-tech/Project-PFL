import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, ComposedChart, Bar, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
  MdPeople,
  MdShoppingCart,
  MdAttachMoney,
  MdLocalLaundryService,
  MdSearch,
  MdNotificationsActive,
  MdOutlineTimer,
  MdArrowForward,
  MdDeleteOutline,
  MdEdit,
  MdAdd,
  MdStar,
} from "react-icons/md";

// Data Grafik Bulanan Fluktuatif
const chartData = [
  { name: "Jan", weight: 780, revenue: 16000000 },
  { name: "Feb", weight: 920, revenue: 18500000 },
  { name: "Mar", weight: 1080, revenue: 21000000 },
  { name: "Apr", weight: 1250, revenue: 24800000 },
  { name: "May", weight: 1480, revenue: 29800000 },
  { name: "Jun", weight: 1750, revenue: 34500000 },
  { name: "Jul", weight: 1620, revenue: 31000000 },
  { name: "Aug", weight: 1890, revenue: 37200000 },
  { name: "Sep", weight: 2100, revenue: 41000000 },
  { name: "Oct", weight: 2350, revenue: 46800000 },
  { name: "Nov", weight: 2200, revenue: 43500000 },
  { name: "Dec", weight: 2800, revenue: 58000000 },
];

// Riwayat Transaksi Kasir
const transactionHistory = [
  { id: "TRX-1023", customer: "Budi Santoso", date: "18 Mei 2026", service: "Wash & Fold", weight: 12, total: 144000, status: "Selesai" },
  { id: "TRX-1024", customer: "Siti Aminah", date: "18 Mei 2026", service: "Setrika Saja", weight: 5, total: 75000, status: "Diproses" },
  { id: "TRX-1025", customer: "Rian Hidayat", date: "17 Mei 2026", service: "Cuci Kering", weight: 7, total: 105000, status: "Siap Ambil" },
  { id: "TRX-1026", customer: "Dewi Lestari", date: "16 Mei 2026", service: "Dry Cleaning", weight: 3, total: 225000, status: "Selesai" },
  { id: "TRX-1027", customer: "Eko Prasetyo", date: "15 Mei 2026", service: "Express Wash", weight: 10, total: 200000, status: "Diterima" },
  { id: "TRX-1028", customer: "Amalia Putri", date: "15 Mei 2026", service: "Bedcover Jumbo", weight: 8, total: 120000, status: "Siap Ambil" },
  { id: "TRX-1029", customer: "Hendra Wijaya", date: "14 Mei 2026", service: "Wash & Fold", weight: 15, total: 180000, status: "Selesai" },
  { id: "TRX-1030", customer: "Farhan Malik", date: "14 Mei 2026", service: "Cuci Sepatu Premium", weight: 2, total: 90000, status: "Diproses" },
];

const segments = [
  { label: "Loyal", value: 48, color: "#0EA5E9" },
  { label: "Reguler", value: 32, color: "#06B6D4" },
  { label: "Baru", value: 15, color: "#0891B2" },
  { label: "Tidak Aktif", value: 11, color: "#0369A1" },
];

const notificationTemplates = [
  { label: "Cucian Selesai", message: "Halo {name}, cucian Anda sudah selesai dan dikemas rapi. Silakan ambil di outlet Netto Laundry." },
  { label: "Sedang Diproses", message: "Hai {name}, pakaian Anda saat ini memasuki siklus cuci & higienitas. Estimasi selesai dalam 2 jam." },
  { label: "Pengingat Ambil", message: "Yuk ambil cucian Anda hari ini agar loker kami tetap muat dan pakaian Anda tetap wangi maksimal!" },
  { label: "Promo Weekend", message: "Khusus {name}! Dapatkan diskon 15% cuci kiloan minimal 6Kg hanya berlaku sabtu-minggu ini." },
];

const feedbackList = [
  { id: 1, name: "Budi Santoso", rating: 4.8, comment: "Layanan cepat dan hasil cuci sangat bersih." },
  { id: 2, name: "Siti Aminah", rating: 4.5, comment: "Pakaian rapi dan pewangi lembut. Puas." },
  { id: 3, name: "Dewi Lestari", rating: 4.9, comment: "Pelayanan ramah, kasirnya cekatan rekomendasi!" },
  { id: 4, name: "Hendra Wijaya", rating: 3.8, comment: "Hasil setrika bagus, tapi antrean kasir pas jam pulang kerja agak panjang." },
  { id: 5, name: "Rian Hidayat", rating: 5.0, comment: "Sangat direkomendasikan untuk cuci express jas formal!" },
];

function KpiCard({ icon: Icon, value, label, delta }) {
  return (
    <div className="bg-white rounded-3xl border border-blue-50/50 p-6 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-xs border border-blue-100/20">
          <Icon size={22} />
        </div>
      </div>
      {delta !== undefined && (
        <div className="mt-4 flex items-center gap-1.5">
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${delta >= 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}>
            {delta >= 0 ? "+" : ""}{delta}%
          </span>
          <span className="text-[11px] font-medium text-slate-400">vs minggu lalu</span>
        </div>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-3 shadow-xl border border-slate-800 text-xs font-sans">
      <p className="text-slate-400 mb-1 font-bold">{label}</p>
      <p className="font-black text-blue-400">{prefix}{payload[0].value.toLocaleString("id-ID")}</p>
    </div>
  );
}

export default function NettoLaundryDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod] = useState("30D");

  const [customers, setCustomers] = useState([
    { id: 1, name: "Budi Santoso", phone: "081234567890", status: "Loyal", lastOrder: "18 Mei 2026" },
    { id: 2, name: "Siti Aminah", phone: "085712345678", status: "Reguler", lastOrder: "18 Mei 2026" },
    { id: 3, name: "Rian Hidayat", phone: "081987654321", status: "Baru", lastOrder: "17 Mei 2026" },
    { id: 4, name: "Dewi Lestari", phone: "082155443322", status: "Loyal", lastOrder: "16 Mei 2026" },
    { id: 5, name: "Eko Prasetyo", phone: "081399887766", status: "Reguler", lastOrder: "15 Mei 2026" },
    { id: 6, name: "Amalia Putri", phone: "087811223344", status: "Baru", lastOrder: "15 Mei 2026" },
    { id: 7, name: "Hendra Wijaya", phone: "085299001122", status: "Loyal", lastOrder: "14 Mei 2026" },
    { id: 8, name: "Farhan Malik", phone: "089644556677", status: "Reguler", lastOrder: "14 Mei 2026" },
  ]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const query = searchTerm.toLowerCase();
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query)
      );
    });
  }, [customers, searchTerm]);

  const inactiveCustomers = useMemo(() => {
    return customers.filter((customer) => customer.status === "Reguler" || customer.status === "Baru");
  }, [customers]);

  const averageRating = useMemo(() => {
    if (!feedbackList.length) return 0;
    return (feedbackList.reduce((sum, item) => sum + item.rating, 0) / feedbackList.length).toFixed(1);
  }, []);

  const periodLabel = selectedPeriod === "7D" ? "7 Hari" : selectedPeriod === "30D" ? "30 Hari" : "90 Hari";

  const handleRemoveCustomer = (id) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  return (
    <div className="w-full min-h-screen bg-transparent p-1 md:p-6 text-[#0F172A] antialiased font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Action */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
          <div className="space-y-0.5">
            <h1 className="text-3xl font-black tracking-tight text-slate-800 italic">
              LIVE <span className="text-blue-600 font-black not-italic">ANALYTICS</span>
            </h1>
            <p className="text-xs font-bold text-slate-400">
              Pantau dinamika operasional, performa omzet keuangan, dan grafik CRM secara real-time.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => navigate("/orders/add")} 
              className="inline-flex items-center gap-2 rounded-2xl border border-blue-100 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow-xs hover:bg-blue-50/50 hover:text-blue-600 transition-all cursor-pointer active:scale-95"
            >
              <MdShoppingCart size={16} className="text-blue-500" /> TAMBAH TRANSAKSI
            </button>
            <button 
              onClick={() => navigate("/members/add")} 
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-blue-100 hover:bg-blue-700 transition-all cursor-pointer active:scale-95"
            >
              <MdAdd size={16} /> TAMBAH PELANGGAN
            </button>
          </div>
        </header>

        {/* High-Level KPI Widgets */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={MdPeople} value={customers.length} label="Total Pelanggan" delta={12} />
          <KpiCard icon={MdLocalLaundryService} value={transactionHistory.length} label="Volume Transaksi" delta={8} />
          <KpiCard icon={MdAttachMoney} value="Rp 46.8M" label="Omzet Bulan Ini" delta={14} />
          <KpiCard icon={MdNotificationsActive} value="12" label="Antrean WA Blast" delta={5} />
        </section>

        {/* Analytics Layer */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue Area Chart */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Proyeksi Arus Kas & Pendapatan</h3>
                <p className="text-xs text-slate-400 mt-0.5">Statistik grafik akumulasi omzet pendapatan kotor riil bulanan.</p>
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">{periodLabel} Terakhir</span>
            </div>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }} />
                <Tooltip content={<CustomTooltip prefix="Rp " />} />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#revenueGrad)" />
              </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Load Capacity Mixed Chart */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Metrik Tonase Laundry</h3>
                <p className="text-xs text-slate-400 mt-0.5">Perbandingan rasio berat total cucian masuk (Kg).</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                <MdOutlineTimer size={14} /> LIVE
              </div>
            </div>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={chartData} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="weight" fill="#DBEAFE" radius={[4, 4, 0, 0]} barSize={14} />
                  <Line type="monotone" dataKey="weight" stroke="#2563EB" strokeWidth={2} dot={{ r: 3, fill: "#FFF", stroke: "#2563EB", strokeWidth: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Operational Section */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Main List Workspace */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customer Directory */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 pb-4 mb-4">
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Database Konsumen</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manajemen modifikasi profil dan status pelanggan.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end w-full sm:w-auto">
                  <button
                    onClick={() => navigate("/members/all")}
                    className="inline-flex items-center justify-center rounded-3xl border border-blue-100 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-wide text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    Lihat Semua Pelanggan
                  </button>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 px-3 py-1.5 w-full sm:w-64">
                    <MdSearch size={18} className="text-slate-400" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari nama atau nomor telepon..."
                      className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-slate-50 max-h-[300px] overflow-y-auto pr-1">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between py-3 hover:bg-slate-50/50 px-2 rounded-2xl transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-800">{customer.name}</p>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                          customer.status === "Loyal" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-slate-100 text-slate-500"
                        }`}>{customer.status}</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">{customer.phone} · <span className="text-slate-400/70 font-bold">Terakhir order: {customer.lastOrder}</span></p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigate(`/members/${customer.id}`)} className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
                        <MdEdit size={16} />
                      </button>
                      <button onClick={() => handleRemoveCustomer(customer.id)} className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
                        <MdDeleteOutline size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredCustomers.length === 0 && (
                  <p className="text-xs text-slate-400 py-10 text-center font-bold">Data konsumen tidak ditemukan.</p>
                )}
              </div>
            </div>

            {/* Financial Transaction Log */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Log Riwayat Transaksi</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Pemantauan antrean invoice kasir secara berkala.</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <span>LOG LENGKAP</span>
                  <MdArrowForward />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 text-slate-400 uppercase tracking-widest font-black text-[9px]">
                      <th className="py-3 px-2">ID Nota</th>
                      <th className="py-3 px-2">Pelanggan</th>
                      <th className="py-3 px-2">Kategori</th>
                      <th className="py-3 px-2 text-center">Status</th>
                      <th className="py-3 px-2 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700 font-bold">
                    {transactionHistory.map((trx) => (
                      <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-2 font-black text-slate-800">
                          {trx.id}
                          <span className="block text-[10px] text-slate-400 font-medium">{trx.date}</span>
                        </td>
                        <td className="py-3 px-2 font-black text-slate-800">{trx.customer}</td>
                        <td className="py-3 px-2 text-slate-500 font-medium">{trx.service} <span className="text-slate-400 font-bold">({trx.weight}kg)</span></td>
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-md ${
                            trx.status === "Selesai" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                            trx.status === "Diproses" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                          }`}>{trx.status}</span>
                        </td>
                        <td className="py-3 px-2 text-right font-black text-slate-900">Rp {trx.total.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Sidebar Utility Widgets */}
          <aside className="space-y-6">
            
            {/* Live Counter Capacity Tracker */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Beban Rak Kerja</h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">Jumlah antrean pakaian berdasarkan partisi kerja harian.</p>
              <div className="space-y-4">
                {[
                  { status: "Antrean Masuk / Diterima", value: 32, max: 40, color: "bg-slate-400" },
                  { status: "Siklus Cuci & Pengering", value: 18, max: 20, color: "bg-blue-600" },
                  { status: "Proses Setrika Uap", value: 9, max: 15, color: "bg-amber-500" },
                  { status: "Selesai / Siap Diambil", value: 41, max: 50, color: "bg-emerald-500" },
                ].map((item) => (
                  <div key={item.status} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500 font-medium">{item.status}</span>
                      <span className="text-slate-800">{item.value} <span className="text-slate-300 font-normal">/ {item.max}</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${(item.value / item.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Segment Optimization */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Klaster Pelanggan</h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">Pembagian klaster kelompok pelanggan terdaftar.</p>
              <div className="space-y-2.5">
                {segments.map((segment) => (
                  <div key={segment.label} className="flex items-center justify-between gap-4 p-2.5 rounded-2xl border border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                      <p className="text-xs font-bold text-slate-600">{segment.label}</p>
                    </div>
                    <p className="text-xs font-black text-slate-800">{segment.value} <span className="text-slate-400 font-normal text-[10px]">User</span></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Broadcast CRM Templates */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Template Gateway</h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">Pintasan salin cepat notifikasi WhatsApp blast.</p>
              <div className="space-y-3">
                {notificationTemplates.map((item) => (
                  <div key={item.label} className="group border border-slate-50 bg-slate-50/30 rounded-2xl p-3 hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                      <span className="text-[9px] font-black bg-white border border-slate-100 text-slate-400 px-2 py-0.5 rounded-md group-hover:text-blue-600 group-hover:border-blue-100 transition-all">SALIN</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed italic group-hover:text-slate-500">"{item.message}"</p>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </section>

        {/* Feedback and Re-engagement Section */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          {/* Customer Reviews Feedback */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Feedback Layanan</h3>
                <p className="text-xs text-slate-400 mt-0.5">Ulasan kepuasan konsumen langsung sistem aplikasi.</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-black px-2.5 py-1 rounded-xl border border-amber-100">
                <MdStar className="mb-0.5" /> {averageRating} / 5.0
              </div>
            </div>
            <div className="space-y-3">
              {feedbackList.map((item) => (
                <div key={item.id} className="border border-slate-50 bg-slate-50/30 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-slate-800">{item.name}</p>
                    <div className="flex items-center text-amber-500 gap-0.5 text-xs font-bold">
                      <MdStar /> {item.rating}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 font-bold italic leading-relaxed">"{item.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Retention Target (Inactive Customers) */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Target Retensi & Re-engagement</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">Hubungi konsumen reguler yang belum bertransaksi kembali bulan ini.</p>
            <div className="space-y-3">
              {inactiveCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between gap-3 border border-slate-50 bg-slate-50/30 rounded-2xl p-3.5">
                  <div>
                    <p className="text-xs font-black text-slate-800">{customer.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">Terakhir cuci: <span className="text-slate-500 font-bold">{customer.lastOrder}</span></p>
                  </div>
                  <button 
                    onClick={() => alert(`Kupon promo otomatis terkirim via WhatsApp gateway ke ${customer.phone}`)} 
                    className="rounded-xl bg-slate-900 hover:bg-[#0F172A] text-white px-3 py-1.5 text-xs font-black shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    Kirim Promo
                  </button>
                </div>
              ))}
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}