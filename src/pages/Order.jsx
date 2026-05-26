import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HiClipboardList, 
  HiSearch, 
  HiPlus, 
  HiClock, 
  HiUser,
  HiTag,
  HiX,
  HiUserAdd,
  HiBadgeCheck
} from "react-icons/hi";

export default function Orders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  
  // State untuk mengontrol Modal Pemilihan Pelanggan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");

  // DATABASE MEMBER DUMMY (Sinkron dengan halaman /members)
  const memberDatabase = useMemo(() => [
    { id: "MBR-001", name: "Andi Saputra", phone: "081234567890", tier: "Silver" },
    { id: "MBR-002", name: "Siti Aisyah", phone: "085298765432", tier: "Platinum" },
    { id: "MBR-003", name: "Budi Santoso", phone: "082177665544", tier: "Gold" },
    { id: "MBR-004", name: "Dewi Lestari", phone: "081399887766", tier: "Silver" },
    { id: "MBR-005", name: "Rian Hidayat", phone: "087711223344", tier: "Regular" },
  ], []);

  // Data transaksi laundry aktif
  const data = useMemo(() => [
    { id: "ORD-001", customer: "Andi Saputra", received: "05 Mei 2026", estTime: "Besok, 14:00", service: "Cuci Komplit", weight: "5 kg", status: "Diproses" },
    { id: "ORD-002", customer: "Siti Aisyah", received: "05 Mei 2026", estTime: "Hari ini, 18:00", service: "Setrika Saja", weight: "3 kg", status: "Selesai" },
    { id: "ORD-003", customer: "Budi Santoso", received: "06 Mei 2026", estTime: "Lusa, 10:00", service: "Cuci Kering", weight: "7 kg", status: "Antre" },
    { id: "ORD-004", customer: "Dewi Lestari", received: "04 Mei 2026", estTime: "Kemarin, 12:00", service: "Cuci Komplit Express", weight: "2 kg", status: "Diambil" },
  ], []);

  // Filter untuk tabel transaksi utama
  const filtered = data.filter((item) =>
    item.customer.toLowerCase().includes(search.toLowerCase()) || 
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  // Filter untuk pencarian member di dalam Modal
  const filteredMembers = memberDatabase.filter((member) =>
    member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.phone.includes(memberSearch)
  );

  const statusStyle = (status) => {
    switch (status) {
      case "Selesai": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Diproses": return "bg-blue-600 text-white border-transparent";
      case "Antre": return "bg-slate-300 text-slate-700 border-transparent";
      case "Diambil": return "bg-slate-100 text-slate-500 border-slate-200/60";
      default: return "bg-slate-50 text-slate-600 border-slate-200/60";
    }
  };

  const summary = useMemo(() => {
    return data.reduce((acc, item) => {
      if (item.status === "Antre") acc.antre++;
      else if (item.status === "Diproses") acc.proses++;
      else if (item.status === "Selesai" || item.status === "Diambil") acc.ready++;
      return acc;
    }, { antre: 0, proses: 0, ready: 0 });
  }, [data]);

  // Handler saat member dipilih -> teruskan data ke form order baru
  const handleSelectMember = (member) => {
    setIsModalOpen(false);
    setMemberSearch("");
    navigate("/orders/add", { state: { selectedMember: member } });
  };

  // Handler jika pelanggan baru / walk-in tanpa member
  const handleNewCustomer = () => {
    setIsModalOpen(false);
    setMemberSearch("");
    navigate("/orders/add", { state: { selectedMember: null } });
  };

  return (
    <div className="w-full min-h-screen bg-transparent p-1 md:p-6 text-[#0F172A] antialiased font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-0.5">
            <h1 className="text-3xl font-black tracking-tight text-slate-800 italic uppercase">
              LAUNDRY <span className="text-blue-600 font-black not-italic">ORDERS</span>
            </h1>
            <p className="text-xs font-bold text-slate-400">
              Pantau setiap inci proses laundry kamu. Kelola antrean dan status pengerjaan pakaian.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-5 py-3 rounded-2xl shadow-md shadow-blue-100 transition-all cursor-pointer active:scale-95 uppercase tracking-wider"
          >
            <HiPlus size={16} />
            Buat Order Baru
          </button>
        </div>

        {/* SEARCH BAR & FILTER CONTROL */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-xs">
          <div className="relative w-full max-w-md">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Cari nama pelanggan atau nomor order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-bold"
            />
          </div>
          <div className="text-[11px] font-black text-slate-400 hidden sm:block mr-2 uppercase tracking-wide">
            Menampilkan {filtered.length} dari {data.length} Transaksi
          </div>
        </div>

        {/* DATA TABLE WORKSPACE */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-50 text-slate-400 uppercase tracking-widest font-black text-[9px]">
                  <th className="px-6 py-4">Pelanggan & No. Order</th>
                  <th className="px-6 py-4">Estimasi Selesai</th>
                  <th className="px-6 py-4">Layanan & Berat</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50 text-slate-700 font-bold">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-100 shadow-xs">
                          <HiUser size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-800">{item.customer}</div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 mt-0.5">
                            <HiTag size={12} /> {item.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-800">{item.estTime}</div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 font-medium">
                        <HiClock size={12} /> Masuk: {item.received}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-slate-600 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md uppercase tracking-wide">
                        {item.service}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1.5 font-medium tracking-wide">
                        Berat: <span className="text-slate-600 font-black">{item.weight}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block text-[9px] font-black px-2.5 py-0.5 rounded-md border tracking-wider uppercase ${statusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2.5 text-[11px] font-black">
                        <button className="text-slate-400 hover:text-slate-800 transition-colors cursor-pointer">DETAIL</button>
                        <span className="text-slate-200 font-normal">|</span>
                        <button className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">UPDATE</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EMPTY STATE */}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-[2rem]">
              <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-slate-100">
                <HiClipboardList size={22} className="text-slate-400" />
              </div>
              <h3 className="text-xs font-black text-slate-800">Order tidak ditemukan</h3>
              <p className="text-slate-400 text-[11px] mt-0.5 font-medium">Coba ganti kata kunci nama atau nomor urut nota.</p>
            </div>
          )}
        </div>

        {/* SUMMARY STATS BOARD */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-0.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metrik Operasional</p>
            <h4 className="text-xs font-bold text-slate-500">Memantau total pengerjaan aktif di dalam sistem antrean.</h4>
          </div>
          <div className="flex gap-3 w-full sm:w-auto justify-center">
            {[
              { count: summary.antre, label: "Antre", color: "text-slate-600 bg-slate-100 border-transparent" },
              { count: summary.proses, label: "Cuci", color: "text-white bg-blue-600 border-transparent" },
              { count: summary.ready, label: "Ready", color: "text-emerald-600 bg-emerald-50 border-emerald-100" }
            ].map((box, i) => (
              <div key={i} className={`px-4 py-2 rounded-xl border min-w-[80px] text-center shadow-xs ${box.color}`}>
                <span className="block text-base font-black tracking-tight">{box.count}</span>
                <span className="text-[9px] uppercase font-black tracking-wider opacity-90">{box.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* MODAL SEARCH MEMBER / INTERACTIVE SELECTOR */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-all animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Pilih Pelanggan</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-bold">Cari member terdaftar atau buat order pelanggan baru.</p>
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); setMemberSearch(""); }}
                className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <HiX size={16} />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 bg-slate-50/60 border-b border-slate-100 shrink-0">
              <div className="relative">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  type="text"
                  placeholder="Masukkan nama member atau nomor HP..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl border border-slate-100 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 font-bold"
                  autoFocus
                />
              </div>
            </div>

            {/* Member List Results (Scrollable) */}
            <div className="overflow-y-auto p-4 flex-1 space-y-2 max-h-[350px]">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1 mb-1">Hasil Pencarian Member</p>
              
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => handleSelectMember(member)}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-blue-50 hover:border-blue-100 group transition-all cursor-pointer font-bold text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                      <HiUser size={16} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 group-hover:text-blue-700 transition-colors">{member.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{member.phone} • {member.id}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase tracking-wide group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {member.tier}
                  </span>
                </div>
              ))}

              {filteredMembers.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs font-bold">
                  Member tidak ditemukan dengan kata kunci tersebut.
                </div>
              )}
            </div>

            {/* Modal Bottom Action (For New Customers) */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
              <button
                onClick={handleNewCustomer}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black px-4 py-3 rounded-2xl shadow-xs transition-all cursor-pointer active:scale-98 uppercase tracking-wider"
              >
                <HiUserAdd size={16} />
                Bukan Member? Isi Detail Manual
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}