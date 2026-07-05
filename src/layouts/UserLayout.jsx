import React from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import {
  HiHome,
  HiClipboardList,
  HiGift,
  HiUser,
  HiChatAlt2,
  HiExclamationCircle,
} from "react-icons/hi";

const NAV_ITEMS = [
  { to: "/user", label: "Home", icon: HiHome, end: true },
  { to: "/user/orders", label: "Pesanan", icon: HiClipboardList },
  { to: "/user/loyalty", label: "Poin", icon: HiGift },
  { to: "/user/feedback", label: "Ulasan", icon: HiChatAlt2 },
  { to: "/user/complaint", label: "Komplain", icon: HiExclamationCircle },
  { to: "/user/profile", label: "Profil", icon: HiUser },
];

export default function UserLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Pelanggan";

  const isComplaint = location.pathname === "/user/complaint";
  const headerGradient = isComplaint
    ? "bg-gradient-to-r from-red-500 to-rose-600"
    : "bg-gradient-to-r from-blue-600 to-sky-600";
  const headerTitle = isComplaint ? "Kirim Komplain 📢" : `Halo, ${displayName}! 👋`;
  const headerSub = isComplaint
    ? "Ceritakan masalahmu, kami siap membantu."
    : "Selamat datang di portal pelanggan Anda.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F7FF] via-[#F8FAFC] to-[#E0F2FE] flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* TOP HEADER */}
      <header className={`${headerGradient} text-white px-5 pt-5 pb-10 relative overflow-hidden shadow-lg shadow-blue-500/10 transition-all`}>
        {/* Dekorasi bulat */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute top-4 right-10 w-20 h-20 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-100 mb-1">
            Netto Laundry
          </p>
          <h1 className="text-2xl font-black">
            {headerTitle}
          </h1>
          <p className="text-sm text-blue-100 mt-0.5 font-medium">
            {headerSub}
          </p>
        </div>
      </header>

      {/* CONTENT — ditarik ke atas untuk overlapping card effect */}
      <main className="flex-1 -mt-6 px-4 pb-28 space-y-4 relative z-10 max-w-lg mx-auto w-full">
        <Outlet />
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-xl shadow-slate-200/60">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex items-center justify-center w-10 h-8 rounded-xl transition-all ${
                      isActive ? "bg-blue-50" : ""
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wide">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
