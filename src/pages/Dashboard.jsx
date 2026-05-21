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
import customersData from "../data/customers.json";
import { loadCustomers } from "../utils/customerStorage";

const chartData = [
  { name: "Jan", weight: 780, revenue: 16000000 },
  { name: "Feb", weight: 920, revenue: 18500000 },
  { name: "Mar", weight: 1080, revenue: 21000000 },
  { name: "Apr", weight: 1250, revenue: 24800000 },
  { name: "May", weight: 1480, revenue: 29800000 },
  { name: "Jun", weight: 1750, revenue: 34500000 },
];

const transactionHistory = [
  { id: "TRX-1023", customer: "Budi Santoso", date: "18 Mei 2026", service: "Wash & Fold", weight: 12, total: 144000, status: "Selesai" },
  { id: "TRX-1024", customer: "Siti Aminah", date: "18 Mei 2026", service: "Setrika Saja", weight: 5, total: 75000, status: "Diproses" },
  { id: "TRX-1025", customer: "Rian Hidayat", date: "17 Mei 2026", service: "Cuci Kering", weight: 7, total: 105000, status: "Siap Ambil" },
  { id: "TRX-1026", customer: "Dewi Lestari", date: "16 Mei 2026", service: "Dry Cleaning", weight: 3, total: 225000, status: "Selesai" },
  { id: "TRX-1027", customer: "Eko Prasetyo", date: "15 Mei 2026", service: "Express Wash", weight: 10, total: 200000, status: "Diterima" },
];

const segments = [
  { label: "Loyal", value: 34, color: "#0EA5E9" },
  { label: "Reguler", value: 18, color: "#06B6D4" },
  { label: "Baru", value: 8, color: "#0891B2" },
  { label: "Tidak Aktif", value: 6, color: "#0369A1" },
];

const notificationTemplates = [
  { label: "Cucian Selesai", message: "Halo {name}, cucian Anda sudah selesai. Silakan ambil di outlet kami." },
  { label: "Sedang Diproses", message: "Hai {name}, cucian Anda sedang diproses. Estimasi selesai dalam 2 jam." },
  { label: "Pengingat Ambil", message: "Yuk ambil cucian Anda hari ini agar tetap rapi dan wangi." },
];

const feedbackList = [
  { id: 1, name: "Budi Santoso", rating: 4.8, comment: "Layanan cepat dan hasil cuci sangat bersih." },
  { id: 2, name: "Siti Aminah", rating: 4.5, comment: "Pakaian rapi dan pewangi lembut. Puas." },
  { id: 3, name: "Dewi Lestari", rating: 4.9, comment: "Pelayanan ramah, rekomendasi!" },
];

