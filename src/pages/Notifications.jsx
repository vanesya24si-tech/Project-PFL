import { useState } from "react";
import { HiBell, HiClock, HiCheck, HiTrash, HiDotsVertical } from "react-icons/hi";
import { MdOutlineShoppingBag, MdOutlineWarningAmber, MdOutlineAssignmentTurnedIn } from "react-icons/md";

export default function Notifications() {
  const [filter, setFilter] = useState("Semua");

  const alerts = [
    { 
      id: 1,
      title: "Pesanan Baru", 
      desc: "Andi Saputra baru saja membuat order Cuci Komplit Express.", 
      time: "2 Menit lalu", 
      type: "order",
      unread: true,
      icon: <MdOutlineShoppingBag />,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      id: 2,
      title: "Stok Menipis", 
      desc: "Deterjen Cair Rose tinggal 1.5 Liter. Segera lakukan restok!", 
      time: "1 Jam lalu", 
      type: "warning",
      unread: true,
      icon: <MdOutlineWarningAmber />,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    { 
      id: 3,
      title: "Order Selesai", 
      desc: "Cucian ORD-092 (Siti Aisyah) siap diambil di rak.", 
      time: "3 Jam lalu", 
      type: "done",
      unread: false,
      icon: <MdOutlineAssignmentTurnedIn />,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
  ];

  const filteredAlerts = filter === "Semua" ? alerts : alerts.filter(a => a.type === filter.toLowerCase());

  return (
    <div className="p-6 bg-[#F8FAFB] min-h-screen font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <span className="p-2 bg-[#1ABC9C] rounded-xl text-white shadow-lg shadow-[#1ABC9C]/20">
                <HiBell />
              </span>
              Pusat Notifikasi
            </h1>
            <p className="text-slate-500 text-sm mt-1">Anda memiliki {alerts.filter(a => a.unread).length} pesan belum terbaca.</p>
          </div>
          
          <button className="flex items-center gap-2 text-sm font-bold text-[#1ABC9C] hover:bg-[#E8F8F5] px-4 py-2 rounded-xl transition-all">
            <HiCheck className="text-lg" /> Tandai Semua Terbaca
          </button>
        </div>

        {/* Tabs Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["Semua", "Order", "Warning", "Done"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filter === tab 
                ? "bg-[#1A2E35] text-white shadow-md" 
                : "bg-white text-slate-500 border border-slate-100 hover:border-[#1ABC9C]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {filteredAlerts.map((a) => (
            <div 
              key={a.id} 
              className={`group relative bg-white p-5 rounded-[2rem] border transition-all hover:shadow-md flex gap-5 items-start ${
                a.unread ? "border-[#1ABC9C]/30 shadow-sm" : "border-slate-100 opacity-80"
              }`}
            >
              {/* Status Indicator */}
              {a.unread && (
                <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-[#1ABC9C] rounded-full ring-4 ring-[#E8F8F5]" />
              )}

              {/* Icon Container */}
              <div className={`p-4 rounded-2xl text-2xl shrink-0 ${a.bg} ${a.color}`}>
                {a.icon}
              </div>

              {/* Content */}
              <div className="flex-1 pr-4">
                <div className="flex justify-between items-start">
                  <h4 className={`font-black text-lg ${a.unread ? "text-slate-800" : "text-slate-600"}`}>
                    {a.title}
                  </h4>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mt-1">
                  {a.desc}
                </p>
                
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                    <HiClock className="text-sm" /> {a.time}
                  </span>
                  <div className="h-1 w-1 bg-slate-300 rounded-full" />
                  <button className="text-[10px] font-bold text-[#1ABC9C] uppercase tracking-wider hover:underline">
                    Detail Pesanan
                  </button>
                </div>
              </div>

              {/* Hover Actions */}
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-red-500">
                  <HiTrash size={18} />
                </button>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                  <HiDotsVertical size={18} />
                </button>
              </div>
            </div>
          ))}

          {filteredAlerts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiBell className="text-4xl text-slate-200" />
              </div>
              <h3 className="text-slate-800 font-bold">Tidak ada notifikasi</h3>
              <p className="text-slate-500 text-sm">Semua pemberitahuan di kategori ini sudah dibaca.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}