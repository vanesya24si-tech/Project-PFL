import { useMemo, useState, useEffect } from "react";
import { loadCustomers, getTopMembers, updateCustomer } from "../utils/customerStorage";
import { loadRedemptions, validateRedemption, redeemReward } from "../utils/loyaltyStorage";
import { HiStar, HiGift, HiFire, HiBadgeCheck, HiBell, HiChatAlt2, HiChevronRight, HiLightningBolt } from "react-icons/hi";
import { MdOutlineWorkspacePremium } from "react-icons/md";

const rewardCatalog = [
  { id: "discount", name: "Diskon 50%", points: 500, description: "Potongan harga untuk layanan berikutnya", badge: "Hampir Target" },
  { id: "free-wash", name: "Free Cuci Selimut", points: 1000, description: "Gratis satu layanan cuci selimut", badge: "Ready!" },
  { id: "express", name: "Express Priority", points: 1500, description: "Prioritas pengerjaan 3 jam", badge: "Premium" },
];

export default function Loyalty() {
  const [customers, setCustomers] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let active = true;
    async function fetchData() {
      try {
        const [custData, redData] = await Promise.all([
          loadCustomers(),
          loadRedemptions()
        ]);
        if (active) {
          setCustomers(custData || []);
          setRedemptions(redData || []);
        }
      } catch (err) {
        console.error("Gagal memuat pelanggan di Loyalty:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      active = false;
    };
  }, []);

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

  const handleRedeemReward = async (reward) => {
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

    const newPoints = currentPoints - requiredPoints;

    try {
      await redeemReward(selectedMember.id, currentPoints, reward);
      const [custData, redData] = await Promise.all([loadCustomers(), loadRedemptions()]);
      setCustomers(custData || []);
      setRedemptions(redData || []);
      setFeedback(`${reward.name} berhasil ditukar untuk ${selectedMember.name}. Poin tersisa ${newPoints}.`);
    } catch (err) {
      console.error("Gagal melakukan redeem reward ke Supabase:", err);
      setFeedback("Gagal menukar reward di database.");
    }
  };

  const handleValidate = async (id, status) => {
    try {
      await validateRedemption(id, status);
      const redData = await loadRedemptions();
      setRedemptions(redData || []);
      setFeedback(`Klaim reward berhasil di-${status === "approved" ? "setujui" : "tolak"}.`);
    } catch (err) {
      console.error("Gagal update klaim:", err);
      setFeedback("Gagal memproses klaim.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFDFF] p-4 md:p-8 text-[#0F172A] font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase">
              Loyalty <span className="text-blue-600 not-italic">Engine</span>
            </h1>
            <p className="text-slate-400 font-bold text-sm mt-1">Sistem otomatis buat pantau & kabarin pelanggan loyal Netto Laundry.</p>
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
                    <p className="text-base font-black leading-snug">{alert.msg}</p>
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
                <h2 className="text-7xl font-black italic my-4 tracking-tighter">{totalPoints.toLocaleString()} <span className="text-sm not-italic text-slate-500 tracking-normal">PTS</span></h2>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Member</p>
                    <p className="text-2xl font-black">{customers.length}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Klaim</p>
                    <p className="text-2xl font-black">{redemptions.length}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Pending</p>
                    <p className="text-2xl font-black">{redemptions.filter(r => r.status === 'pending').length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* KATALOG REWARD */}
            <div className="bg-white border border-slate-50 rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
                <div>
                  <h3 className="text-base font-black uppercase tracking-widest">Daftar Klaim Pelanggan</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">Validasi voucher yang ditukar oleh pelanggan dari HP mereka.</p>
                </div>
                <select
                  value={selectedMemberId}
                  onChange={(event) => {
                    setSelectedMemberId(event.target.value);
                    setFeedback("");
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none"
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
                {redemptions.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                    <p className="text-base font-bold text-slate-400">Belum ada klaim reward</p>
                  </div>
                ) : redemptions.map((redemption) => {
                  return (
                    <div key={redemption.id} className="p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm font-black text-slate-800 uppercase">{redemption.reward_name}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1">{redemption.customers?.name || "Pelanggan"} — {redemption.points_cost} Pts</p>
                          <p className="text-[10px] font-black text-blue-600 mt-2">
                            Status: <span className={redemption.status === 'pending' ? "text-amber-500" : redemption.status === 'approved' ? "text-green-500" : "text-rose-500"}>{redemption.status.toUpperCase()}</span>
                          </p>
                        </div>
                        {redemption.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleValidate(redemption.id, "approved")}
                              className="rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider bg-green-500 text-white hover:bg-green-600"
                            >
                              Setujui
                            </button>
                            <button
                              type="button"
                              onClick={() => handleValidate(redemption.id, "rejected")}
                              className="rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-600 hover:bg-rose-200"
                            >
                              Tolak
                            </button>
                          </div>
                        )}
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
                        <p className="text-sm font-black text-slate-700">{m.name}</p>
                      </div>
                      <p className="text-sm font-black text-blue-600">{m.points || 0} pts</p>
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