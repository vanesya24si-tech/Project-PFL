import { useState } from "react";
import { 
  HiOutlineBuildingStorefront, 
  HiOutlineBell, 
  HiOutlineShieldCheck, 
  HiOutlineCurrencyDollar,
  HiDevicePhoneMobile,
  HiOutlineQuestionMarkCircle,
  HiChevronRight,
  HiCheck
} from "react-icons/hi2";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("toko");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const menuItems = [
    { id: "toko", label: "Profil Toko", icon: <HiOutlineBuildingStorefront size={20} /> },
    { id: "tarif", label: "Tarif & Layanan", icon: <HiOutlineCurrencyDollar size={20} /> },
    { id: "notif", label: "Notifikasi WA", icon: <HiOutlineBell size={20} /> },
    { id: "keamanan", label: "Keamanan", icon: <HiOutlineShieldCheck size={20} /> },
    { id: "perangkat", label: "Perangkat", icon: <HiDevicePhoneMobile size={20} /> },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FDFDFF] p-4 md:p-10 text-[#0F172A] font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">
              System <span className="text-blue-600 not-italic">Settings</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest">Konfigurasi operasional Netto Laundry</p>
          </div>
          
          <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
              saveSuccess ? 'bg-green-500 text-white shadow-green-100' : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'
            }`}
          >
            {saveSuccess ? <><HiCheck size={16}/> Tersimpan</> : "Simpan Perubahan"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          
          {/* SIDEBAR NAV */}
          <aside className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                  activeTab === item.id 
                  ? "bg-white shadow-md shadow-blue-900/5 text-blue-600 border border-blue-50" 
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-xs font-black uppercase tracking-wider">{item.label}</span>
                </div>
                {activeTab === item.id && <HiChevronRight />}
              </button>
            ))}
            
            <div className="mt-10 p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
               <div className="flex items-center gap-2 text-blue-600 mb-2">
                 <HiOutlineQuestionMarkCircle size={18}/>
                 <span className="text-[10px] font-black uppercase">Butuh Bantuan?</span>
               </div>
               <p className="text-[10px] font-bold text-slate-500 leading-relaxed">Hubungi support jika ada kendala sistem operasional.</p>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-blue-900/5 border border-slate-50">
            
            {activeTab === "toko" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Toko / Cabang</label>
                    <input type="text" defaultValue="Netto Express Central" className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-200 focus:outline-none text-xs font-bold transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Official</label>
                    <input type="text" defaultValue="08123456789" className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-200 focus:outline-none text-xs font-bold transition-all" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Lengkap</label>
                    <textarea rows="3" className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-200 focus:outline-none text-xs font-bold transition-all resize-none">Jl. Raya Industri No. 42, Jakarta Selatan</textarea>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                   <h3 className="text-xs font-black uppercase tracking-widest mb-4">Jam Operasional</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Buka</span>
                        <input type="time" defaultValue="08:00" className="bg-transparent text-xs font-black focus:outline-none" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Tutup</span>
                        <input type="time" defaultValue="21:00" className="bg-transparent text-xs font-black focus:outline-none" />
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "tarif" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest">Daftar Harga Layanan</h3>
                  <button className="text-[10px] font-black text-blue-600">+ Tambah</button>
                </div>
                {[
                  { label: "Cuci Kering Lipat", price: "7.000", unit: "/Kg" },
                  { label: "Cuci Setrika", price: "10.000", unit: "/Kg" },
                  { label: "Setrika Saja", price: "5.000", unit: "/Kg" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100/50 transition-all cursor-pointer group">
                    <span className="text-xs font-bold text-slate-700">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-blue-600">Rp {item.price} <span className="text-[9px] text-slate-400">{item.unit}</span></span>
                      <HiChevronRight className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "notif" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-start gap-4">
                  <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm">
                    <HiOutlineBell size={24}/>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-blue-700 uppercase mb-1">WhatsApp Automation</h4>
                    <p className="text-[11px] font-bold text-blue-600/70 leading-relaxed">Pesan otomatis akan dikirim ke pelanggan saat status cucian berubah.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Notif Pesanan Diterima", active: true },
                    { label: "Notif Proses Selesai", active: true },
                    { label: "Notif Promo Loyalitas", active: false },
                    { label: "Notif Tagihan / Invoice", active: true },
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
                      <span className="text-xs font-bold text-slate-700">{notif.label}</span>
                      <div className={`w-12 h-6 rounded-full p-1 transition-all cursor-pointer ${notif.active ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-all ${notif.active ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Tab lain bisa ditambahkan di sini dengan pola yang sama */}

          </main>
        </div>
      </div>
    </div>
  );
}