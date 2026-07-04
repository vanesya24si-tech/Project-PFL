import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { loadCustomers } from "../../utils/customerStorage";
import { redeemReward } from "../../utils/loyaltyStorage";
import {
  HiGift,
  HiStar,
  HiCheckCircle,
  HiLockClosed,
  HiSparkles,
} from "react-icons/hi";

const REWARDS = [
  { id: "R1", name: "Diskon 10%", points: 100, desc: "Untuk 1x cucian berikutnya", color: "from-blue-500 to-blue-600" },
  { id: "R2", name: "Cuci Gratis 2 Kg", points: 250, desc: "Paket regular max 2 Kg", color: "from-indigo-500 to-indigo-600" },
  { id: "R3", name: "Diskon 25%", points: 500, desc: "Untuk total tagihan berikutnya", color: "from-violet-500 to-purple-600" },
  { id: "R4", name: "Free Express", points: 800, desc: "Layanan Express 6 Jam gratis", color: "from-rose-500 to-pink-600" },
  { id: "R5", name: "Member Premium", points: 1500, desc: "Upgrade tier ke Premium 1 bulan", color: "from-amber-500 to-orange-500" },
];

export default function UserLoyalty() {
  const { user } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [feedback, setFeedback] = useState("");

  const phone = user?.user_metadata?.phone || "";
  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "";

  useEffect(() => {
    let active = true;
    async function fetchCustomer() {
      try {
        const customers = await loadCustomers();
        const found = customers.find(
          (c) =>
            (phone && c.phone?.replace(/\D/g, "") === phone?.replace(/\D/g, "")) ||
            (name && c.name?.toLowerCase() === name?.toLowerCase())
        );
        if (active) setCustomer(found || null);
      } catch (err) {
        console.error("Gagal memuat data loyalty:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchCustomer();
    return () => { active = false; };
  }, [phone, name]);

  const handleRedeem = async (reward) => {
    if (!customer || customer.points < reward.points) return;
    if (redeeming) return;
    setRedeeming(reward.id);
    setFeedback("");
    try {
      const { newPoints } = await redeemReward(customer.id, customer.points, reward);
      setCustomer((prev) => ({ ...prev, points: newPoints }));
      setFeedback(`✅ Berhasil! ${reward.name} sudah diklaim. Sisa poin: ${newPoints}`);
    } catch (err) {
      setFeedback("❌ Gagal menukar poin. Coba lagi.");
    } finally {
      setRedeeming(null);
    }
  };

  const currentPoints = customer?.points || 0;
  const nextReward = REWARDS.find((r) => r.points > currentPoints);

  return (
    <div className="space-y-4">
      {/* POINTS CARD — premium gradient with shimmer orbs */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden">
        {/* Shimmer orb decorations */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full blur-md" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl" />
        <div className="absolute bottom-4 left-1/2 w-16 h-16 bg-blue-300/10 rounded-full blur-lg" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <HiGift size={14} className="text-blue-100" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">
              Program Loyalitas
            </p>
          </div>

          <p className="text-7xl font-black mb-1 tracking-tight drop-shadow-sm">
            {loading ? (
              <span className="text-4xl text-blue-200 animate-pulse">···</span>
            ) : (
              currentPoints.toLocaleString("id-ID")
            )}
          </p>
          <p className="text-sm font-bold text-blue-200 mb-4">Poin Terkumpul</p>

          {customer && (
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5">
              <HiStar size={12} className="text-yellow-300" />
              <span className="text-[10px] font-black">{customer.segment || "Regular"} Member</span>
            </div>
          )}
        </div>
      </div>

      {/* PROGRESS TO NEXT REWARD — glassmorphism card */}
      {nextReward && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
            Menuju Reward Berikutnya
          </p>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-black text-slate-700">{nextReward.name}</p>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
              {nextReward.points.toLocaleString("id-ID")} poin
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, (currentPoints / nextReward.points) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-2">
            Butuh <span className="text-blue-600 font-black">{nextReward.points - currentPoints}</span> poin lagi
          </p>
        </div>
      )}

      {/* FEEDBACK BANNER — frosted glass */}
      {feedback && (
        <div
          className={`rounded-2xl px-4 py-3.5 text-sm font-bold backdrop-blur-xl border flex items-center gap-2 ${
            feedback.startsWith("✅")
              ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/60 shadow-sm shadow-emerald-100"
              : "bg-rose-50/80 text-rose-700 border-rose-200/60 shadow-sm shadow-rose-100"
          }`}
        >
          {feedback}
        </div>
      )}

      {/* REWARD LIST */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">
          Daftar Reward
        </p>
        <div className="space-y-3">
          {REWARDS.map((reward) => {
            const canAfford = currentPoints >= reward.points;
            const isRedeeming = redeeming === reward.id;
            return (
              <div
                key={reward.id}
                className={`bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-4 flex items-center justify-between transition-all ${
                  !canAfford ? "opacity-60" : "hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${reward.color} rounded-2xl flex items-center justify-center shrink-0 shadow-md`}>
                    <HiSparkles size={20} className="text-white drop-shadow" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{reward.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{reward.desc}</p>
                    <span className="inline-block mt-1 text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      {reward.points.toLocaleString("id-ID")} poin
                    </span>
                  </div>
                </div>

                {canAfford && !redeeming ? (
                  <button
                    onClick={() => handleRedeem(reward)}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 transition-all"
                  >
                    <HiCheckCircle size={12} /> Tukar
                  </button>
                ) : isRedeeming ? (
                  <button
                    disabled
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 opacity-70"
                  >
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </button>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide bg-slate-100 text-slate-400 cursor-not-allowed">
                    <HiLockClosed size={12} /> Belum
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* INFO BOX — blue frosted glass */}
      <div className="bg-blue-500/10 backdrop-blur-xl rounded-2xl p-4 border border-blue-200/40 shadow-sm">
        <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1.5">💡 Info Poin</p>
        <p className="text-[10px] text-blue-600 font-medium leading-relaxed">
          Dapatkan <strong>1 poin</strong> setiap belanja Rp 1.000. Poin bisa ditukar dengan reward eksklusif di atas.
        </p>
      </div>
    </div>
  );
}
