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

export default function AddOrder() {
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
    navigate("/orders");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 flex items-center justify-center font-sans antialiased text-slate-900">
      <div className="max-w-2xl w-full space-y-4">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-none border-none cursor-pointer"
        >
          <HiArrowLeft size={16} /> Kembali ke Logistik
        </button>

        {/* MAIN CONTAINER */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6 md:p-8 space-y-6">
          
          {/* HEADER LAYER */}
          <div className="flex items-start gap-3.5 border-b border-slate-100 pb-5">
            <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-sm shrink-0">
              <HiTruck size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Atur Jadwal Kurir</h1>
              <p className="text-xs text-slate-500 mt-1">
                Kelola penjemputan atau pengantaran pakaian pelanggan dalam sistem logistik utama.
              </p>
            </div>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-200/40 text-xs font-semibold">
              <HiExclamationCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          {/* FORM FIELDS */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Nama Pelanggan */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Nama Pelanggan <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <HiUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    type="text"
                    name="customer"
                    placeholder="Cari atau masukkan nama pelanggan"
                    value={form.customer}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Jenis Layanan */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Jenis Layanan
                </label>
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 transition-all text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="Pick-up">Penjemputan (Pick-up)</option>
                  <option value="Delivery">Pengantaran (Delivery)</option>
                </select>
              </div>

              {/* Kurir */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Kurir Bertugas <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <HiMap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    type="text"
                    name="courier"
                    placeholder="Nama Kurir"
                    value={form.courier}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Tanggal */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tanggal Operasional <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <HiCalendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 transition-all text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Waktu */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Estimasi Waktu <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <HiClock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 transition-all text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

            </div>

            {/* ACTION FOOTER */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate("/orders")}
                className="flex-1 inline-flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer active:scale-98"
              >
                Konfirmasi Jadwal
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}