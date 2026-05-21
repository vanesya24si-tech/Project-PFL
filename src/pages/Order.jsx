import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HiClipboardList, 
  HiSearch, 
  HiPlus, 
  HiClock, 
  HiUser,
  HiTag,
  HiChevronRight
} from "react-icons/hi";

export default function Orders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Data dummy khusus order laundry
  const data = useMemo(() => [
    { id: "ORD-001", customer: "Andi Saputra", received: "05 Mei 2026", estTime: "Besok, 14:00", service: "Cuci Komplit", weight: "5 kg", status: "Diproses" },
    { id: "ORD-002", customer: "Siti Aisyah", received: "05 Mei 2026", estTime: "Hari ini, 18:00", service: "Setrika Saja", weight: "3 kg", status: "Selesai" },
    { id: "ORD-003", customer: "Budi Santoso", received: "06 Mei 2026", estTime: "Lusa, 10:00", service: "Cuci Kering", weight: "7 kg", status: "Antre" },
    { id: "ORD-004", customer: "Dewi Lestari", received: "04 Mei 2026", estTime: "Kemarin, 12:00", service: "Cuci Komplit Express", weight: "2 kg", status: "Diambil" },
  ], []);

  const filtered = data.filter((item) =>
    item.customer.toLowerCase().includes(search.toLowerCase()) || 
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = (status) => {
    switch (status) {
      case "Selesai":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Diproses":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "Antre":
        return "bg-sky-50 text-sky-700 border-sky-200/60";
      case "Diambil":
        return "bg-slate-50 text-slate-700 border-slate-200/60";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200/60";
    }
  };

  // Menghitung ringkasan data secara dinamis
  const summary = useMemo(() => {
    return data.reduce((acc, item) => {
      if (item.status === "Antre") acc.antre++;
      else if (item.status === "Diproses") acc.proses++;
      else if (item.status === "Selesai" || item.status === "Diambil") acc.ready++;
      return acc;
    }, { antre: 0, proses: 0, ready: 0 });
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans text-slate-900 antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-sm">
              <HiClipboardList size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Daftar Order Laundry</h1>
              <p className="text-xs text-slate-500 mt-0.5">Kelola antrean dan status pengerjaan pakaian pelanggan.</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/orders/add")}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-98"
          >
            <HiPlus size={16} />
            Buat Order Baru
          </button>
        </div>

        {/* SEARCH BAR & FILTER CONTROL */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
          <div className="relative w-full max-w-md">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Cari nama pelanggan atau nomor order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
          <div className="text-[11px] font-medium text-slate-400 hidden sm:block">
            Menampilkan {filtered.length} dari {data.length} data
          </div>
        </div>

        {/* DATA TABLE WORKSPACE */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200">
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pelanggan & No. Order</th>
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estimasi Selesai</th>
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Layanan & Berat</th>
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 shrink-0 border border-slate-200/40">
                          <HiUser size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{item.customer}</div>
                          <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 mt-0.5">
                            <HiTag size={12} /> {item.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="text-xs font-medium text-slate-800">{item.estTime}</div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                        <HiClock size={12} /> Masuk: {item.received}
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="text-[10px] font-semibold text-slate-700 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded">
                        {item.service}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1 font-medium tracking-wide">
                        Berat: <span className="text-slate-600 font-semibold">{item.weight}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 text-[10px] rounded-md font-bold uppercase tracking-wider border ${statusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex justify-end items-center gap-2.5 text-[11px] font-bold">
                        <button className="text-slate-400 hover:text-slate-900 transition-colors">DETAIL</button>
                        <span className="text-slate-200">|</span>
                        <button className="text-slate-400 hover:text-emerald-600 transition-colors">UPDATE</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EMPTY STATE */}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white">
              <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 border border-slate-100">
                <HiClipboardList size={22} className="text-slate-400" />
              </div>
              <h3 className="text-xs font-bold text-slate-800">Order tidak ditemukan</h3>
              <p className="text-slate-400 text-[11px] mt-0.5">Coba ganti kata kunci nama atau nomor urut nota.</p>
            </div>
          )}
        </div>

        {/* SUMMARY STATS BOARD */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metrik Operasional</p>
            <h4 className="text-xs font-medium text-slate-600 mt-0.5">Memantau total pengerjaan aktif di dalam sistem antrean.</h4>
          </div>
          <div className="flex gap-3 w-full sm:w-auto justify-center">
            {[
              { count: summary.antre, label: "Antre", color: "text-sky-600 bg-sky-50" },
              { count: summary.proses, label: "Proses", color: "text-amber-600 bg-amber-50" },
              { count: summary.ready, label: "Selesai", color: "text-emerald-600 bg-emerald-50" }
            ].map((box, i) => (
              <div key={i} className={`px-4 py-2 rounded-lg border border-slate-100 min-w-[75px] text-center ${box.color}`}>
                <span className="block text-base font-bold tracking-tight">{box.count}</span>
                <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">{box.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}