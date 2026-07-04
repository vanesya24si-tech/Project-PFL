import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { loadCustomers } from "../../utils/customerStorage";
import { getAllOrders } from "../../utils/ordersStorage";
import {
  HiClipboardList,
  HiGift,
  HiChatAlt2,
  HiChevronRight,
  HiCheckCircle,
  HiClock,
  HiRefresh,
  HiTrendingUp,
} from "react-icons/hi";
import { MdLocalLaundryService } from "react-icons/md";

const STATUS_COLOR = {
  "Antre di Rak": "bg-slate-100 text-slate-600",
  "Lagi Dicuci": "bg-blue-100 text-blue-700",
  "Tahap Setrika": "bg-amber-100 text-amber-700",
  "Bisa Diambil": "bg-emerald-100 text-emerald-700",
};

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const phone = user?.user_metadata?.phone || "";
  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "";

  useEffect(() => {
    let active = true;
    async function fetchData() {
      try {
        const [customers, ordersRes] = await Promise.all([
          loadCustomers(),
          getAllOrders(),
        ]);
        if (!active) return;

        // Match by phone or name
        const found = customers.find(
          (c) =>
            (phone && (c.phone === phone || c.phone?.replace(/\D/g, "") === phone?.replace(/\D/g, ""))) ||
            (name && c.name?.toLowerCase() === name?.toLowerCase())
        );
        setCustomer(found || null);

        // Cari order aktif terakhir
        const orders = ordersRes.data || [];
        const myOrders = orders.filter(
          (o) =>
            (phone && o.phone?.replace(/\D/g, "") === phone?.replace(/\D/g, "")) ||
            (name && o.user?.toLowerCase() === name?.toLowerCase())
        );
        const active_order = myOrders.find((o) => o.currentStep < 3) || myOrders[0] || null;
        setActiveOrder(active_order);
      } catch (err) {
        console.error("Gagal memuat data user dashboard:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchData();
    return () => { active = false; };
  }, [phone, name]);

  const SHORTCUTS = [
    { label: "Pesanan Saya", icon: HiClipboardList, to: "/user/orders", color: "bg-blue-600", desc: "Riwayat & tracking" },
    { label: "Poin Saya", icon: HiGift, to: "/user/loyalty", color: "bg-indigo-600", desc: `${customer?.points || 0} poin terkumpul` },
    { label: "Kirim Ulasan", icon: HiChatAlt2, to: "/user/feedback", color: "bg-emerald-600", desc: "Beri rating & komentar" },
  ];

  return (
    <div className="space-y-5">
      {/* POIN CARD (Premium Gradient) */}
      <div className="bg-gradient-to-br from-blue-600 to-sky-500 rounded-3xl shadow-xl shadow-blue-500/20 border border-blue-400/50 p-6 flex items-center justify-between text-white relative overflow-hidden">
        {/* Dekorasi Card */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-100/90">Total Poin Saya</p>
          <p className="text-5xl font-black mt-1 tracking-tight">
            {loading ? "..." : (customer?.points ?? 0).toLocaleString("id-ID")}
          </p>
          <div className="inline-flex items-center gap-1.5 mt-2 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
            <HiGift size={12} className="text-blue-50" />
            <p className="text-[10px] font-bold text-white uppercase tracking-widest">
              {customer?.segment || "Regular"} Member
            </p>
          </div>
        </div>
        <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-inner">
          <HiTrendingUp size={30} className="text-white drop-shadow-md" />
        </div>
      </div>

      {/* ACTIVE ORDER */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
          Status Order Aktif
        </p>
        {loading ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white p-5 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-sm text-slate-400 font-bold">Memuat...</span>
          </div>
        ) : activeOrder ? (
          <Link
            to={`/track/${activeOrder.id}`}
            className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all group block relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-sky-400"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <MdLocalLaundryService size={22} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">{activeOrder.id}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">{activeOrder.service}</p>
                <span className={`inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded-lg ${STATUS_COLOR[activeOrder.status] || "bg-slate-100 text-slate-600"}`}>
                  {activeOrder.status}
                </span>
              </div>
            </div>
            <HiChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </Link>
        ) : (
          <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-dashed border-slate-300 p-6 text-center">
            <HiCheckCircle size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-black text-slate-500">Tidak ada order aktif</p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Semua cucian sudah beres! 🎉</p>
          </div>
        )}
      </div>

      {/* SHORTCUTS */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Menu Cepat</p>
        <div className="grid grid-cols-3 gap-3">
          {SHORTCUTS.map(({ label, icon: Icon, to, color, desc }) => (
              <button
              key={to}
              onClick={() => navigate(to)}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white p-4 text-left hover:shadow-lg transition-all active:scale-95 shadow-sm group"
            >
              <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:-translate-y-1 transition-transform`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-[11px] font-black text-slate-800">{label}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* STATS */}
      {customer && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white p-5 grid grid-cols-3 gap-4 text-center shadow-sm">
          <div>
            <p className="text-3xl font-black text-slate-800">{customer.totalTransactions || 0}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">Order</p>
          </div>
          <div className="border-x border-slate-200/60">
            <p className="text-3xl font-black text-slate-800">
              {(customer.totalSpent || 0) > 999999
                ? `${((customer.totalSpent || 0) / 1000000).toFixed(1)}Jt`
                : `${Math.round((customer.totalSpent || 0) / 1000)}K`}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">Dihabiskan</p>
          </div>
          <div>
            <p className="text-3xl font-black text-blue-600">{customer.points || 0}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">Poin</p>
          </div>
        </div>
      )}
    </div>
  );
}
