import { HiStar, HiGift, HiFire, HiBadgeCheck, HiChevronRight } from "react-icons/hi";
import { MdOutlineCardGiftcard, MdOutlineWorkspacePremium } from "react-icons/md";

export default function Loyalty() {
  const topMembers = [
    { name: "Siti Aisyah", pts: 450, tier: "Platinum", orders: 24, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Budi Santoso", pts: 320, tier: "Gold", orders: 18, color: "text-amber-600", bg: "bg-amber-50" },
    { name: "Andi Saputra", pts: 150, tier: "Silver", orders: 9, color: "text-slate-500", bg: "bg-slate-50" },
  ];

  return (
    <div className="p-6 bg-[#F8FAFB] min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <span className="p-2 bg-amber-500 rounded-xl text-white shadow-lg shadow-amber-200">
                <HiStar />
              </span>
              Loyalty Program
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Apresiasi pelanggan setia Netto Laundry.</p>
          </div>
          <button className="hidden md:flex items-center gap-2 bg-[#1A2E35] text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-slate-200">
            <HiGift className="text-lg" /> Tukar Poin Manual
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Dashboard Poin Utama */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-[#0D2D26] via-[#16A085] to-[#1ABC9C] p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
              {/* Dekorasi Background */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-all duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <HiFire className="text-orange-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Pool Poin Terakumulasi</span>
                </div>
                <h2 className="text-5xl font-black flex items-end gap-2">
                  1.250 <span className="text-sm font-medium opacity-70 mb-2">Poin Tersedia</span>
                </h2>
                <div className="mt-8 flex flex-col md:flex-row gap-4 items-center">
                  <button className="w-full md:w-auto bg-white text-[#0D2D26] px-8 py-3 rounded-2xl font-black text-sm hover:bg-amber-400 hover:text-white transition-all shadow-lg">
                    Lihat Katalog Hadiah
                  </button>
                  <p className="text-xs opacity-70 font-medium italic">
                    *Terdapat 12 pelanggan yang bisa klaim hadiah hari ini.
                  </p>
                </div>
              </div>
            </div>

            {/* Pencapaian Hadiah (Progress) */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                <MdOutlineCardGiftcard className="text-xl text-[#1ABC9C]" /> Hadiah Terpopuler
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-slate-600">Diskon 50% (Min. 500 Pts)</span>
                    <span className="text-sm font-black text-[#1ABC9C]">80% Terisi</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-[#1ABC9C] h-full" style={{ width: "80%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-slate-600">Free Cuci Selimut (Min. 1000 Pts)</span>
                    <span className="text-sm font-black text-slate-400">45% Terisi</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-slate-300 h-full" style={{ width: "45%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard / Pelanggan Teraktif */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-800">Top Members</h3>
                <span className="text-[10px] font-bold text-[#1ABC9C] uppercase tracking-wider bg-[#E8F8F5] px-2 py-1 rounded-lg">Bulan Mei</span>
              </div>
              
              <div className="space-y-4">
                {topMembers.map((member, i) => (
                  <div key={i} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${member.bg} ${member.color} shadow-sm`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-slate-800 flex items-center gap-1">
                        {member.name} {i === 0 && <HiBadgeCheck className="text-[#1ABC9C]" />}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{member.tier}</span>
                         <span className="text-[10px] text-slate-300">•</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{member.orders} Orders</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-[#1ABC9C]">{member.pts}</span>
                      <p className="text-[9px] font-bold text-slate-300 uppercase">Pts</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-[#1ABC9C] transition-all">
                Lihat Semua Pelanggan <HiChevronRight />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}