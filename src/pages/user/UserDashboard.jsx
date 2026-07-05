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
    <div className="space-y-6">
      {/* POIN CARD (Clean Minimalist) */}
      <div className="bg-slate-900 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between text-white relative overflow-hidden shadow-md">
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Poin Saya</p>
          <p className="text-4xl font-black mt-1 tracking-tight text-white">
            {loading ? "..." : (customer?.points ?? 0).toLocaleString("id-ID")}
          </p>
          <div className="inline-flex items-center gap-1.5 mt-3 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            <HiGift size={14} className="text-blue-400" />
            <p className="text-[10px] font-bold text-slate-100 uppercase tracking-widest">
              {customer?.segment || "Regular"} Member
            </p>
          </div>
        </div>
        <div className="relative z-10 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mt-4 sm:mt-0">
          <HiTrendingUp size={28} className="text-blue-400" />
        </div>
      </div>

      {/* ACTIVE ORDER */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">
          Status Order Aktif
        </p>
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 flex items-center gap-3 shadow-sm">
            <div className="w-6 h-6 border-2 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-sm text-slate-500 font-bold">Memuat data...</span>
          </div>
        ) : activeOrder ? (
          <Link
            to={`/track/${activeOrder.id}`}
            className="bg-white rounded-3xl border border-slate-200 p-5 flex items-center justify-between shadow-sm hover:border-blue-500 transition-colors group block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center">
                <MdLocalLaundryService size={22} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">{activeOrder.id}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{activeOrder.service}</p>
                <span className={`inline-block mt-2 text-[10px] font-bold px-2.5 py-1 rounded-md ${STATUS_COLOR[activeOrder.status] || "bg-slate-100 text-slate-600"}`}>
                  {activeOrder.status}
                </span>
              </div>
            </div>
            <HiChevronRight size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>
        ) : (
          <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-6 text-center">
            <HiCheckCircle size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">Tidak ada order aktif</p>
            <p className="text-xs text-slate-500 mt-1">Semua cucian sudah beres!</p>
          </div>
        )}
      </div>

      {/* SHORTCUTS */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">Menu Cepat</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SHORTCUTS.map(({ label, icon: Icon, to, color, desc }) => (
              <button
              key={to}
              onClick={() => navigate(to)}
              className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:border-blue-500 hover:shadow-md transition-all shadow-sm group flex flex-col justify-between"
            >
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-4 text-white`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{label}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* STATS */}
      {customer && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 grid grid-cols-3 gap-6 text-center shadow-sm">
          <div>
            <p className="text-2xl font-black text-slate-800">{customer.totalTransactions || 0}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Order</p>
          </div>
          <div className="border-x border-slate-200">
            <p className="text-2xl font-black text-slate-800">
              {(customer.totalSpent || 0) > 999999
                ? `${((customer.totalSpent || 0) / 1000000).toFixed(1)}Jt`
                : `${Math.round((customer.totalSpent || 0) / 1000)}K`}
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Total Belanja</p>
          </div>
          <div>
            <p className="text-2xl font-black text-blue-600">{customer.points || 0}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Poin</p>
          </div>
        </div>
      )}
    </div>
  );
}
