import { useState } from "react";
import { HiUserCircle, HiBadgeCheck, HiKey, HiLogout, HiCog, HiFire, HiLightningBolt, HiMail, HiPhone } from "react-icons/hi";
import { MdVerifiedUser, MdStorefront } from "react-icons/md";

export default function AdminProfile() {
  const [adminData] = useState({
    name: "Denny Netto",
    role: "Super Admin",
    email: "denny.laundry@netto.com",
    phone: "+62 812-9876-5432",
    store: "Netto Express Central",
    joinDate: "Januari 2024",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Denny",
  });

  const dailyStats = [
    { label: "Order Diproses", value: "42", icon: <HiLightningBolt className="text-amber-500" /> },
    { label: "Kepuasan User", value: "4.9", icon: <HiFire className="text-orange-500" /> },
    { label: "Shift Berjalan", value: "8h 12m", icon: <HiBadgeCheck className="text-blue-500" /> },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-[#0F172A] font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* TOP COVER & PROFILE HEADER */}
        <div className="relative">
          {/* Background Decorative */}
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
                <h1 className="text-3xl font-black tracking-tight">{adminData.name}</h1>
                <MdVerifiedUser className="text-blue-500" size={24} />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{adminData.role} • {adminData.store}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT SIDE: ACCOUNT INFO */}
          <div className="md:col-span-2 space-y-6">
            
            {/* PERSONAL INFO CARD */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-900/5 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Informasi Akun</h3>
                <button className="text-[10px] font-black text-blue-600 px-4 py-2 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all uppercase">
                  Edit Profil
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                    <HiMail size={14} /> Email Address
                  </p>
                  <p className="text-sm font-bold text-slate-700">{adminData.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                    <HiPhone size={14} /> Phone Number
                  </p>
                  <p className="text-sm font-bold text-slate-700">{adminData.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                    <MdStorefront size={14} /> Cabang Laundry
                  </p>
                  <p className="text-sm font-bold text-slate-700">{adminData.store}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                    <HiUserCircle size={14} /> Bergabung Sejak
                  </p>
                  <p className="text-sm font-bold text-slate-700">{adminData.joinDate}</p>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 p-6 bg-white rounded-3xl shadow-xl shadow-blue-900/5 hover:bg-blue-50 transition-all group">
                <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <HiKey size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-wider">Ubah Password</span>
              </button>
              <button className="flex items-center justify-center gap-3 p-6 bg-white rounded-3xl shadow-xl shadow-blue-900/5 hover:bg-red-50 transition-all group text-red-500">
                <div className="p-3 bg-red-100 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-all">
                  <HiLogout size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-wider">Keluar Sesi</span>
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: PERFORMANCE & SETTINGS */}
          <div className="space-y-6">
            
            {/* STATS CARD */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6">Performa Hari Ini</h3>
              <div className="space-y-6">
                {dailyStats.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{stat.icon}</div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase">{stat.label}</p>
                    </div>
                    <p className="text-lg font-black italic">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PREFERENCES */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-900/5">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-6">Pengaturan Toko</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <HiCog className="text-slate-400" />
                    <span className="text-xs font-bold">Notifikasi WA</span>
                  </div>
                  <div className="w-8 h-4 bg-blue-600 rounded-full relative shadow-inner">
                    <div className="absolute right-1 top-0.5 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                  <div className="flex items-center gap-3">
                    <HiCog className="text-slate-400" />
                    <span className="text-xs font-bold">Mode Gelap</span>
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