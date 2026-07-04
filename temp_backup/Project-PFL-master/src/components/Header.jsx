import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HiSearch, 
  HiBell, 
  HiCog, 
  HiOutlineUser, 
  HiOutlineLogout,
  HiOutlineAdjustments
} from "react-icons/hi";
import { useAuth } from "../utils/AuthContext";


export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Data admin (Sinkron dengan AdminProfile.jsx)
  const admin = {
    name: "Denny Netto",
    role: "Super Admin",
    email: "denny.admin@netto.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Denny"
  };

  const { logout } = useAuth();

  // FUNGSI LOGOUT
  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // Close dropdown saat klik luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 h-[76px] bg-white border-b border-slate-100 shadow-sm font-sans text-[#0F172A] antialiased">
      
      {/* BRAND / LOGO */}
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/dashboard")}>
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200 transition-transform group-hover:scale-105">
          N
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xl font-black text-slate-800 leading-tight italic">
            Netto<span className="text-blue-600 font-black not-italic">Laundry</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
            Admin Portal
          </p>
        </div>
      </div>

      {/* SEARCH BAR (Proaktif mencari pesanan) */}
      <form 
        className="relative w-full max-w-md hidden md:block mx-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
        <input
          type="search"
          placeholder="Cari pesanan, pelanggan, atau invoice..."
          className="w-full h-11 pl-11 pr-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-xs font-bold text-slate-800 placeholder:text-slate-400"
        />
      </form>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-2">

        {/* NOTIFICATION */}
        <button 
          onClick={() => navigate("/notifications")}
          className="relative p-2.5 rounded-xl text-slate-400 hover:bg-blue-50/50 hover:text-blue-600 transition-all active:scale-90"
          title="Notifikasi"
        >
          <HiBell className="text-xl" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>

        {/* SETTINGS QUICK ACCESS */}
        <button 
          onClick={() => navigate("/settings")}
          className="p-2.5 rounded-xl text-slate-400 hover:bg-blue-50/50 hover:text-blue-600 transition-all active:scale-90 group"
          title="Pengaturan"
        >
          <HiCog className="text-xl group-hover:rotate-90 transition-transform duration-500" />
        </button>

        <div className="h-6 w-px bg-slate-100 mx-2 hidden sm:block"></div>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
          >
            <img 
              src={admin.avatar} 
              alt="Avatar" 
              className="w-9 h-9 rounded-xl bg-blue-100 object-cover shadow-sm border border-white"
            />
            <div className="hidden lg:block text-left pr-2">
              <span className="block text-xs font-black text-slate-800 leading-none mb-1">
                {admin.name}
              </span>
              <span className="block text-[9px] text-blue-600 font-black uppercase tracking-wider bg-blue-50 px-1.5 py-0.5 rounded-md">
                {admin.role}
              </span>
            </div>
          </button>

          {/* DROPDOWN MENU */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl shadow-blue-900/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-50 mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Akun Terhubung</p>
                <p className="text-xs font-bold text-slate-700 truncate">{admin.email}</p>
              </div>

              <div className="p-1.5 space-y-0.5">
                <button 
                  onClick={() => { navigate("/profil-admin"); setIsProfileOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-xs font-bold text-slate-600 rounded-xl hover:bg-blue-50/50 hover:text-blue-600 transition-colors group"
                >
                  <HiOutlineUser className="text-lg text-slate-400 group-hover:text-blue-600" />
                  Profil Admin
                </button>
                <button 
                  onClick={() => { navigate("/settings"); setIsProfileOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-xs font-bold text-slate-600 rounded-xl hover:bg-blue-50/50 hover:text-blue-600 transition-colors group"
                >
                  <HiOutlineAdjustments className="text-lg text-slate-400 group-hover:text-blue-600" />
                  Pengaturan Sistem
                </button>
              </div>
              
              <div className="h-px bg-slate-50 my-1.5 mx-2"></div>
              
              <div className="p-1.5">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-xs font-black text-rose-600 rounded-xl hover:bg-rose-50 transition-colors group"
                >
                  <HiOutlineLogout className="text-lg text-rose-400 group-hover:text-rose-600" />
                  Keluar Sesi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}