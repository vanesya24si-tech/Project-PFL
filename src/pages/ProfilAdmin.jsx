import { useState, useEffect } from "react";
import { HiUserCircle, HiBadgeCheck, HiKey, HiLogout, HiCog, HiFire, HiLightningBolt, HiMail, HiPhone, HiPencil, HiSave, HiX } from "react-icons/hi";
import { MdVerifiedUser, MdStorefront, MdPeople } from "react-icons/md";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function AdminProfile() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ orders: 0, feedbacks: 0, customers: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [form, setForm] = useState({
    name: user?.user_metadata?.name || "",
    phone: user?.user_metadata?.phone || "",
  });

  // Ambil stats hari ini dari Supabase
  useEffect(() => {
    let active = true;
    async function fetchStats() {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISO = today.toISOString();

        const [ordersRes, feedbackRes, customersRes] = await Promise.all([
          supabase.from("orders").select("id", { count: "exact" }).gte("created_at", todayISO),
          supabase.from("feedback").select("id", { count: "exact" }),
          supabase.from("customers").select("id", { count: "exact" }),
        ]);

        if (active) {
          setStats({
            orders: ordersRes.count ?? 0,
            feedbacks: feedbackRes.count ?? 0,
            customers: customersRes.count ?? 0,
          });
        }
      } catch (err) {
        console.error("Gagal mengambil stats admin:", err);
      } finally {
        if (active) setLoadingStats(false);
      }
    }
    fetchStats();
    return () => { active = false; };
  }, []);

  const adminData = {
    name: user?.user_metadata?.name || "Admin Netto",
    role: role === "admin" ? "Super Admin" : "User",
    email: user?.email || "Tidak ada email",
    phone: user?.user_metadata?.phone || "Belum diatur",
    store: "Netto Express Central",
    joinDate: user?.created_at
      ? new Date(user.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long" })
      : "Januari 2024",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.user_metadata?.name || "Denny")}`,
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleSaveProfile = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: form.name.trim(),
          phone: form.phone.trim(),
        },
      });
      if (error) throw error;
      setEditing(false);
      setSavedMsg("Profil berhasil diperbarui!");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err) {
      console.error("Gagal update profil:", err);
      setSavedMsg("Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const dailyStats = [
    { label: "Order Hari Ini", value: loadingStats ? "..." : stats.orders, icon: <HiLightningBolt className="text-amber-500" /> },
    { label: "Total Feedback", value: loadingStats ? "..." : stats.feedbacks, icon: <HiFire className="text-orange-500" /> },
    { label: "Total Pelanggan", value: loadingStats ? "..." : stats.customers, icon: <MdPeople className="text-blue-500" /> },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-[#0F172A] font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* TOP COVER & PROFILE HEADER */}
        <div className="relative">
          <div className="h-40 w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-xl" />
          <div className="px-8 -mt-16 flex flex-col md:flex-row items-end gap-6">
            <div className="relative group">
              <img
                src={adminData.avatar}
                alt="Profile"
                className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl border-4 border-white transition-transform group-hover:scale-105"
              />
              <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm" />
            </div>
            <div className="pb-2 space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-black tracking-tight">{adminData.name}</h1>
                <MdVerifiedUser className="text-blue-500" size={24} />
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{adminData.role} • {adminData.store}</p>
            </div>
          </div>
        </div>

        {/* SUCCESS BANNER */}
        {savedMsg && (
          <div className={`rounded-2xl px-5 py-3 text-sm font-bold border ${savedMsg.includes("Gagal") ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
            {savedMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT SIDE: ACCOUNT INFO */}
          <div className="md:col-span-2 space-y-6">

            {/* PERSONAL INFO CARD */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-900/5 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black uppercase tracking-widest text-slate-800">Informasi Akun</h3>
                {!editing ? (
                  <button
                    onClick={() => { setEditing(true); setForm({ name: adminData.name, phone: adminData.phone === "Belum diatur" ? "" : adminData.phone }); }}
                    className="flex items-center gap-1.5 text-sm font-black text-blue-600 px-4 py-2 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all uppercase"
                  >
                    <HiPencil size={14} /> Edit Profil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-1 text-sm font-black text-slate-500 bg-slate-100 px-3 py-2 rounded-xl hover:bg-slate-200 transition-all"
                    >
                      <HiX size={14} /> Batal
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-1 text-sm font-black text-white bg-blue-600 px-3 py-2 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-60"
                    >
                      {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <HiSave size={14} />}
                      Simpan
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Nama */}
                <div className="space-y-1.5">
                  <p className="text-sm font-black text-slate-400 uppercase flex items-center gap-2">
                    <HiUserCircle size={14} /> Nama
                  </p>
                  {editing ? (
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 text-base rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="text-base font-bold text-slate-700">{adminData.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <p className="text-sm font-black text-slate-400 uppercase flex items-center gap-2">
                    <HiPhone size={14} /> Nomor HP
                  </p>
                  {editing ? (
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+62 xxx-xxxx-xxxx"
                      className="w-full px-3 py-2 text-base rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="text-base font-bold text-slate-700">{adminData.phone}</p>
                  )}
                </div>

                {/* Email (read-only) */}
                <div className="space-y-1.5">
                  <p className="text-sm font-black text-slate-400 uppercase flex items-center gap-2">
                    <HiMail size={14} /> Email Address
                  </p>
                  <p className="text-base font-bold text-slate-700">{adminData.email}</p>
                </div>

                {/* Store */}
                <div className="space-y-1.5">
                  <p className="text-sm font-black text-slate-400 uppercase flex items-center gap-2">
                    <MdStorefront size={14} /> Cabang Laundry
                  </p>
                  <p className="text-base font-bold text-slate-700">{adminData.store}</p>
                </div>

                {/* Join date */}
                <div className="space-y-1.5">
                  <p className="text-sm font-black text-slate-400 uppercase flex items-center gap-2">
                    <HiBadgeCheck size={14} /> Bergabung Sejak
                  </p>
                  <p className="text-base font-bold text-slate-700">{adminData.joinDate}</p>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 p-6 bg-white rounded-3xl shadow-xl shadow-blue-900/5 hover:bg-blue-50 transition-all group">
                <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <HiKey size={20} />
                </div>
                <span className="text-sm font-black uppercase tracking-wider">Ubah Password</span>
              </button>
              <button onClick={handleLogout} className="flex items-center justify-center gap-3 p-6 bg-white rounded-3xl shadow-xl shadow-blue-900/5 hover:bg-red-50 transition-all group text-red-500">
                <div className="p-3 bg-red-100 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-all">
                  <HiLogout size={20} />
                </div>
                <span className="text-sm font-black uppercase tracking-wider">Keluar Sesi</span>
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: PERFORMANCE & SETTINGS */}
          <div className="space-y-6">

            {/* STATS CARD — Real data dari Supabase */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 mb-6">Statistik Toko</h3>
              <div className="space-y-6">
                {dailyStats.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{stat.icon}</div>
                      <p className="text-sm font-bold text-slate-400 uppercase">{stat.label}</p>
                    </div>
                    <p className="text-xl font-black italic">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PREFERENCES */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-900/5">
              <h3 className="text-base font-black uppercase tracking-widest text-slate-800 mb-6">Pengaturan Toko</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <HiCog className="text-slate-400" />
                    <span className="text-sm font-bold">Notifikasi WA</span>
                  </div>
                  <div className="w-8 h-4 bg-blue-600 rounded-full relative shadow-inner">
                    <div className="absolute right-1 top-0.5 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                  <div className="flex items-center gap-3">
                    <HiCog className="text-slate-400" />
                    <span className="text-sm font-bold">Mode Gelap</span>
                  </div>
                  <div className="w-8 h-4 bg-slate-300 rounded-full relative">
                    <div className="absolute left-1 top-0.5 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}