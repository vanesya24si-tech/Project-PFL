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

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // FUNGSI LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Menutup dropdown saat klik di luar area
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
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 h-[76px] bg-white border-b border-laundry-200 shadow-sm font-sans">
      
      {/* BRAND / LOGO */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-10 h-10 bg-gradient-to-br from-aqua-bright to-cyan-dark rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-aqua-bright/30">
          N
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold text-navy-deep leading-tight">
            Netto<span className="text-aqua-bright font-light">Laundry</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            Admin Panel
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <form 
        className="relative w-full max-w-md hidden md:block mx-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
        <input
          type="search"
          placeholder="Cari pesanan atau pelanggan..."
          className="w-full h-11 pl-12 pr-4 rounded-full border border-laundry-200 bg-sky-fresh focus:bg-white focus:outline-none focus:ring-4 focus:ring-aqua-bright/20 focus:border-aqua-bright transition-all text-sm text-slate-700 shadow-inner"
        />
      </form>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-2">

        {/* NOTIFICATION */}
        <button className="relative p-2.5 rounded-xl text-slate-400 hover:bg-laundry-100 hover:text-aqua-bright transition-colors">
          <HiBell className="text-2xl" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-aqua-bright border-2 border-white rounded-full"></span>
        </button>

        {/* SETTINGS QUICK ACCESS */}
        <button 
          onClick={() => navigate("/settings")}
          className="p-2.5 rounded-xl text-slate-400 hover:bg-laundry-100 hover:text-aqua-bright transition-all active:scale-90 group relative"
          title="Pengaturan"
        >
          <HiCog className="text-2xl group-hover:rotate-90 transition-transform duration-500" />
        </button>

        <div className="h-8 w-px bg-laundry-200 mx-2 hidden sm:block"></div>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 rounded-full hover:bg-sky-fresh border border-transparent hover:border-laundry-200 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aqua-bright to-cyan-dark text-white flex items-center justify-center text-sm font-bold border-2 border-white shadow-md">
              AD
            </div>
            <div className="hidden sm:block text-left pr-2">
              <span className="block text-sm font-black text-slate-700 leading-none mb-1">
                Admin Detail
              </span>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                Manager
              </span>
            </div>
          </button>

          {/* DROPDOWN MENU (Sesuai Gambar) */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-laundry-200 rounded-2xl shadow-xl shadow-aqua-bright/20 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-2">
                <button 
                  onClick={() => { navigate("/profile"); setIsProfileOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm font-semibold text-slate-600 rounded-xl hover:bg-laundry-100 hover:text-aqua-bright transition-colors"
                >
                  <HiOutlineUser className="text-lg" />
                  Profil Saya
                </button>
                <button 
                  onClick={() => { navigate("/settings"); setIsProfileOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm font-semibold text-slate-600 rounded-xl hover:bg-laundry-100 hover:text-aqua-bright transition-colors"
                >
                  <HiOutlineAdjustments className="text-lg" />
                  Pengaturan
                </button>
              </div>
              
              <div className="h-px bg-laundry-200 my-1 mx-2"></div>
              
              <div className="p-2">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm font-bold text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  <HiOutlineLogout className="text-lg" />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}