function KpiCard({ icon: Icon, value, label, delta }) {
  return (
    <div className="bg-white rounded-xl border border-laundry-border p-6 shadow-sm hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-navy-deep mt-2 tracking-tight">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-laundry-100 text-aqua-bright flex items-center justify-center">
          <Icon size={22} />
        </div>
      </div>
      {delta !== undefined && (
        <div className="mt-4 flex items-center gap-1.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${delta >= 0 ? "bg-laundry-100 text-aqua-bright" : "bg-rose-50 text-rose-700"}`}>
            {delta >= 0 ? "+" : ""}{delta}%
          </span>
          <span className="text-xs text-slate-400">vs minggu lalu</span>
        </div>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white rounded-lg p-3 shadow-xl border border-slate-800 text-xs">
      <p className="text-slate-400 mb-1 font-medium">{label}</p>
      <p className="font-bold text-emerald-400">{prefix}{payload[0].value.toLocaleString("id-ID")}</p>
    </div>
  );
}

export default function NettoLaundryDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState(() => loadCustomers());
  const [selectedPeriod] = useState("30D");

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
    <div className="min-h-screen bg-gradient-to-br from-sky-fresh to-laundry-bg p-4 md:p-8 text-slate-900 antialiased font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Action */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-laundry-border pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy-deep">CRM & Laundry Management Portal</h1>
            <p className="text-sm text-slate-500 mt-1">Pantau performa operasional, siklus transaksi, dan retensi loyalitas konsumen.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/orders/add")} className="inline-flex items-center gap-2 rounded-lg border border-laundry-border bg-white px-4 py-2.5 text-sm font-semibold text-navy-deep shadow-sm hover:bg-laundry-50 transition-colors">
              <MdShoppingCart size={18} className="text-aqua-bright" /> Tambah Transaksi
            </button>
            <button onClick={() => navigate("/members/add")} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-aqua-bright to-cyan-dark px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-lg hover:from-cyan-dark hover:to-navy-deep transition-all">
              <MdAdd size={18} /> Tambah Pelanggan
            </button>
          </div>
        </header>

        {/* High-Level KPI Widgets */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={MdPeople} value={customers.length} label="Total Basis Pelanggan" delta={12} />
          <KpiCard icon={MdLocalLaundryService} value={transactionHistory.length} label="Volume Transaksi" delta={8} />
          <KpiCard icon={MdAttachMoney} value="Rp 345.0M" label="Pendapatan Bulanan" delta={14} />
          <KpiCard icon={MdNotificationsActive} value="6" label="Notifikasi Sistem" delta={5} />
        </section>

        {/* Analytics Layer */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue Area Chart */}
          <div className="lg:col-span-2 bg-white border border-laundry-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-navy-deep">Proyeksi Arus Kas & Pendapatan</h3>
                <p className="text-xs text-slate-400 mt-0.5">Statistik grafik akumulasi pendapatan kotor bulanan.</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-laundry-100 text-aqua-bright">{periodLabel} Terakhir</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip prefix="Rp " />} />
                <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" strokeWidth={2.5} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Load Capacity Mixed Chart */}
          <div className="bg-white border border-laundry-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-navy-deep">Metrik Tonase Laundry</h3>
                <p className="text-xs text-slate-400 mt-0.5">Perbandingan rasio berat cucian masuk (kg).</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-aqua-bright bg-laundry-100 px-2 py-1 rounded">
                <MdOutlineTimer size={14} /> Real-time
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={chartData} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="weight" fill="#B3E5FC" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="weight" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 3, fill: "#FFF", stroke: "#0EA5E9", strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Operational Section */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Main List Workspace */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customer Directory */}
            <div className="bg-white border border-laundry-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-laundry-border pb-4 mb-4">
                <div>
                  <h3 className="text-base font-semibold text-navy-deep">Direktori Database Konsumen</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manajemen modifikasi profil dan status kepesertaan pelanggan.</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-laundry-border bg-laundry-50 px-3 py-1.5 w-full sm:w-64">
                  <MdSearch size={18} className="text-slate-400" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari nama atau nomor telepon..."
                    className="w-full bg-transparent text-xs text-navy-deep outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
              
              <div className="divide-y divide-laundry-border max-h-[380px] overflow-y-auto pr-1">
                {filteredCustomers.slice(0, 5).map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between py-3.5 hover:bg-laundry-50 px-2 rounded-lg transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-navy-deep">{customer.name}</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          customer.status === "Loyal" ? "bg-laundry-100 text-aqua-bright" : "bg-laundry-200 text-cyan-dark"
                        }`}>{customer.status}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{customer.phone} · <span className="text-slate-400">Terakhir order: {customer.lastOrder}</span></p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => navigate(`/members/${customer.id}`)} className="p-1.5 rounded text-slate-400 hover:text-aqua-bright hover:bg-laundry-100 transition-colors" title="Edit Data">
                        <MdEdit size={16} />
                      </button>
                      <button onClick={() => handleRemoveCustomer(customer.id)} className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Hapus">
                        <MdDeleteOutline size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredCustomers.length === 0 && (
                  <p className="text-xs text-slate-400 py-6 text-center">Data konsumen tidak ditemukan.</p>
                )}
              </div>
            </div>

            {/* Financial Transaction Log */}
            <div className="bg-white border border-laundry-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-navy-deep">Log Kasir & Riwayat Transaksi</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Pemantauan jurnal order terenkripsi real-time.</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-navy-deep bg-laundry-100 px-3 py-1.5 rounded-lg font-medium">
                  <span>Log {periodLabel}</span>
                  <MdArrowForward />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-laundry-border text-slate-400 uppercase tracking-wider font-medium">
                      <th className="py-3 px-2">ID Nota</th>
                      <th className="py-3 px-2">Pelanggan</th>
                      <th className="py-3 px-2">Kategori Servis</th>
                      <th className="py-3 px-2 text-center">Status</th>
                      <th className="py-3 px-2 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-laundry-border text-slate-700">
                    {transactionHistory.map((trx) => (
                      <tr key={trx.id} className="hover:bg-laundry-50/70 transition-colors">
                        <td className="py-3 px-2 font-medium text-navy-deep">
                          {trx.id}
                          <span className="block text-[10px] text-slate-400 font-normal">{trx.date}</span>
                        </td>
                        <td className="py-3 px-2 font-medium text-navy-deep">{trx.customer}</td>
                        <td className="py-3 px-2 text-slate-500">{trx.service} <span className="text-slate-400">({trx.weight}kg)</span></td>
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            trx.status === "Selesai" ? "bg-laundry-200 text-aqua-bright" :
                            trx.status === "Diproses" ? "bg-laundry-100 text-navy-deep" : "bg-laundry-300 text-cyan-dark"
                          }`}>{trx.status}</span>
                        </td>
                        <td className="py-3 px-2 text-right font-semibold text-navy-deep">Rp {trx.total.toLocaleString("id-ID")}</td>
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
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Beban Rak Kerja & Workshop</h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">Jumlah antrean pakaian berdasarkan partisi kerja harian.</p>
              <div className="space-y-3.5">
                {[
                  { status: "Antrean Masuk / Diterima", value: 24, max: 40, color: "bg-slate-400" },
                  { status: "Siklus Cuci & Pengering", value: 16, max: 20, color: "bg-blue-500" },
                  { status: "Proses Setrika Mandiri", value: 12, max: 15, color: "bg-amber-500" },
                  { status: "Selesai / Siap Diambil", value: 8, max: 50, color: "bg-emerald-500" },
                ].map((item) => (
                  <div key={item.status} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">{item.status}</span>
                      <span className="font-bold text-slate-900">{item.value} <span className="text-slate-300 font-normal">/ {item.max}</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${(item.value / item.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Segment Optimization */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Kelompok Segmentasi Pasar</h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">Pembagian klaster pelanggan terdaftar.</p>
              <div className="space-y-2.5">
                {segments.map((segment) => (
                  <div key={segment.label} className="flex items-center justify-between gap-4 p-2 rounded-lg border border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: segment.color }} />
                      <p className="text-xs font-semibold text-slate-700">{segment.label}</p>
                    </div>
                    <p className="text-xs font-bold text-slate-900">{segment.value} <span className="text-slate-400 font-normal text-[10px]">User</span></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Broadcast CRM Templates */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Template Pesan Gateway</h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">Gunakan pintasan pesan WhatsApp blast otomatis.</p>
              <div className="space-y-3">
                {notificationTemplates.map((item) => (
                  <div key={item.label} className="group border border-slate-100 rounded-lg p-3 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{item.label}</p>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Salin</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </section>

        {/* Feedback and Re-engagement Section */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          {/* Customer Reviews Feedback */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Apresiasi & Feedback Layanan</h3>
                <p className="text-xs text-slate-400 mt-0.5">Ulasan kepuasan konsumen langsung melalui sistem aplikasi.</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded">
                <MdStar className="mb-0.5" /> {averageRating} / 5.0
              </div>
            </div>
            <div className="space-y-3">
              {feedbackList.map((item) => (
                <div key={item.id} className="border border-slate-100 bg-slate-50/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">{item.name}</p>
                    <div className="flex items-center text-amber-500 gap-0.5 text-xs font-semibold">
                      <MdStar /> {item.rating}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 italic leading-relaxed">"{item.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Retention Target (Inactive Customers) */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Target Retensi & Rekreasi User</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">Hubungi konsumen reguler yang belum bertransaksi kembali dalam bulan ini.</p>
            <div className="space-y-3">
              {inactiveCustomers.slice(0, 4).map((customer) => (
                <div key={customer.id} className="flex items-center justify-between gap-3 border border-slate-50 bg-slate-50/50 rounded-xl p-3.5">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{customer.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Terakhir cuci: <span className="text-slate-500 font-medium">{customer.lastOrder}</span></p>
                  </div>
                  <button className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors">
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