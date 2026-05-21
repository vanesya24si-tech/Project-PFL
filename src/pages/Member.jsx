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
} from "react-icons/hi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { loadCustomers } from "../utils/customerStorage";

export default function Member() {
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("Semua");
  const [serviceFilter, setServiceFilter] = useState("Semua");
  const [customers] = useState(() => loadCustomers());

  const segmentOptions = ["Semua", "VIP", "Loyal", "Reguler", "Baru"];
  const serviceOptions = ["Semua", "Reguler", "Express"];

  const filteredCustomers = customers.filter((c) => {
    const searchTerm = search.toLowerCase();
    const serviceType = c.favoriteService.toLowerCase().includes("express") ? "Express" : "Reguler";
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm) ||
      c.phone.toLowerCase().includes(searchTerm) ||
      c.status.toLowerCase().includes(searchTerm);
    const matchesSegment =
      segmentFilter === "Semua" ||
      (segmentFilter === "VIP" ? false : c.status === segmentFilter);
    const matchesService = serviceFilter === "Semua" || serviceType === serviceFilter;

    return matchesSearch && matchesSegment && matchesService;
  });

  const segments = [
    { name: "Loyal", count: customers.filter((c) => c.status === "Loyal").length, color: "#10B981", icon: <HiStar /> },
    { name: "Reguler", count: customers.filter((c) => c.status === "Reguler").length, color: "#22C55E", icon: <HiTrendingUp /> },
    { name: "Baru", count: customers.filter((c) => c.status === "Baru").length, color: "#34D399", icon: <HiSparkles /> },
  ];

  const chartData = segments.map((segment) => ({ name: segment.name, value: segment.count }));

  return (
    <div className="min-h-screen bg-[#EFFBF4] p-8 font-sans text-[#0F172A]">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200/50 border border-slate-100">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#DCFCE7] px-4 py-2 text-sm font-semibold text-[#047857]">
                <HiUsers className="text-lg" /> Pelanggan
              </div>
              <h1 className="mt-6 text-4xl font-black tracking-tight">Kelola Data Pelanggan Netto Laundry</h1>
              <p className="mt-4 text-sm leading-7 text-[#475569]">
                Pantau riwayat, segmentasi, dan status pelanggan di satu halaman yang mudah digunakan. Cari berdasarkan nama, status, atau nomor telepon.
              </p>
            </div>
            <div className="grid gap-3 sm:flex sm:items-center">
              <Link to="/members/add" className="inline-flex items-center justify-center rounded-3xl bg-[#10B981] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#10B981]/20 hover:bg-[#0f766e] transition">
                Tambah Pelanggan
              </Link>
              <button className="inline-flex items-center justify-center rounded-3xl border border-[#D1FAE5] bg-white px-6 py-3 text-sm font-semibold text-[#475569] hover:bg-slate-50 transition">
                Unduh Data
              </button>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {segments.map((segment) => (
              <div key={segment.name} className="rounded-[1.75rem] bg-[#F8FEF8] border border-[#DCFCE7] p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-center text-2xl text-[#047857] shadow-sm">
                    {segment.icon}
                  </div>
                  <span className="text-sm font-semibold text-[#475569]">{segment.name}</span>
                </div>
                <p className="mt-5 text-4xl font-black text-[#0F172A]">{segment.count}</p>
                <p className="mt-2 text-sm text-[#64748B]">Pelanggan</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] bg-white border border-slate-100 p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#0F172A]">Daftar Pelanggan</h2>
                <p className="mt-2 text-sm text-[#64748B]">Aktifkan manajemen pelanggan dengan opsi edit, filter, dan segmen.</p>
              </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-[#F8FAFB] p-4 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative max-w-md w-full">
                  <HiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari"
                    className="w-full rounded-3xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm text-[#0F172A] outline-none transition focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {segmentOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSegmentFilter(option)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        option === segmentFilter
                          ? "bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20"
                          : "bg-white text-[#475569] border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[#475569]">Layanan:</span>
                {serviceOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setServiceFilter(option)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      option === serviceFilter
                        ? "bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20"
                        : "bg-white text-[#475569] border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-100">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-[#F8FEF8] text-[#475569]">
                  <tr>
                    <th className="px-6 py-4 uppercase tracking-[0.24em]">Pelanggan</th>
                    <th className="px-6 py-4 uppercase tracking-[0.24em]">Status</th>
                    <th className="px-6 py-4 uppercase tracking-[0.24em] text-center">Order</th>
                    <th className="px-6 py-4 uppercase tracking-[0.24em] text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-[#F8FEF8] transition-colors">
                      <td className="px-6 py-5">
                        <Link to={`/members/${customer.id}`} className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#DCFCE7] text-[#047857] font-black">{customer.avatar}</div>
                          <div>
                            <p className="text-sm font-semibold text-[#0F172A]">{customer.name}</p>
                            <p className="text-xs text-[#64748B]">{customer.phone}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          customer.status === "Loyal" ? "bg-[#DCFCE7] text-[#047857]" :
                          customer.status === "Reguler" ? "bg-[#D1FAE5] text-[#065f46]" :
                          "bg-[#E2E8F0] text-[#64748B]"
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center font-bold text-[#0F172A]">{customer.orders}</td>
                      <td className="px-6 py-5 text-right">
                        <Link to={`/members/${customer.id}`} className="inline-flex items-center gap-2 text-[#10B981] font-semibold hover:text-[#047857]">
                          Detail <HiChevronRight className="text-base" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-sm text-[#64748B]">
                        Tidak ditemukan pelanggan sesuai kata kunci.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="rounded-[2rem] bg-white border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#10B981]/10 text-[#10B981] text-2xl">
                <HiChartPie />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">Ringkasan Segmentasi</p>
                <p className="text-sm text-[#64748B]">Lihat distribusi pelanggan berdasarkan status loyalitas.</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {segments.map((segment) => (
                <div key={segment.name} className="rounded-3xl bg-[#F8FEF8] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{segment.name}</p>
                      <p className="text-xs text-[#64748B]">{Math.round((segment.count / customers.length) * 100)}% dari semua pelanggan</p>
                    </div>
                    <div className="h-2.5 w-24 rounded-full bg-[#DCFCE7]"><div className="h-2.5 rounded-full" style={{ width: `${(segment.count / customers.length) * 100}%`, backgroundColor: segment.color }} /></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.75rem] bg-[#EFFBF4] p-5">
              <div className="flex items-center gap-3 text-[#047857] font-semibold">
                <HiSparkles className="text-xl" />
                Peluang Promosi
              </div>
              <p className="mt-3 text-sm text-[#475569]">Fokuskan penawaran voucher pada pelanggan baru dan segmentasi loyal dengan retention campaign.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
