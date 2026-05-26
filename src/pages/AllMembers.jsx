import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiUsers,
  HiSearch,
  HiChevronRight,
  HiArrowLeft,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { loadCustomers } from "../utils/customerStorage";

export default function AllMembers() {
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("Semua");
  const [customers] = useState(() => loadCustomers() || []);

  const segmentOptions = ["Semua", "VIP", "Loyal", "Reguler", "Baru"];

  // Filter Data untuk Seluruh Pelanggan
  const filteredCustomers = customers.filter((c) => {
    const searchTerm = search.toLowerCase();
    
    const customerName = c.name ? c.name.toLowerCase() : "";
    const customerPhone = c.phone ? c.phone.toLowerCase() : "";
    const customerStatus = c.status ? c.status.toLowerCase() : "baru";

    const matchesSearch =
      customerName.includes(searchTerm) ||
      customerPhone.includes(searchTerm) ||
      customerStatus.includes(searchTerm);

    const matchesSegment =
      segmentFilter === "Semua" || 
      customerStatus === segmentFilter.toLowerCase();

    return matchesSearch && matchesSegment;
  });

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-8 font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOMBOL KEMBALI */}
        <div className="flex items-center justify-between">
          <Link 
            to="/members" // Mengarah kembali ke halaman dashboard utama Anda
            className="inline-flex items-center gap-2 rounded-2xl border border-blue-100 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-blue-50 transition-all active:scale-95 shadow-xs"
          >
            <HiArrowLeft className="text-base" /> Kembali ke Dashboard
          </Link>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400">Total Database</p>
            <p className="text-lg font-black text-blue-600">{customers.length} Pelanggan</p>
          </div>
        </div>

        {/* MAIN SECTION */}
        <section className="rounded-[2rem] bg-white border border-slate-100 p-8 shadow-lg shadow-blue-100/30">
          
          {/* HEADER JUDUL */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 text-2xl border border-blue-100">
                <HiUsers />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Basis Data Seluruh Pelanggan</h1>
                <p className="text-xs text-slate-400 font-medium">Melihat dan mengelola seluruh riwayat data CRM tanpa batas.</p>
              </div>
            </div>
          </div>

          {/* AREA FILTER & PENCARIAN */}
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center bg-slate-50/50 border border-blue-50 p-4 rounded-2xl">
            <div className="relative flex-1">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari berdasarkan nama, nomor telepon atau status..."
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

          {/* TABEL SELURUH DATA */}
          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[9px]">Profil Pelanggan</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[9px]">Kontak & Email</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[9px]">Status CRM</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[9px] text-center">Total Order</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[9px] text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                        <HiOutlineUserCircle className="text-4xl mx-auto mb-2 text-slate-300" />
                        Tidak ada pelanggan yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => {
                      const statusLower = customer.status?.toLowerCase() || "baru";
                      return (
                        <tr key={customer.id} className="hover:bg-blue-50/20 transition-colors group">
                          {/* Nama & Avatar */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-black text-xs border border-blue-100 uppercase">
                                {customer.avatar || customer.name?.substring(0, 2) || "PL"}
                              </div>
                              <div>
                                <p className="font-black text-slate-800 group-hover:text-blue-600 transition-colors">{customer.name}</p>
                                <p className="text-[10px] text-slate-400 font-normal mt-0.5">ID Pelanggan: #{customer.id}</p>
                              </div>
                            </div>
                          </td>
                          {/* Kontak */}
                          <td className="px-6 py-4 font-medium text-slate-600">
                            <p>{customer.phone}</p>
                            <p className="text-[11px] text-slate-400 font-normal">{customer.email || "-"}</p>
                          </td>
                          {/* Status Badge */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${
                              statusLower === "vip" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                              statusLower === "loyal" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                              statusLower === "reguler" ? "bg-sky-50 text-sky-600 border border-sky-100" :
                              "bg-slate-50 text-slate-500 border border-slate-100"
                            }`}>
                              {customer.status || "Baru"}
                            </span>
                          </td>
                          {/* Total Order */}
                          <td className="px-6 py-4 text-center text-slate-700 font-mono text-sm">
                            {customer.orders || 0}
                          </td>
                          {/* Aksi */}
                          <td className="px-6 py-4 text-right">
                            <Link to={`/members/${customer.id}`} className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-700">
                              Profil Lengkap <HiChevronRight className="text-sm" />
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

          {/* INFORMASI JUMLAH DATA AKTIF */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-medium px-2">
            <p>Menampilkan {filteredCustomers.length} dari keseluruhan {customers.length} pelanggan.</p>
          </div>

        </section>
      </div>
    </div>
  );
}