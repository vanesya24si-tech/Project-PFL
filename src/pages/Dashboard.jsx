import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, ComposedChart, Bar, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
  MdPeople,
  MdShoppingCart,
  MdBarChart,
  MdAttachMoney,
  MdLocalLaundryService,
  MdAccessTime,
  MdLocalShipping,
  MdSearch,
  MdNotificationsActive,
  MdOutlineTimer,
  MdStarBorder,
  MdArrowRightAlt,
  MdDeleteOutline,
  MdEdit,
  MdAdd,
} from "react-icons/md";
import customersData from "../data/customers.json";

const COLORS = {
  primary: "#10B981",
  primaryDark: "#047857",
  primaryLight: "#DCFCE7",
  text: "#0F172A",
  textMuted: "#475569",
  border: "#D1FAE5",
  white: "#FFFFFF",
  bg: "#F0F9F4",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

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
  { label: "Loyal", value: 34, color: "#10B981" },
  { label: "Reguler", value: 18, color: "#22C55E" },
  { label: "Baru", value: 8, color: "#F59E0B" },
  { label: "Tidak Aktif", value: 6, color: "#F97316" },
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
    <div className="bg-white rounded-3xl border border-[#E5F7ED] p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#047857] flex items-center justify-center">
          <Icon size={24} />
        </div>
        <div>
          <p className="text-3xl font-bold text-[#0F172A]">{value}</p>
          <p className="text-sm text-[#475569] mt-1">{label}</p>
        </div>
      </div>
      {delta !== undefined && (
        <div className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${delta >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
          {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)}% dibandingkan minggu lalu
        </div>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E5F7ED] rounded-2xl p-3 shadow-lg text-xs">
      <p className="text-[#475569] mb-1 font-semibold">{label}</p>
      <p className="text-[#047857] font-bold">{prefix}{payload[0].value.toLocaleString("id-ID")}</p>
    </div>
  );
}

