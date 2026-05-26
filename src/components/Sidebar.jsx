import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  MdDashboard, 
  MdPeople, 
  MdReceipt, 
  MdLocalLaundryService,
  MdLocationOn, 
  MdNotifications, 
  MdStar, 
  MdTimeline, 
  MdChatBubble, 
  MdBarChart, 
  MdShield 
} from "react-icons/md";

export default function Sidebar({ collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Menu Lengkap Sinkron Dengan Kebutuhan Modul Admin
  const menuItems = [
    { icon: <MdDashboard size={20} />, label: "Dashboard", path: "/" },
    { icon: <MdPeople size={20} />, label: "Pelanggan", path: "/members" },
    { icon: <MdLocalLaundryService size={20} />, label: "Produk Laundry", path: "/products" },
    { icon: <MdReceipt size={20} />, label: "Transaksi", path: "/orders" },
    { icon: <MdLocationOn size={20} />, label: "Tracking Laundry", path: "/tracking" },
    { icon: <MdNotifications size={20} />, label: "Notifikasi", path: "/notifications" },
    { icon: <MdStar size={20} />, label: "Program Loyalitas", path: "/loyalty" },
    { icon: <MdTimeline size={20} />, label: "Segmentasi", path: "/segmentation" },
    { icon: <MdChatBubble size={20} />, label: "Feedback", path: "/feedback" },
    { icon: <MdBarChart size={20} />, label: "Laporan CRM", path: "/reports" },
  ];

  return (
    <aside 
      className={`h-screen bg-white border-r border-slate-100 flex flex-col p-6 font-sans text-[#0F172A] antialiased select-none transition-all duration-300 ease-in-out shrink-0 sticky top-0 ${
        collapsed ? "w-[88px]" : "w-[260px]"
      }`}
    >
      
      {/* BRAND LOGO NETTO LAUNDRY */}
      <div 
        onClick={() => navigate("/")}
        className={`flex items-center gap-3 mb-8 cursor-pointer overflow-hidden transition-all duration-200 ${
          collapsed ? "justify-center px-0" : "px-1"
        }`}
      >
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-100 shrink-0">
          N
        </div>
        {!collapsed && (
          <span className="text-xl font-black tracking-tight text-slate-800 italic uppercase">
            Netto<span className="text-blue-600 font-black not-italic">.</span>
          </span>
        )}
      </div>

      {/* SECTION TITLE */}
      {!collapsed && (
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2.5 mb-3">
          Menu Utama
        </p>
      )}

      {/* NAVIGATION INTERFACE */}
      <nav className="flex flex-col gap-1 overflow-y-auto pr-1 flex-1 max-h-[calc(100vh-210px)] scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div 
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3.5 px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-150 relative active:scale-98 group ${
                isActive 
                  ? "bg-blue-50 text-blue-600 font-black" 
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50/60 font-bold"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <span className={`shrink-0 transition-colors ${isActive ? "text-blue-600" : "text-slate-400/80 group-hover:text-slate-500"}`}>
                {item.icon}
              </span>
              
              {!collapsed && (
                <span className="text-xs tracking-wide flex-1 whitespace-nowrap">
                  {item.label}
                </span>
              )}

              {/* ACTIVE DOT INDICATOR */}
              {!collapsed && isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-md shadow-blue-400 shrink-0" />
              )}

              {/* TOOLTIP ON COLLAPSED STATE */}
              {collapsed && (
                <div className="absolute left-[76px] invisible opacity-0 scale-95 group-hover:visible group-hover:opacity-100 group-hover:scale-100 transition-all z-50 bg-slate-900 text-white text-[11px] font-black px-3 py-2 rounded-xl whitespace-nowrap pointer-events-none shadow-xl border border-slate-800">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* SECURITY ACCESS CARD (STICKY BOTTOM) */}
      {!collapsed && (
        <div className="mt-auto bg-gradient-to-br from-blue-600 to-blue-700 rounded-[1.5rem] p-4 text-white relative overflow-hidden shadow-lg shadow-blue-100 border border-blue-500/10">
          <div className="relative z-10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/10 flex items-center justify-center shadow-inner">
              <MdShield size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-black tracking-wide">Keamanan Data</p>
              <p className="text-[10px] text-blue-100/80 font-bold leading-normal mt-0.5">
                Sesi aktif sebagai Supervisor Netto.
              </p>
            </div>
          </div>
          {/* Decorative Blur Circle Accent */}
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-sm pointer-events-none" />
        </div>
      )}
    </aside>
  );
}