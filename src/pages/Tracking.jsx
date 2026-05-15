import { HiLocationMarker, HiClock, HiCheckCircle, HiChevronRight } from "react-icons/hi";
import { MdLocalLaundryService, MdIron, MdLocalShipping } from "react-icons/md";

export default function Tracking() {
  const tracks = [
    { 
      id: "ORD-001", 
      user: "Andi Saputra", 
      status: "Pencucian", 
      detail: "Baju sedang berada di dalam mesin cuci nomor 04",
      progress: 35,
      eta: "14:30",
      icon: <MdLocalLaundryService />
    },
    { 
      id: "ORD-003", 
      user: "Budi Santoso", 
      status: "Finishing", 
      detail: "Proses setrika uap dan pelipatan pakaian",
      progress: 80,
      eta: "11:00",
      icon: <MdIron />
    },
    { 
      id: "ORD-005", 
      user: "Rina Maria", 
      status: "Siap Diambil", 
      detail: "Cucian sudah rapi di rak pengambilan A-12",
      progress: 100,
      eta: "Selesai",
      icon: <HiCheckCircle />
    },
  ];

  return (
    <div className="p-6 bg-[#F8FAFB] min-h-screen font-sans">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-black text-[#1A2E35] flex items-center gap-3">
          <div className="p-2 bg-[#1ABC9C] rounded-xl text-white shadow-lg shadow-[#1ABC9C]/20">
            <HiLocationMarker />
          </div>
          Live Tracking
        </h1>
        <p className="text-[#7F9E97] mt-2 text-sm font-medium">Pantau real-time posisi cucian pelanggan di area workshop.</p>
      </div>

      {/* Stats Overview */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Antrean", val: 5, color: "bg-slate-500" },
          { label: "Proses", val: 3, color: "bg-amber-500" },
          { label: "Selesai", val: 12, color: "bg-[#1ABC9C]" },
          { label: "Total", val: 20, color: "bg-[#0D2D26]" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-[#7F9E97] uppercase tracking-wider">{item.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-xl font-black text-[#1A2E35]">{item.val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tracking Cards */}
      <div className="max-w-4xl mx-auto space-y-6">
        {tracks.map((t) => (
          <div key={t.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#1ABC9C]/5 transition-all p-6 relative overflow-hidden">
            
            {/* Top Info */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                  t.progress === 100 ? "bg-[#1ABC9C] text-white" : "bg-[#E8F8F5] text-[#1ABC9C]"
                }`}>
                  {t.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-[#1ABC9C] bg-[#E8F8F5] px-2 py-0.5 rounded-lg border border-[#1ABC9C]/20 uppercase tracking-tighter">
                      {t.id}
                    </span>
                    <span className="text-[#7F9E97] text-xs flex items-center gap-1 font-medium">
                      <HiClock /> ETA: {t.eta}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A2E35] mt-0.5">{t.user}</h3>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl border ${
                  t.progress === 100 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-white text-[#1ABC9C] border-slate-100"
                }`}>
                  {t.status}
                </span>
              </div>
            </div>

            {/* Detail & Progress */}
            <div className="space-y-4">
              <p className="text-sm text-[#7F9E97] font-medium italic">
                "{t.detail}"
              </p>
              
              <div className="relative pt-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                  <span>Antre</span>
                  <span>Cuci</span>
                  <span>Setrika</span>
                  <span>Ready</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-gradient-to-r from-[#1ABC9C] to-[#16A085] h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${t.progress}%` }} 
                  />
                </div>
                {/* Checkpoint Indicators */}
                <div className="absolute top-[26px] w-full flex justify-between px-1">
                  {[0, 33, 66, 100].map((pos) => (
                    <div key={pos} className={`w-2 h-2 rounded-full border-2 border-white ${t.progress >= pos ? "bg-[#1ABC9C]" : "bg-slate-300"}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Hover Action */}
            <button className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-all bg-[#1A2E35] text-white p-2 rounded-xl flex items-center gap-2 text-xs font-bold">
              Detail Order <HiChevronRight />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}