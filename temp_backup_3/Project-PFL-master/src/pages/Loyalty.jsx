import { useMemo, useState } from "react";
import { loadCustomers, getTopMembers, saveCustomers } from "../utils/customerStorage";
import { HiStar, HiGift, HiFire, HiBadgeCheck, HiBell, HiChatAlt2, HiChevronRight, HiLightningBolt } from "react-icons/hi";
import { MdOutlineWorkspacePremium } from "react-icons/md";

const rewardCatalog = [
  { id: "discount", name: "Diskon 50%", points: 500, description: "Potongan harga untuk layanan berikutnya", badge: "Hampir Target" },
  { id: "free-wash", name: "Free Cuci Selimut", points: 1000, description: "Gratis satu layanan cuci selimut", badge: "Ready!" },
  { id: "express", name: "Express Priority", points: 1500, description: "Prioritas pengerjaan 3 jam", badge: "Premium" },
];

export default function Loyalty() {
  const [customers, setCustomers] = useState(() => loadCustomers());
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [feedback, setFeedback] = useState("");

  const totalPoints = useMemo(() => customers.reduce((s, c) => s + (Number(c.points) || 0), 0), [customers]);
  const topMembers = useMemo(() => getTopMembers(3, "points", customers), [customers]);

  const selectedMember = useMemo(() => {
    if (selectedMemberId) {
      return customers.find((item) => item.id?.toString() === selectedMemberId?.toString()) || null;
    }
    return topMembers[0] || null;
  }, [customers, selectedMemberId, topMembers]);

  const adminAlerts = topMembers.map((m, i) => ({
    id: i + 1,
    user: m.name,
    type: m.points > 1000 ? "READY_TO_CLAIM" : "ALMOST_THERE",
    msg: m.points > 1000 ? `Poin ${m.points} — siap klaim reward.` : `Poin ${m.points} — dukung agar segera mencapai reward.`,
    waLink: `https://wa.me/628123456789?text=Halo%20${encodeURIComponent(m.name)}%2C%20poin%20kamu%20sekarang%20${m.points}.`,
    color: m.points > 1000 ? "border-green-200 bg-green-50/50 text-green-600" : "border-blue-200 bg-blue-50/50 text-blue-600"
  }));

  const handleRedeemReward = (reward) => {
    if (!selectedMember) {
      setFeedback("Pilih member terlebih dahulu sebelum menukar reward.");
      return;
    }

    const requiredPoints = Number(reward.points);
    const currentPoints = Number(selectedMember.points || 0);

    if (currentPoints < requiredPoints) {
      setFeedback(`${selectedMember.name} belum cukup poin untuk menukar ${reward.name}.`);
      return;
    }

    const updatedCustomers = customers.map((customer) => {
      if (customer.id?.toString() !== selectedMember.id?.toString()) return customer;

      const newPoints = currentPoints - requiredPoints;
      return {
        ...customer,
        points: newPoints,
        rewardHistory: [
          ...(customer.rewardHistory || []),
          {
            rewardName: reward.name,
            pointsUsed: requiredPoints,
            redeemedAt: new Date().toLocaleString("id-ID"),
          },
        ],
      };
    });

    setCustomers(updatedCustomers);
    saveCustomers(updatedCustomers);
    setFeedback(`${reward.name} berhasil ditukar untuk ${selectedMember.name}. Poin tersisa ${currentPoints - requiredPoints}.`);
  };

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
          <div className="text-right text-[10px] font-bold text-slate-500">
            <p className="uppercase tracking-[0.2em]">Member dipilih</p>
            <p className="mt-1 text-slate-800 font-black">{selectedMember ? selectedMember.name : "Belum ada data"}</p>
          </div>
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
                <h2 className="text-6xl font-black italic my-4 tracking-tighter">{totalPoints.toLocaleString()} <span className="text-xs not-italic text-slate-500 tracking-normal">PTS</span></h2>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Member</p>
                    <p className="text-xl font-black">{customers.length}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Klaim</p>
                    <p className="text-xl font-black">-</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Voucher</p>
                    <p className="text-xl font-black">-</p>
                  </div>
                </div>
              </div>
            </div>

            {/* KATALOG REWARD */}
            <div className="bg-white border border-slate-50 rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">Program Reward Aktif</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">Pilih member lalu tukarkan reward dengan poin yang tersedia.</p>
                </div>
                <select
                  value={selectedMemberId}
                  onChange={(event) => {
                    setSelectedMemberId(event.target.value);
                    setFeedback("");
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 outline-none"
                >
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} — {Number(customer.points || 0)} pts
                    </option>
                  ))}
                </select>
              </div>

              {feedback && (
                <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-[11px] font-bold text-blue-700">
                  {feedback}
                </div>
              )}

              <div className="space-y-4">
                {rewardCatalog.map((reward) => {
                  const isAffordable = (selectedMember?.points || 0) >= reward.points;
                  return (
                    <div key={reward.id} className="p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase">{reward.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1">{reward.description}</p>
                          <p className="text-[10px] font-black text-blue-600 mt-2">{reward.points} Pts</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`text-[10px] font-black uppercase ${isAffordable ? "text-green-600" : "text-slate-500"}`}>{isAffordable ? "Bisa ditukar" : "Belum cukup"}</p>
                            <span className="text-[9px] font-bold text-slate-400">{reward.badge}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRedeemReward(reward)}
                            disabled={!selectedMember || !isAffordable}
                            className={`rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-wider transition-all ${isAffordable ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}
                          >
                            Tukar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                  {topMembers.map((m, i) => (
                    <div key={i} className="flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        <div className="text-[10px] font-black text-slate-300 group-hover:text-blue-600">0{i+1}</div>
                        <p className="text-xs font-black text-slate-700">{m.name}</p>
                      </div>
                      <p className="text-xs font-black text-blue-600">{m.points || 0} pts</p>
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