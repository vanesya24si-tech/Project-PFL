import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HiClipboardList, 
  HiSearch, 
  HiPlus, 
  HiClock, 
  HiUser,
  HiTag 
} from "react-icons/hi";

// Konstanta Warna Terpadu
const COLORS = {
  primary: "#17A589",       // Teal Utama
  primaryDark: "#0D2D26",   // Teal Gelap
  primaryLight: "#E8F8F5",  // Hijau Muda
  textMain: "#1A2E35",      // Navy Gelap
  textMuted: "#7F9E97",     // Abu Hijau
};

export default function Orders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Data dummy khusus order laundry
  const data = [
    { id: "ORD-001", customer: "Andi Saputra", received: "05 Mei 2026", estTime: "Besok, 14:00", service: "Cuci Komplit", weight: "5 kg", status: "Diproses" },
    { id: "ORD-002", customer: "Siti Aisyah", received: "05 Mei 2026", estTime: "Hari ini, 18:00", service: "Setrika Saja", weight: "3 kg", status: "Selesai" },
    { id: "ORD-003", customer: "Budi Santoso", received: "06 Mei 2026", estTime: "Lusa, 10:00", service: "Cuci Kering", weight: "7 kg", status: "Antre" },
    { id: "ORD-004", customer: "Dewi Lestari", received: "04 Mei 2026", estTime: "Kemarin, 12:00", service: "Cuci Komplit Express", weight: "2 kg", status: "Diambil" },
  ];

  const filtered = data.filter((item) =>
    item.customer.toLowerCase().includes(search.toLowerCase()) || 
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = (status) => {
    switch (status) {
      case "Selesai":
        return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
      case "Diproses":
        return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
      case "Antre":
        return "bg-sky-100 text-sky-700 ring-1 ring-sky-200";
      case "Diambil":
        return "bg-[#E8F8F5] text-[#17A589] ring-1 ring-[#A3DDD0]";
      default:
        return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F3] p-6 font-sans text-[#1A2E35]">
      <div className="max-w-6xl mx-auto space-y-7">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-[#E0EEEA]">
          <div className="flex items-center gap-4">
            <div className="bg-[#17A589] p-3 rounded-2xl shadow-lg shadow-[#17A589]/20 text-white">
              <HiClipboardList className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#1A2E35]">Daftar Order Laundry</h1>
              <p className="text-[#7F9E97] text-sm italic font-medium">Kelola antrean dan status cucian pelanggan</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/orders/add")}
            className="flex items-center justify-center gap-2 bg-[#17A589] hover:bg-[#138D75] text-white px-6 py-3 rounded-2xl font-bold transition-all hover:shadow-xl hover:shadow-[#17A589]/20 active:scale-95"
          >
            <HiPlus className="text-lg" />
            Buat Order Baru
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="flex justify-start">
          <div className="relative w-full md:w-[450px]">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7F9E97] text-xl" />
            <input
              type="text"
              placeholder="Cari nama pelanggan atau No. Order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#D5DBDB] focus:outline-none focus:ring-4 focus:ring-[#E8F8F5] focus:border-[#17A589] transition-all shadow-sm text-[#1A2E35]"
            />
          </div>
        </div>

        {/* SCHEDULE TABLE */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-[#E0EEEA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F0F4F3]/50 border-b border-[#E0EEEA]">
                  <th className="px-6 py-5 text-left text-xs font-bold text-[#7F9E97] uppercase tracking-wider">Pelanggan & No. Order</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-[#7F9E97] uppercase tracking-wider">Estimasi Selesai</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-[#7F9E97] uppercase tracking-wider">Layanan & Berat</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-[#7F9E97] uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-5 text-right text-xs font-bold text-[#7F9E97] uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0F4F3]">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#E8F8F5]/40 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#F0F4F3] rounded-full flex items-center justify-center text-[#7F9E97] group-hover:bg-[#17A589] group-hover:text-white transition-all shrink-0 border border-[#E0EEEA]">
                          <HiUser className="text-lg" />
                        </div>
                        <div>
                          <div className="text-[#1A2E35] font-bold">{item.customer}</div>
                          <div className="flex items-center gap-1 text-[#17A589] text-[11px] font-bold mt-0.5 opacity-70">
                            <HiTag /> {item.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#1A2E35] font-semibold">{item.estTime}</div>
                      <div className="flex items-center gap-1 text-[#7F9E97] text-xs mt-0.5">
                        <HiClock /> Masuk: {item.received}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[#17A589] font-bold text-xs px-3 py-1 bg-[#E8F8F5] rounded-lg border border-[#A3DDD0] inline-block">
                        {item.service}
                      </span>
                      <div className="text-[#7F9E97] text-[11px] font-bold mt-1.5 ml-1 uppercase tracking-tighter">
                        Berat: {item.weight}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1.5 text-[10px] rounded-full font-black uppercase tracking-widest ${statusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-3 font-bold text-xs">
                        <button className="text-[#7F9E97] hover:text-[#17A589] transition-colors">DETAIL</button>
                        <span className="text-[#E0EEEA]">|</span>
                        <button className="text-[#7F9E97] hover:text-emerald-600 transition-colors">UPDATE</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EMPTY STATE */}
          {filtered.length === 0 && (
            <div className="text-center py-20 bg-white">
              <div className="bg-[#F0F4F3] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiClipboardList className="text-4xl text-[#7F9E97]" />
              </div>
              <h3 className="text-[#1A2E35] font-bold">Order tidak ditemukan</h3>
              <p className="text-[#7F9E97] text-sm mt-1 font-medium">Coba masukkan nama atau nomor order yang berbeda.</p>
            </div>
          )}
        </div>

        {/* SUMMARY INFO CARD */}
        <div className="bg-gradient-to-r from-[#0D2D26] to-[#17A589] rounded-[2rem] p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-xl shadow-[#17A589]/20">
          <div className="space-y-1 text-center md:text-left mb-4 md:mb-0">
            <p className="text-[#A3DDD0] text-xs font-bold uppercase tracking-widest">Ringkasan Operasional</p>
            <h4 className="text-xl font-bold">Sistem memantau {data.length} antrean cucian.</h4>
          </div>
          <div className="flex gap-4">
             <div className="text-center bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/10 min-w-[80px]">
                <span className="block text-2xl font-black text-white">1</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A3DDD0]">Antre</span>
             </div>
             <div className="text-center bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/10 min-w-[80px]">
                <span className="block text-2xl font-black text-white">1</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A3DDD0]">Proses</span>
             </div>
             <div className="text-center bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/10 min-w-[80px]">
                <span className="block text-2xl font-black text-white">2</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A3DDD0]">Ready</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}