import { HiStar, HiGift, HiFire, HiBadgeCheck, HiChevronRight } from "react-icons/hi";
import { MdOutlineCardGiftcard, MdOutlineWorkspacePremium } from "react-icons/md";

export default function Loyalty() {
  const loyaltyStats = [
    { title: "Poin Total", value: "1.250", label: "Poin aktif" },
    { title: "Member Aktif", value: "124", label: "Pelanggan setia" },
    { title: "Pengklaiman", value: "18", label: "Hadiah diklaim" },
  ];

  const loyaltyRewards = [
    { title: "Diskon 50%", description: "Min. 500 poin", progress: 80, badge: "Best Seller" },
    { title: "Free Cuci Selimut", description: "Min. 1000 poin", progress: 45, badge: "Limited" },
    { title: "Voucher Setrika", description: "Min. 700 poin", progress: 62, badge: "Rekomendasi" },
  ];

  const topMembers = [
    { name: "Siti Aisyah", pts: 450, tier: "Platinum", orders: 24, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Budi Santoso", pts: 320, tier: "Gold", orders: 18, color: "text-amber-600", bg: "bg-amber-50" },
    { name: "Andi Saputra", pts: 150, tier: "Silver", orders: 9, color: "text-slate-500", bg: "bg-slate-50" },
  ];

  return (
    <div className="min-h-screen bg-[#EFFBF4] p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="rounded-[2.5rem] bg-white p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full bg-[#DCFCE7] px-4 py-2 text-sm font-semibold text-[#047857]">
                <HiStar className="text-xl" /> Loyalty Program
              </div>
              <div>
                <h1 className="text-4xl font-black text-[#0F172A]">Program Loyalitas Netto Laundry</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#475569]">Buat pelanggan setia terus kembali dengan reward poin, tier eksklusif, dan promo yang mudah diklaim.</p>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-3xl bg-[#10B981] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#10B981]/20 hover:bg-[#047857] transition">
              <HiGift className="text-lg" /> Tukar Poin
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[2.5rem] bg-gradient-to-br from-[#0F3B2F] via-[#14976B] to-[#22C55E] p-8 text-white shadow-xl overflow-hidden relative">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.24em] text-white/80">
                  <HiFire className="text-xl text-orange-300" /> Poin yang dapat ditukar
                </div>
                <h2 className="mt-6 text-5xl font-black">1.250</h2>
                <p className="mt-3 max-w-xl text-sm text-white/80">Tingkatkan loyalitas pelanggan dengan badge eksklusif dan reward otomatis setiap kali pelanggan kumpulkan poin.</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {loyaltyStats.map((stat) => (
                    <div key={stat.title} className="rounded-[1.75rem] bg-white/10 p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/70">{stat.title}</p>
                      <p className="mt-3 text-3xl font-black">{stat.value}</p>
                      <p className="mt-2 text-sm text-white/80">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-white p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-[#0F172A]">Rekomendasi Reward</h3>
                  <p className="mt-2 text-sm text-[#64748B]">Reward populer untuk pelanggan yang paling sering pakai layanan Anda.</p>
                </div>
                <span className="inline-flex rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#047857]">50% lebih cepat</span>
              </div>

              <div className="space-y-5">
                {loyaltyRewards.map((reward, index) => (
                  <div key={reward.title} className="rounded-[2rem] border border-slate-100 bg-[#F8FCF7] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black text-[#0F172A]">{reward.title}</p>
                        <p className="mt-1 text-xs text-[#64748B]">{reward.description}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase text-[#047857] shadow-sm">{reward.badge}</span>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-[#10B981]" style={{ width: `${reward.progress}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-[#475569]">
                      <span>{reward.progress}% Progress</span>
                      <button className="text-[#10B981] font-semibold">Lihat Detail</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2.5rem] bg-white p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F172A]">Tier Loyalitas</p>
                  <h3 className="mt-3 text-2xl font-black text-[#10B981]">Gold Member</h3>
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#ECFDF5] text-[#10B981] text-2xl">
                  <MdOutlineWorkspacePremium />
                </div>
              </div>
              <p className="text-sm leading-6 text-[#64748B]">Tingkatkan ke Platinum dengan menambah 320 poin lagi. Nikmati prioritas layanan, voucher eksklusif, dan diskon lebih besar.</p>
              <div className="mt-6 rounded-[1.75rem] bg-[#ECFDF5] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#047857] font-semibold">Target berikutnya</p>
                <p className="mt-3 text-lg font-black text-[#0F172A]">Platinum di 1.500 poin</p>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-white p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F172A]">Top Member Mei</p>
                  <p className="mt-1 text-xs text-[#64748B]">Pelanggan paling aktif bulan ini</p>
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#DCFCE7] text-[#047857] text-xl">
                  <HiBadgeCheck />
                </div>
              </div>

              <div className="space-y-4">
                {topMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-[#F8FAF8] p-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black ${member.bg} ${member.color}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-[#0F172A]">{member.name}</p>
                      <p className="text-[11px] text-[#64748B]">{member.tier} • {member.orders} order</p>
                    </div>
                    <p className="text-sm font-black text-[#10B981]">{member.pts} pts</p>
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full rounded-3xl bg-[#10B981] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#10B981]/20 hover:bg-[#047857] transition">
                Kelola Tier Loyalitas
              </button>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