export default function NettoLaundryDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState(customersData);
  const [selectedPeriod, setSelectedPeriod] = useState("30D");

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

  const filteredTransactions = useMemo(() => {
    if (selectedPeriod === "7D") return transactionHistory.slice(0, 3);
    if (selectedPeriod === "30D") return transactionHistory.slice(0, 4);
    return transactionHistory;
  }, [selectedPeriod]);

  const handleRemoveCustomer = (id) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F0F9F4] p-4 md:p-8 text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-6">

        <section className="rounded-[32px] bg-[#ECFDF5] border border-[#D1FAE5] p-8 shadow-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <span className="inline-block text-sm font-semibold uppercase tracking-[0.35em] text-[#047857]">Dashboard Admin</span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Pusat Kontrol Laundry & CRM</h1>
              <p className="mt-3 text-sm leading-7 text-[#475569]">
                Monitor data pelanggan, riwayat transaksi, notifikasi otomatis, segmentasi, loyalitas, feedback, tracking status, dan laporan CRM dalam satu halaman yang bersih dan interaktif.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate("/members/add")} className="inline-flex items-center gap-2 rounded-2xl bg-[#047857] px-5 py-3 text-sm font-semibold text-white shadow hover:bg-[#065f46] transition-all">
                <MdAdd /> Tambah Pelanggan
              </button>
              <button onClick={() => navigate("/orders/add")} className="inline-flex items-center gap-2 rounded-2xl border border-[#10B981] bg-white px-5 py-3 text-sm font-semibold text-[#047857] shadow-sm hover:bg-[#ECFDF5] transition-all">
                <MdShoppingCart /> Tambah Transaksi
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-4">
          <KpiCard icon={MdPeople} value={customers.length} label="Pelanggan Terdaftar" delta={12} />
          <KpiCard icon={MdLocalLaundryService} value={transactionHistory.length} label="Transaksi Bulanan" delta={8} />
          <KpiCard icon={MdAttachMoney} value="Rp 345.0M" label="Pendapatan Bulanan" delta={14} />
          <KpiCard icon={MdNotificationsActive} value="6" label="Notifikasi Aktif" delta={5} />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-3xl bg-white border border-[#E5F7ED] p-5 shadow-sm">
                <p className="text-sm text-[#475569] uppercase tracking-[0.25em]">Segmentasi Pelanggan</p>
                <p className="mt-4 text-3xl font-bold">{segments.reduce((sum, item) => sum + item.value, 0)}</p>
                <p className="mt-3 text-sm text-[#64748B]">Kelompok pelanggan aktif berdasarkan frekuensi transaksi dan nilai belanja.</p>
              </div>
              <div className="rounded-3xl bg-white border border-[#E5F7ED] p-5 shadow-sm">
                <p className="text-sm text-[#475569] uppercase tracking-[0.25em]">Pelanggan Tidak Aktif</p>
                <p className="mt-4 text-3xl font-bold">{inactiveCustomers.length}</p>
                <p className="mt-3 text-sm text-[#64748B]">Deteksi otomatis pelanggan yang perlu diingatkan setelah 30 hari tanpa transaksi.</p>
              </div>
              <div className="rounded-3xl bg-white border border-[#E5F7ED] p-5 shadow-sm">
                <p className="text-sm text-[#475569] uppercase tracking-[0.25em]">Rating Rata-rata</p>
                <p className="mt-4 text-3xl font-bold">{averageRating} / 5</p>
                <p className="mt-3 text-sm text-[#64748B]">Umpan balik pelanggan sebagai indikator kualitas layanan.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-[32px] bg-white border border-[#E5F7ED] p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#475569]">Grafik Pendapatan</p>
                    <p className="mt-1 text-xs text-[#94A3B8]">Bandingkan kinerja transaksi per bulan.</p>
                  </div>
                  <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#047857]">{periodLabel}</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="dashboardGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#E6F4ED" strokeDasharray="3 3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: COLORS.textMuted, fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip prefix="Rp " />} />
                    <Area type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={3} fill="url(#dashboardGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-[32px] bg-white border border-[#E5F7ED] p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#475569]">Volume Transaksi</p>
                    <p className="mt-1 text-xs text-[#94A3B8]">Cek berat cucian dan performa layanan.</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#047857]">
                    <MdOutlineTimer size={16} /> Real-time
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid vertical={false} stroke="#E6F4ED" strokeDasharray="3 3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: COLORS.textMuted, fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="weight" fill="#A7F3D0" radius={[10, 10, 0, 0]} barSize={28} />
                    <Line type="monotone" dataKey="weight" stroke={COLORS.primaryDark} strokeWidth={3} dot={{ r: 4, fill: COLORS.white, stroke: COLORS.primaryDark, strokeWidth: 2 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-[32px] bg-white border border-[#E5F7ED] p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#475569]">Manajemen Pelanggan</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">Cari, tambah, edit, atau hapus pelanggan langsung dari dashboard.</p>
                </div>
                <div className="flex items-center gap-3 rounded-3xl border border-[#D1FAE5] bg-[#F0F9F4] px-4 py-2">
                  <MdSearch size={20} className="text-[#047857]" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Cari nama atau telepon..."
                    className="w-full bg-transparent text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {filteredCustomers.slice(0, 5).map((customer) => (
                  <div key={customer.id} className="flex flex-col gap-3 rounded-3xl border border-[#E5F7ED] bg-[#F8FEF8] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-[#0F172A]">{customer.name}</p>
                      <p className="text-sm text-[#475569] mt-1">{customer.phone} · {customer.status}</p>
                      <p className="text-xs text-[#64748B] mt-1">Terakhir pesan: {customer.lastOrder}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={() => navigate(`/members/${customer.id}`)} className="rounded-2xl bg-[#047857] px-4 py-2 text-xs font-semibold text-white hover:bg-[#065f46] transition-all flex items-center gap-1">
                        <MdEdit size={16} /> Edit
                      </button>
                      <button onClick={() => handleRemoveCustomer(customer.id)} className="rounded-2xl border border-[#F87171] px-4 py-2 text-xs font-semibold text-[#B91C1C] hover:bg-[#FEE2E2] transition-all flex items-center gap-1">
                        <MdDeleteOutline size={16} /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
                {filteredCustomers.length === 0 && (
                  <div className="rounded-3xl border border-[#E5F7ED] bg-white p-5 text-sm text-[#64748B]">
                    Tidak ada pelanggan yang cocok. Coba kata kunci lain.
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] bg-white border border-[#E5F7ED] p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#475569]">Notifikasi Otomatis</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">Atur template pesan dan pastikan pelanggan selalu terinformasi.</p>
                </div>
                <button className="rounded-2xl bg-[#ECFDF5] px-3 py-2 text-xs font-semibold text-[#047857]">Kelola</button>
              </div>
              <div className="space-y-3">
                {notificationTemplates.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-[#E5F7ED] bg-[#F8FEF8] p-4">
                    <p className="font-semibold text-[#0F172A]">{item.label}</p>
                    <p className="mt-2 text-sm text-[#475569]">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] bg-white border border-[#E5F7ED] p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#475569]">Program Loyalitas</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">Kelola poin dan reward pelanggan istimewa.</p>
                </div>
                <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#047857]">Top Pelanggan</span>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl bg-[#ECFDF5] p-4">
                  <p className="text-sm font-semibold text-[#047857]">Poin Hari Ini</p>
                  <p className="mt-2 text-2xl font-bold text-[#0F172A]">6.850</p>
                  <p className="text-sm text-[#64748B] mt-1">Tambah poin otomatis saat transaksi selesai.</p>
                </div>
                <div className="rounded-3xl bg-[#F8FEF8] p-4">
                  <p className="text-sm text-[#475569]">Reward aktif:</p>
                  <p className="mt-2 font-semibold text-[#0F172A]">Diskon 10% untuk pelanggan loyal</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-white border border-[#E5F7ED] p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#475569]">Tracking Status Laundry</p>
              <div className="mt-5 space-y-3">
                {[
                  { status: "Diterima", value: 24 },
                  { status: "Dicuci", value: 16 },
                  { status: "Disetrika", value: 12 },
                  { status: "Siap Ambil", value: 8 },
                ].map((item) => (
                  <div key={item.status} className="rounded-3xl bg-[#F8FEF8] p-4">
                    <div className="flex items-center justify-between text-sm text-[#475569]">
                      <p>{item.status}</p>
                      <p className="font-semibold text-[#0F172A]">{item.value}</p>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-[#DCFCE7]">
                      <div className="h-2 rounded-full bg-[#047857]" style={{ width: `${Math.min(item.value * 3.5, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[32px] bg-white border border-[#E5F7ED] p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#475569]">Riwayat Transaksi Pelanggan</p>
                <p className="mt-1 text-xs text-[#94A3B8]">Lihat detail transaksi lengkap dan bandingkan antar periode.</p>
              </div>
              <div className="inline-flex gap-2 rounded-full bg-[#ECFDF5] px-4 py-2 text-xs font-semibold text-[#047857]">
                <span>{periodLabel}</span>
                <MdArrowRightAlt />
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-[28px] border border-[#E5F7ED]">
              <div className="grid grid-cols-3 gap-2 bg-[#F8FEF8] px-4 py-3 text-xs uppercase tracking-[0.3em] text-[#475569]">
                <span>Order</span>
                <span>Pelanggan</span>
                <span>Status</span>
              </div>
              <div className="divide-y divide-[#E5F7ED] bg-white">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="grid grid-cols-3 gap-2 px-4 py-4 items-center text-sm text-[#0F172A]">
                    <div>
                      <p className="font-semibold">{transaction.id}</p>
                      <p className="text-xs text-[#64748B]">{transaction.date}</p>
                    </div>
                    <div>
                      <p>{transaction.customer}</p>
                      <p className="text-xs text-[#64748B]">{transaction.service} · {transaction.weight} kg</p>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${transaction.status === "Selesai" ? "bg-emerald-100 text-emerald-700" : transaction.status === "Diproses" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"}`}>
                        {transaction.status}
                      </span>
                      <span className="text-sm font-semibold text-[#0F172A]">Rp {transaction.total.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] bg-white border border-[#E5F7ED] p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#475569]">Segmentasi Pelanggan</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">Kelompokkan pelanggan dengan cepat untuk promosi yang lebih tepat sasaran.</p>
                </div>
                <button className="rounded-2xl bg-[#ECFDF5] px-3 py-2 text-xs font-semibold text-[#047857]">Atur</button>
              </div>
              <div className="space-y-3">
                {segments.map((segment) => (
                  <div key={segment.label} className="flex items-center justify-between gap-4 rounded-3xl bg-[#F8FEF8] p-4">
                    <div>
                      <p className="font-semibold text-[#0F172A]">{segment.label}</p>
                      <p className="text-xs text-[#64748B]">{segment.value} pelanggan</p>
                    </div>
                    <div className="h-2 flex-1 rounded-full bg-[#DCFCE7]">
                      <div className="h-2 rounded-full" style={{ width: `${segment.value * 2.5}%`, background: segment.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] bg-white border border-[#E5F7ED] p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#475569]">Laporan CRM Cepat</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Pelanggan Aktif", value: 42 },
                  { label: "Transaksi Baru", value: 18 },
                  { label: "Retensi", value: "82%" },
                  { label: "Feedback Positif", value: "94%" },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl bg-[#F8FEF8] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#475569]">{item.label}</p>
                    <p className="mt-3 text-2xl font-bold text-[#0F172A]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] bg-white border border-[#E5F7ED] p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#475569]">Feedback Pelanggan</p>
              <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#047857]">Rata-rata {averageRating}</span>
            </div>
            <div className="space-y-4">
              {feedbackList.map((item) => (
                <div key={item.id} className="rounded-3xl border border-[#E5F7ED] bg-[#F8FEF8] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#0F172A]">{item.name}</p>
                      <p className="text-xs text-[#475569]">Rating {item.rating} / 5</p>
                    </div>
                    <MdStarBorder size={22} className="text-[#047857]" />
                  </div>
                  <p className="mt-3 text-sm text-[#475569]">"{item.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white border border-[#E5F7ED] p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#475569]">Reminder Pelanggan Tidak Aktif</p>
              <button className="rounded-2xl bg-[#ECFDF5] px-3 py-2 text-xs font-semibold text-[#047857]">Atur Kriteria</button>
            </div>
            <div className="space-y-4">
              {inactiveCustomers.slice(0, 4).map((customer) => (
                <div key={customer.id} className="flex items-center justify-between gap-3 rounded-3xl bg-[#F8FEF8] p-4">
                  <div>
                    <p className="font-semibold text-[#0F172A]">{customer.name}</p>
                    <p className="text-xs text-[#64748B]">Terakhir pesanan: {customer.lastOrder}</p>
                  </div>
                  <button className="rounded-2xl bg-[#047857] px-4 py-2 text-xs font-semibold text-white hover:bg-[#065f46] transition-all">
                    Kirim Reminder
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
