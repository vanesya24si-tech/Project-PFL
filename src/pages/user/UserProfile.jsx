import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { loadCustomers, updateCustomer } from "../../utils/customerStorage";
import {
  HiUser,
  HiPhone,
  HiMail,
  HiLocationMarker,
  HiPencil,
  HiSave,
  HiX,
  HiLogout,
  HiCheckCircle,
} from "react-icons/hi";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });

  const authPhone = user?.user_metadata?.phone || "";
  const authName = user?.user_metadata?.name || user?.email?.split("@")[0] || "";

  useEffect(() => {
    let active = true;
    async function fetchCustomer() {
      try {
        const customers = await loadCustomers();
        const found = customers.find(
          (c) =>
            (authPhone && c.phone?.replace(/\D/g, "") === authPhone?.replace(/\D/g, "")) ||
            (authName && c.name?.toLowerCase() === authName?.toLowerCase())
        );
        if (active && found) {
          setCustomer(found);
          setForm({
            name: found.name || "",
            phone: found.phone || "",
            email: found.email || user?.email || "",
            address: found.address || "",
          });
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchCustomer();
    return () => { active = false; };
  }, [authPhone, authName]);

  const handleSave = async () => {
    if (!customer?.id) return;
    setSaving(true);
    try {
      await updateCustomer(customer.id, {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
      });
      setCustomer((prev) => ({ ...prev, ...form }));
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Gagal menyimpan profil. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout gagal:", err);
    }
  };

  const FIELDS = [
    { key: "name", label: "Nama Lengkap", icon: HiUser, type: "text" },
    { key: "phone", label: "Nomor HP", icon: HiPhone, type: "tel" },
    { key: "email", label: "Email", icon: HiMail, type: "email" },
    { key: "address", label: "Alamat", icon: HiLocationMarker, type: "text" },
  ];

  const initials = (customer?.avatar || authName?.slice(0, 2) || "?").toUpperCase();

  const segmentColors = {
    Premium: "from-amber-400 to-orange-500",
    Gold: "from-yellow-400 to-amber-500",
    Silver: "from-slate-400 to-slate-500",
    Regular: "from-blue-400 to-indigo-500",
  };
  const segmentBgColors = {
    Premium: "bg-amber-50 text-amber-700 border-amber-200",
    Gold: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Silver: "bg-slate-100 text-slate-600 border-slate-200",
    Regular: "bg-blue-50 text-blue-700 border-blue-100",
  };
  const seg = customer?.segment || "Regular";
  const segColor = segmentColors[seg] || segmentColors.Regular;
  const segBg = segmentBgColors[seg] || segmentBgColors.Regular;

  return (
    <div className="space-y-4">
      {/* AVATAR CARD */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-6 flex items-center gap-5">
        {/* Avatar with animated ring */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 blur-sm opacity-40 scale-110 animate-pulse" />
          <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-sky-600 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-blue-300/40 border-2 border-white">
            {initials}
          </div>
        </div>
        <div>
          <p className="text-lg font-black text-slate-800 leading-tight">{customer?.name || authName}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`inline-block text-[10px] font-black border rounded-full px-2.5 py-0.5 ${segBg}`}>
              {seg} Member
            </span>
            <span className="inline-block text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5">
              {customer?.points?.toLocaleString("id-ID") || 0} poin
            </span>
          </div>
        </div>
      </div>

      {/* SUCCESS BANNER — frosted emerald */}
      {saved && (
        <div className="bg-emerald-50/80 backdrop-blur-xl border border-emerald-200/60 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-sm shadow-emerald-100">
          <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
            <HiCheckCircle size={16} className="text-white" />
          </div>
          <p className="text-sm font-black text-emerald-700">Profil berhasil disimpan!</p>
        </div>
      )}

      {/* PROFILE FORM */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data Pribadi</p>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 rounded-xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
            >
              <HiPencil size={11} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl hover:bg-slate-200 transition-all"
              >
                <HiX size={11} /> Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 text-[10px] font-black uppercase text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 rounded-xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-60"
              >
                {saving ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HiSave size={11} />
                )}
                Simpan
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-6">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="space-y-2">
            {FIELDS.map(({ key, label, icon: Icon, type }, idx) => (
              <div
                key={key}
                className={`flex items-center gap-3 p-3 rounded-2xl bg-slate-50/60 border border-slate-100 ${
                  idx < FIELDS.length - 1 ? "" : ""
                }`}
              >
                {/* Icon box */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <Icon size={14} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                  {editing ? (
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-full text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-700 truncate">
                      {form[key] || <span className="text-slate-300 text-xs font-medium">Belum diisi</span>}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACCOUNT INFO */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Akun</p>
        <div className="space-y-0 divide-y divide-slate-100">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                <HiMail size={13} className="text-slate-500" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Email Login</span>
            </div>
            <span className="text-xs font-bold text-slate-600 max-w-[150px] truncate text-right">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                <HiCheckCircle size={13} className="text-slate-500" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Status</span>
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Aktif</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                <HiUser size={13} className="text-slate-500" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Bergabung</span>
            </div>
            <span className="text-xs font-bold text-slate-600">
              {customer?.joinDate
                ? new Date(customer.joinDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* LOGOUT — danger gradient button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-black uppercase tracking-wider shadow-xl shadow-rose-500/25 hover:-translate-y-0.5 active:scale-95 transition-all"
      >
        <HiLogout size={17} />
        Keluar dari Akun
      </button>

      <div className="h-4" />
    </div>
  );
}
