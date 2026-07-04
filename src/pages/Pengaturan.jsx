import React, { useState } from "react";
import { 
  HiUserCircle, HiCog, HiBell, HiShieldCheck, 
  HiLocationMarker, HiCurrencyDollar, HiSave 
} from "react-icons/hi";

// DESIGN TOKENS
const T = {
  primary: "#1ABC9C",
  primaryDark: "#16A085",
  bgPage: "#F4F7F6",
  text: "#1A2E35",
  border: "#E0EEEA",
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("umum");

  const tabs = [
    { id: "umum", label: "Profil Bisnis", icon: <HiUserCircle /> },
    { id: "operasional", label: "Operasional", icon: <HiCog /> },
    { id: "notifikasi", label: "Notifikasi", icon: <HiBell /> },
    { id: "keamanan", label: "Keamanan", icon: <HiShieldCheck /> },
  ];

  return (
    <div className="p-8 bg-[#F4F7F6] min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-[#1A2E35] mb-8">Pengaturan Sistem</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR TABS */}
          <div className="lg:col-span-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.id 
                  ? "bg-[#1ABC9C] text-white shadow-lg shadow-[#1ABC9C]/30" 
                  : "bg-white text-slate-500 hover:bg-slate-50 border border-[#E0EEEA]"
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* CONTENT AREA */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] border border-[#E0EEEA] shadow-sm p-8 md:p-10">
              
              {activeTab === "umum" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-2xl font-black text-[#1A2E35] mb-6">Informasi Toko</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase text-slate-400">Nama Laundry</label>
                      <input type="text" defaultValue="Netto Laundry Pusat" className="w-full px-5 py-3 bg-slate-50 border border-[#E0EEEA] rounded-xl focus:ring-2 focus:ring-[#1ABC9C] outline-none font-bold text-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase text-slate-400">Nomor WhatsApp</label>
                      <input type="text" defaultValue="081234567890" className="w-full px-5 py-3 bg-slate-50 border border-[#E0EEEA] rounded-xl focus:ring-2 focus:ring-[#1ABC9C] outline-none font-bold text-slate-700" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-black uppercase text-slate-400">Alamat Lengkap</label>
                      <textarea rows="3" className="w-full px-5 py-3 bg-slate-50 border border-[#E0EEEA] rounded-xl focus:ring-2 focus:ring-[#1ABC9C] outline-none font-bold text-slate-700">Jl. Sudirman No. 123, Pekanbaru, Riau</textarea>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "operasional" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-2xl font-black text-[#1A2E35] mb-6">Biaya & Logistik</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-[#E0EEEA]">
                      <div className="flex items-center gap-3">
                        <HiCurrencyDollar className="text-[#1ABC9C] text-3xl" />
                        <div>
                          <p className="font-bold text-[#1A2E35]">Biaya Antar-Jemput</p>
                          <p className="text-sm text-slate-500">Biaya flat per transaksi logistik</p>
                        </div>
                      </div>
                      <input type="text" defaultValue="Rp 5.000" className="w-32 text-right px-4 py-2 border border-[#E0EEEA] rounded-xl font-black text-[#1ABC9C]" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-[#E0EEEA]">
                      <div className="flex items-center gap-3">
                        <HiLocationMarker className="text-[#1ABC9C] text-3xl" />
                        <div>
                          <p className="font-bold text-[#1A2E35]">Radius Maksimal</p>
                          <p className="text-sm text-slate-500">Jangkauan kurir (Km)</p>
                        </div>
                      </div>
                      <input type="text" defaultValue="10 Km" className="w-32 text-right px-4 py-2 border border-[#E0EEEA] rounded-xl font-black text-[#1ABC9C]" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "keamanan" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-2xl font-black text-[#1A2E35] mb-6">Akses & Sandi</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase text-slate-400">Kata Sandi Saat Ini</label>
                      <input type="password" placeholder="••••••••" className="w-full px-5 py-3 bg-slate-50 border border-[#E0EEEA] rounded-xl outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase text-slate-400">Kata Sandi Baru</label>
                      <input type="password" placeholder="Minimal 8 karakter" className="w-full px-5 py-3 bg-slate-50 border border-[#E0EEEA] rounded-xl outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* SAVE BUTTON */}
              <div className="mt-10 pt-8 border-t border-slate-100">
                <button className="flex items-center justify-center gap-2 w-full md:w-auto md:px-10 py-4 bg-[#1ABC9C] text-white font-black rounded-2xl shadow-xl shadow-[#1ABC9C]/20 hover:bg-[#16A085] transition-all active:scale-95 uppercase tracking-widest text-sm">
                  <HiSave className="text-xl" /> Simpan Perubahan
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}