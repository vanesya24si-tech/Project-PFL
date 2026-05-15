import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HiUser, 
  HiPhone, 
  HiLocationMarker, 
  HiArrowLeft,
  HiExclamationCircle,
  HiIdentification,
  HiClipboardCheck
} from "react-icons/hi";

export default function AddPatients() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "Regular",
    phone: "",
    address: "",
    notes: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.phone) {
      setError("Nama pelanggan dan nomor HP wajib diisi!");
      return;
    }

    console.log("DATA PELANGGAN BARU:", form);
    alert("Pelanggan berhasil didaftarkan ke sistem Netto Laundry!");
    navigate("/patients"); // Asumsi ini halaman daftar pelanggan
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate("/patients")}
          className="group flex items-center gap-2 text-slate-500 hover:text-rose-600 font-bold text-sm transition-all w-fit"
        >
          <HiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
          Kembali ke Database
        </button>

        {/* MAIN CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          
          {/* HEADER */}
          <div className="px-8 md:px-12 pt-10 pb-8 bg-gradient-to-r from-slate-900 to-slate-800">
            <div className="flex items-center gap-4 mb-2">
               <div className="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-900/20">
                  <HiUser className="text-white text-2xl" />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Registrasi Pelanggan</h1>
                  <p className="text-slate-400 text-sm font-medium">
                    Tambahkan profil pelanggan baru untuk mulai mencatat pesanan.
                  </p>
               </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* ERROR BANNER */}
            {error && (
              <div className="mb-8 flex items-center gap-3 bg-rose-50 text-rose-600 px-5 py-4 rounded-2xl border border-rose-100 text-sm font-bold animate-shake">
                <HiExclamationCircle className="text-xl shrink-0" />
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-7">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                
                {/* Nama Lengkap */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Nama Pelanggan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <HiIdentification className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-rose-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Contoh: Budi Santoso"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all text-sm font-bold text-slate-700"
                    />
                  </div>
                </div>

                {/* Nomor HP */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    WhatsApp / No. HP <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-rose-500 transition-colors" />
                    <input
                      type="text"
                      name="phone"
                      placeholder="0812xxxx"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all text-sm font-bold text-slate-700"
                    />
                  </div>
                </div>

                {/* Tipe Pelanggan */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Tipe Membership
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Premium">Premium (Diskon 10%)</option>
                      <option value="Corporate">Corporate / Hotel</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <HiClipboardCheck className="text-xl" />
                    </div>
                  </div>
                </div>

                {/* Alamat */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Alamat Lengkap
                  </label>
                  <div className="relative group">
                    <HiLocationMarker className="absolute left-4 top-5 text-slate-400 text-xl group-focus-within:text-rose-500 transition-colors" />
                    <textarea
                      name="address"
                      rows="3"
                      placeholder="Masukkan alamat domisili untuk layanan antar-jemput..."
                      value={form.address}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all text-sm font-bold text-slate-700 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-8 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => navigate("/patients")}
                  className="flex-1 px-6 py-4 rounded-2xl font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-8 py-4 rounded-2xl font-black text-white bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                  Simpan Pelanggan Baru
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}