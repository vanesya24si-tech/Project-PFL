import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiChartPie,
  HiUsers,
  HiSearch,
  HiSparkles,
  HiTrendingUp,
  HiStar,
  HiChevronRight,
  HiUserGroup,
} from "react-icons/hi";
import { loadCustomers } from "../utils/customerStorage";

export default function Member() {
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("Semua");
  const [serviceFilter, setServiceFilter] = useState("Semua");
  const [showAll, setShowAll] = useState(false);
  const [customers] = useState(() => loadCustomers() || []);

  const segmentOptions = ["Semua", "VIP", "Loyal", "Reguler", "Baru"];

  const filteredCustomers = customers.filter((c) => {
    const searchTerm = search.toLowerCase();
    
    const customerName = c.name ? c.name.toLowerCase() : "";
    const customerPhone = c.phone ? c.phone.toLowerCase() : "";
    const customerStatus = c.status ? c.status.toLowerCase() : "baru";
    const customerSegment = c.segment ? c.segment.toLowerCase() : "baru";
    const favoriteService = c.favoriteService ? c.favoriteService.toLowerCase() : "reguler";

    const serviceType = favoriteService.includes("express") ? "Express" : "Reguler";

    const matchesSearch =
      customerName.includes(searchTerm) ||
      customerPhone.includes(searchTerm) ||
      customerStatus.includes(searchTerm) ||
      customerSegment.includes(searchTerm);

    const matchesSegment =
      segmentFilter === "Semua" || 
      customerSegment === segmentFilter.toLowerCase();

    const matchesService = 
      serviceFilter === "Semua" || 
      serviceType === serviceFilter;

    return matchesSearch && matchesSegment && matchesService;
  });

  // 1. Batasi data yang muncul di tabel utama (tampilkan ringkasan, klik "Lihat Selengkapnya" untuk semua)
  const summaryLimit = 10;
  const limitedCustomers = showAll ? filteredCustomers : filteredCustomers.slice(0, summaryLimit);

  const totalCount = customers.length;

  const segments = [
    { 
      name: "VIP", 
      count: customers.filter((c) => c.segment?.toLowerCase() === "vip").length, 
      color: "#4f46e5", 
      icon: <HiUserGroup /> 
    },
    { 
      name: "Loyal", 
      count: customers.filter((c) => c.segment?.toLowerCase() === "loyal").length, 
      color: "#0284c7", 
      icon: <HiStar /> 
    },
    { 
      name: "Reguler", 
      count: customers.filter((c) => c.segment?.toLowerCase() === "reguler").length, 
      color: "#38bdf8", 
      icon: <HiTrendingUp /> 
    },
    { 
      name: "Baru", 
      count: customers.filter((c) => c.segment?.toLowerCase() === "baru").length, 
      color: "#7dd3fc", 
      icon: <HiSparkles /> 
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-8 font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <section className="rounded-[2rem] bg-white p-8 shadow-lg shadow-blue-100/50 border border-blue-50">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <HiUsers className="text-lg" /> CRM & Pelanggan
              </div>
              <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900">Kelola Data Pelanggan Netto Laundry</h1>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                Pantau riwayat, segmentasi, dan status pelanggan di satu halaman yang mudah digunakan. Cari berdasarkan nama, status, atau nomor telepon.
              </p>
            </div>
            <div className="grid gap-3 sm:flex sm:items-center">
              <Link to="/orders/add" className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                Tambah Pelanggan / Order
              </Link>
              <button className="inline-flex items-center justify-center rounded-3xl border border-blue-100 bg-white px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 transition-all">
                Unduh Data CRM
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {segments.map((segment) => (
              <div key={segment.name} className="rounded-[1.75rem] bg-gradient-to-br from-white to-blue-50/50 border border-blue-100/70 p-5 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div 
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-xs border border-blue-50"
                    style={{ color: segment.color }}
                  >
                    {segment.icon}
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{segment.name}</span>
                </div>
                <p className="mt-4 text-3xl font-black text-slate-900">{segment.count}</p>
                <p className="mt-1 text-xs font-medium text-slate-400">Total Database</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          
          {/* MAIN LIST SECTION */}
          <section className="rounded-[2rem] bg-white border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Daftar Pelanggan</h2>
                <p className="text-xs text-slate-400 font-medium">Manajemen database pelanggan dengan filter cerdas.</p>
              </div>

              {/* FILTERS */}
              <div className="mt-6 rounded-[1.75rem] border border-blue-50 bg-slate-50/50 p-4 space-y-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="relative flex-1">
                    <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari nama, nomor telepon atau status..."
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {segmentOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => setSegmentFilter(option)}
                        className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          option === segmentFilter
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                            : "bg-white text-slate-500 border border-slate-200 hover:border-blue-200"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-[9px]">Profil Pelanggan</th>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-[9px]">Status CRM</th>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-[9px] text-center">Total Order</th>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-[9px] text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold">
                      {limitedCustomers.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-10 text-center text-slate-400 font-medium">
                            Tidak ada data pelanggan yang cocok dengan filter.
                          </td>
                        </tr>
                      ) : (
                        // 2. Menggunakan limitedCustomers (maksimal 5 data)
                        limitedCustomers.map((customer) => {
                          const statusLower = customer.segment?.toLowerCase() || customer.status?.toLowerCase() || "baru";
                          return (
                            <tr key={customer.id} className="hover:bg-blue-50/20 transition-colors group">
                              <td className="px-6 py-4">
                                <Link to={`/members/${customer.id}`} className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-black text-xs border border-blue-100 uppercase">
                                    {customer.avatar || customer.name?.substring(0, 2) || "PL"}
                                  </div>
                                  <div className="truncate max-w-[160px]">
                                    <p className="font-black text-slate-800 group-hover:text-blue-600 transition-colors truncate">{customer.name}</p>
                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{customer.phone}</p>
                                  </div>
                                </Link>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${
                                  statusLower === "vip" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                                  statusLower === "loyal" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                  statusLower === "reguler" ? "bg-sky-50 text-sky-600 border border-sky-100" :
                                  "bg-slate-50 text-slate-500 border border-slate-100"
                                }`}>
                                  {customer.segment || customer.status || "Baru"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center text-slate-700 font-mono">{customer.orders || 0}</td>
                              <td className="px-6 py-4 text-right">
                                <Link to={`/members/${customer.id}`} className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-700">
                                  Profil <HiChevronRight className="text-sm" />
                                </Link>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 3. TOMBOL SELENGKAPNYA (Hanya muncul jika total data lebih dari 5) */}
            {filteredCustomers.length > summaryLimit && (
              <div className="mt-5 flex justify-center border-t border-slate-100 pt-4">
                <button
                  onClick={() => setShowAll((s) => !s)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-6 py-3 text-xs font-black uppercase tracking-wider text-blue-600 hover:bg-blue-100 transition-all active:scale-95"
                >
                  {showAll ? `Sembunyikan (${filteredCustomers.length})` : `Lihat Selengkapnya (${filteredCustomers.length} Pelanggan)`}
                  <HiChevronRight className="text-base" />
                </button>
              </div>
            )}
          </section>

          {/* SIDEBAR SECTION */}
          <aside className="space-y-8">
            <section className="rounded-[2rem] bg-white border border-slate-100 p-6 shadow-xs">
              <div className="flex items-center gap-4 border-b border-slate-50 pb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-xl border border-blue-100">
                  <HiChartPie />
                </div>
                <div>
                  <p className="font-black text-slate-900 tracking-tight text-sm">Ringkasan Distribusi Segmen</p>
                  <p className="text-[11px] text-slate-400 font-medium">Persentase loyalitas dalam database.</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                {segments.map((segment) => {
                  const percentage = totalCount > 0 ? Math.round((segment.count / totalCount) * 100) : 0;
                  
                  return (
                    <div key={segment.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-700">{segment.name}</span>
                        <span className="text-slate-400 font-mono">{percentage}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-50 border border-slate-100 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${percentage}%`, backgroundColor: segment.color }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl bg-blue-600 p-5 text-white shadow-md shadow-blue-100">
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
                  <HiSparkles className="text-base text-blue-200 animate-pulse" />
                  Insight CRM Terkini
                </div>
                <p className="mt-3 text-[11px] leading-5 text-blue-100 font-medium">
                  Segmen pelanggan <strong>VIP</strong> & <strong>Loyal</strong> berkontribusi terhadap 75% omzet. Maksimalkan fitur registrasi member baru pada form kasir untuk mengikat loyalitas segmen <strong>Baru</strong>.
                </p>
              </div>
            </section>
          </aside>
        </div>

      </div>
    </div>
  );
}