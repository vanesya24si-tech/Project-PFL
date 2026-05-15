import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HiUser, 
  HiCalendar, 
  HiClock, 
  HiTruck, 
  HiArrowLeft,
  HiExclamationCircle,
  HiMap
} from "react-icons/hi";

// DESIGN TOKENS (Sesuai dengan tema Netto Laundry)
const T = {
  primary: "#1ABC9C",
  primaryDark: "#16A085",
  sidebar: "#1A2E35",
  bgPage: "#F4F7F6",
  border: "#E0EEEA",
};

export default function AddSchedule() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer: "",
    date: "",
    time: "",
    courier: "",
    serviceType: "Pick-up",
    status: "Menunggu",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.customer || !form.date || !form.time || !form.courier) {
      setError("Nama pelanggan, tanggal, waktu, dan kurir wajib ditentukan!");
      return;
    }

    console.log("LOGISTIK LAUNDRY:", form);
    alert("Jadwal operasional berhasil dibuat!");
    navigate("/schedule");
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] p-4 md:p-10 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate("/schedule")}
          className="group flex items-center gap-2 text-slate-500 hover:text-[#1ABC9C] font-bold text-sm transition-all w-fit"
        >
          <HiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
          Kembali ke Logistik
        </button>

        {/* MAIN CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-[#E0EEEA] overflow-hidden">
          
          {/* HEADER */}
          <div className="px-8 md:px-12 pt-10 pb-8 bg-[#1A2E35]">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-[#1ABC9C] rounded-2xl shadow-lg shadow-[#1ABC9C]/20">
                  <HiTruck className="text-white text-2xl" />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Atur Jadwal Kurir</h1>
                  <p className="text-slate-400 text-sm font-medium mt-1">
                    Kelola penjemputan atau pengantaran pakaian pelanggan.
                  </p>
               </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* ERROR BANNER */}
            {error && (
              <div className="mb-8 flex items-center gap-3 bg-red-50 text-red-600 px-5 py-4 rounded-2xl border border-red-100 text-sm font-bold">
                <HiExclamationCircle className="text-xl shrink-0" />
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-7">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                
                {/* Nama Pelanggan */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Nama Pelanggan <span className="text-[#1ABC9C]">*</span>
                  </label>
                  <div className="relative group">
                    <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-[#1ABC9C] transition-colors" />
                    <input
                      type="text"
                      name="customer"
                      placeholder="Cari atau masukkan nama pelanggan"
                      value={form.customer}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-[#E0EEEA] rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1ABC9C]/5 focus:border-[#1ABC9C] transition-all text-sm font-bold text-slate-700"
                    />
                  </div>
                </div>

                {/* Jenis Layanan */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Jenis Layanan
                  </label>
                  <div className="relative">
                    <select
                      name="serviceType"
                      value={form.serviceType}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border border-[#E0EEEA] rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1ABC9C]/5 focus:border-[#1ABC9C] transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="Pick-up">Penjemputan (Pick-up)</option>
                      <option value="Delivery">Pengantaran (Delivery)</option>
                    </select>
                  </div>
                </div>

                {/* Kurir */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Kurir Bertugas <span className="text-[#1ABC9C]">*</span>
                  </label>
                  <div className="relative group">
                    <HiMap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-[#1ABC9C] transition-colors" />
                    <input
                      type="text"
                      name="courier"
                      placeholder="Nama Kurir"
                      value={form.courier}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-[#E0EEEA] rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1ABC9C]/5 focus:border-[#1ABC9C] transition-all text-sm font-bold text-slate-700"
                    />
                  </div>
                </div>

                {/* Tanggal */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Tanggal <span className="text-[#1ABC9C]">*</span>
                  </label>
                  <div className="relative group">
                    <HiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-[#1ABC9C] transition-colors" />
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-[#E0EEEA] rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1ABC9C]/5 focus:border-[#1ABC9C] transition-all text-sm font-bold text-slate-700"
                    />
                  </div>
                </div>

                {/* Waktu */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Waktu <span className="text-[#1ABC9C]">*</span>
                  </label>
                  <div className="relative group">
                    <HiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-[#1ABC9C] transition-colors" />
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-[#E0EEEA] rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1ABC9C]/5 focus:border-[#1ABC9C] transition-all text-sm font-bold text-slate-700"
                    />
                  </div>
                </div>

              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-8 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => navigate("/schedule")}
                  className="flex-1 px-6 py-4 rounded-2xl font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-8 py-4 rounded-2xl font-black text-white bg-[#1ABC9C] hover:bg-[#16A085] shadow-xl shadow-[#1ABC9C]/20 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                  Konfirmasi Jadwal
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}