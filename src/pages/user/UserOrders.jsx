import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { getAllOrders } from "../../utils/ordersStorage";
import {
  HiClipboardList,
  HiChevronRight,
  HiSearch,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
} from "react-icons/hi";
import { MdLocalLaundryService } from "react-icons/md";

const STATUS_CONFIG = {
  "Antre di Rak":  { color: "bg-slate-100 text-slate-600",     dot: "bg-slate-400",   bar: "from-slate-300 to-slate-400" },
  "Lagi Dicuci":   { color: "bg-blue-100 text-blue-700",       dot: "bg-blue-500",    bar: "from-blue-400 to-sky-500" },
  "Tahap Setrika": { color: "bg-amber-100 text-amber-700",     dot: "bg-amber-500",   bar: "from-amber-400 to-orange-400" },
  "Bisa Diambil":  { color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", bar: "from-emerald-400 to-teal-500" },
};

const TABS = ["Semua", "Aktif", "Selesai"];

export default function UserOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Semua");

  const phone = user?.user_metadata?.phone || "";
  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "";

  useEffect(() => {
    let active = true;
    async function fetchOrders() {
      try {
        const { data } = await getAllOrders();
        if (!active) return;
        // Filter orders milik user ini
        const mine = (data || []).filter(
          (o) =>
            (phone && o.phone?.replace(/\D/g, "") === phone?.replace(/\D/g, "")) ||
            (name && o.user?.toLowerCase() === name?.toLowerCase())
        );
        setOrders(mine);
      } catch (err) {
        console.error("Gagal memuat riwayat order:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchOrders();
    return () => { active = false; };
  }, [phone, name]);

  const filtered = useMemo(() => {
    let result = orders;
    if (tab === "Aktif") result = result.filter((o) => o.currentStep < 3);
    if (tab === "Selesai") result = result.filter((o) => o.currentStep >= 3);
    if (search) {
      result = result.filter(
        (o) =>
          o.id?.toLowerCase().includes(search.toLowerCase()) ||
          o.service?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
  }, [orders, tab, search]);

  return (
    <div className="space-y-4">
      {/* HEADER CARD */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          {/* Blue gradient icon box */}
          <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <HiClipboardList size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-black text-slate-800">Riwayat Pesanan</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {orders.length} total order
            </p>
          </div>
          {/* Count pill */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-3 py-1.5 text-center min-w-[48px]">
            <p className="text-base font-black text-blue-600 leading-none">{orders.length}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-blue-400 mt-0.5">order</p>
          </div>
        </div>

        {/* Search — floating rounded with icon */}
        <div className="relative mb-4">
          <HiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={16}
          />
          <input
            type="text"
            placeholder="Cari nomor nota atau layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-2xl font-bold placeholder:text-slate-300 focus:border-blue-400 outline-none transition-all"
          />
        </div>

        {/* Tab pills */}
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${
                tab === t
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white/60 text-slate-400 hover:bg-white/80 border border-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ORDER LIST */}
      {loading ? (
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-dashed border-slate-300 p-8 text-center">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-black text-slate-400">Memuat pesanan...</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-1">
            Harap tunggu sebentar
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-dashed border-slate-300 p-8 text-center">
          <div className="w-14 h-14 bg-slate-100/80 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <HiExclamationCircle size={28} className="text-slate-300" />
          </div>
          <p className="text-base font-black text-slate-400">Belum ada pesanan</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-1">
            {tab !== "Semua"
              ? `Tidak ada order ${tab.toLowerCase()}.`
              : "Riwayat order kamu akan muncul di sini."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const cfg = STATUS_CONFIG[order.status] || {
              color: "bg-slate-100 text-slate-600",
              dot: "bg-slate-400",
              bar: "from-slate-300 to-slate-400",
            };
            const isDone = order.currentStep >= 3;
            return (
              <Link
                key={order.id}
                to={`/track/${order.id}`}
                className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-sm flex items-center justify-between p-4 hover:-translate-y-0.5 hover:shadow-lg transition-all group block"
              >
                {/* Left colored accent bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${cfg.bar} rounded-l-3xl`}
                />

                <div className="flex items-center gap-3 pl-2">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      isDone ? "bg-emerald-50" : "bg-blue-50"
                    }`}
                  >
                    {isDone ? (
                      <HiCheckCircle size={22} className="text-emerald-500" />
                    ) : (
                      <MdLocalLaundryService size={22} className="text-blue-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-black text-slate-800">{order.id}</p>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg ${cfg.color}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      {order.service} • {order.weight}
                    </p>
                    <p className="text-[10px] text-blue-600 font-black mt-0.5">
                      Rp {Number(order.price || 0).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <HiChevronRight
                  size={16}
                  className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0"
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
