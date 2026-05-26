import { useState } from "react";
import { HiStar, HiGift, HiFire, HiBadgeCheck, HiBell, HiChatAlt2, HiChevronRight, HiLightningBolt } from "react-icons/hi";
import { MdOutlineWorkspacePremium } from "react-icons/md";

export default function Loyalty() {
  // DATA ACTION CENTER: Ini otak sistemnya, buat ngingetin admin
  const adminAlerts = [
    { 
      id: 1, 
      user: "Siti Aisyah", 
      type: "READY_TO_CLAIM", 
      msg: "Poin udah tembus 1.250! Kasih tau dia bisa tukar Free Cuci Selimut.",
      waLink: "https://wa.me/628123456789?text=Halo%20Siti%2C%20poin%20kamu%20udah%20cukup%20buat%20tukar%20Free%20Cuci%20Selimut%20lho!",
      color: "border-green-200 bg-green-50/50 text-green-600"
    },
    { 
      id: 2, 
      user: "Budi Santoso", 
      type: "ALMOST_THERE", 
      msg: "Dikit lagi! Kurang 30 poin (1x nyuci lagi) buat dapet Diskon 50%.",
      waLink: "https://wa.me/628123456789?text=Halo%20Budi%2C%20poin%20kamu%20dikit%20lagi%20bisa%20tukar%20Diskon%2050%%20nih!",
      color: "border-blue-200 bg-blue-50/50 text-blue-600"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#FDFDFF] p-4 md:p-8 text-[#0F172A] font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              Loyalty <span className="text-blue-600 not-italic">Engine</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs mt-1">Sistem otomatis buat pantau & kabarin pelanggan loyal Netto Laundry.</p>
          </div>
          <button className="bg-blue-600 text-white text-[10px] font-black px-6 py-4 rounded-2xl shadow-xl shadow-blue-200 uppercase tracking-widest active:scale-95 transition-all">
            + Tambah Reward Baru
          </button>
        </div>

        {/* --- ADMIN ACTION CENTER (Fitur yang Den Maksud) --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HiLightningBolt className="text-amber-500 animate-pulse" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tindakan Admin Diperlukan</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminAlerts.map((alert) => (
              <div key={alert.id} className={`rounded-[2rem] border-2 ${alert.color} p-6 flex flex-col justify-between gap-4 transition-transform hover:scale-[1.01]`}>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{alert.user}</p>
                    <p className="text-sm font-black leading-snug">{alert.msg}</p>
                  </div>
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <HiBell className="animate-swing" />
                  </div>
                </div>
                
                <a 
                  href={alert.waLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm hover:shadow-md transition-all border border-transparent hover:border-slate-100"
                >
                  <HiChatAlt2 size={16} /> Kabarin Via WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* STATS UTAMA */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-40 h-40 bg-blue-600 blur-[80px] opacity-40" />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-300">Total Poin Member Aktif</p>
                <h2 className="text-6xl font-black italic my-4 tracking-tighter">1.250 <span className="text-xs not-italic text-slate-500 tracking-normal">PTS</span></h2>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Member</p>
                    <p className="text-xl font-black">124</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Klaim</p>
                    <p className="text-xl font-black">18</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Voucher</p>
                    <p className="text-xl font-black">5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* KATALOG REWARD */}
            <div className="bg-white border border-slate-50 rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6">Program Reward Aktif</h3>
              <div className="space-y-4">
                {[
                  { name: "Diskon 50%", pts: "500 Pts", prog: 80, tag: "Hampir Target" },
                  { name: "Free Cuci Selimut", pts: "1000 Pts", prog: 100, tag: "Ready!" }
                ].map((r, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl flex items-center justify-between border border-transparent hover:border-blue-100 transition-all">
                    <div>
                      <p className="text-xs font-black text-slate-800 uppercase">{r.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">{r.pts}</p>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <p className={`text-[10px] font-black uppercase ${r.prog === 100 ? 'text-green-600' : 'text-blue-600'}`}>{r.prog}%</p>
                          <span className="text-[9px] font-bold text-slate-400">{r.tag}</span>
                       </div>
                       <HiChevronRight className="text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
             <div className="bg-white border border-slate-50 rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
                    <HiBadgeCheck size={20} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Top Member</h3>
                </div>
                <div className="space-y-4">
                  {["Siti Aisyah", "Budi Santoso", "Andi Saputra"].map((name, i) => (
                    <div key={i} className="flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        <div className="text-[10px] font-black text-slate-300 group-hover:text-blue-600">0{i+1}</div>
                        <p className="text-xs font-black text-slate-700">{name}</p>
                      </div>
                      <p className="text-xs font-black text-blue-600">{1250 - (i*300)} pts</p>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-blue-50/50 rounded-[2rem] p-8 border border-blue-100">
                <p className="text-[10px] font-black uppercase text-blue-600 mb-2">Tips Hari Ini</p>
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">
                  "Pelanggan 2x lebih mungkin balik lagi kalau kamu chat mereka pas poinnya sisa sedikit lagi buat dapet hadiah."
                </p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}