import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  HiUser, 
  HiPhone, 
  HiLocationMarker, 
  HiArrowLeft,
  HiExclamationCircle,
  HiIdentification,
  HiClipboardCheck,
  HiMail,
  HiUserGroup
} from "react-icons/hi";
import { 
  saveCustomer, 
  buildCustomerData, 
  getCustomerById 
} from "../utils/customerStorage";

export default function AddMember() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    type: "Regular",
    customerType: "Pekerja",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    async function fetchCustomer() {
      try {
        const existing = await getCustomerById(id);
        if (!existing) {
          navigate("/members");
          return;
        }
        setForm({
          name: existing.name || "",
          type: existing.segment || "Regular",
          customerType: existing.customerType || "Pekerja",
          phone: existing.phone || "",
          email: existing.email || "",
          address: existing.address || "",
          notes: existing.notes || "",
        });
      } catch (err) {
        console.error("Gagal memuat detail pelanggan untuk diedit:", err);
        setError("Gagal memuat data pelanggan.");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi Sederhana
    if (!form.name || !form.phone || !form.email) {
      setError("Nama, Nomor HP, dan Email wajib diisi!");
      return;
    }

    try {
      const existingCustomer = isEdit ? await getCustomerById(id) : null;
      const customerData = buildCustomerData(form, existingCustomer);

      await saveCustomer(customerData, isEdit);
      navigate("/members");
    } catch (err) {
      console.error("Gagal menyimpan data ke Supabase:", err);
      setError("Gagal menyimpan data ke database. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 md:p-10 font-sans text-slate-700">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate("/members")}
          className="group flex items-center gap-2 text-slate-400 hover:text-sky-600 font-semibold text-base transition-all"
        >
          <HiArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
          Kembali ke Database
        </button>

        {/* MAIN CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          
          {/* HEADER SECTION */}
          <div className="px-8 md:px-12 py-10 bg-[#F8FBFF] border-b border-slate-100">
            <div className="flex items-center gap-5">
               <div className="p-4 bg-sky-100 rounded-3xl text-sky-600 shadow-sm">
                  <HiUser className="text-4xl" />
               </div>
               <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {isEdit ? "Perbarui Data Pelanggan" : "Tambah Pelanggan Baru"}
                  </h1>
                  <p className="text-slate-500 text-base mt-1">
                    Kelola profil pelanggan untuk mempermudah strategi CRM & Notifikasi.
                  </p>
               </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* ERROR BANNER */}
            {error && (
              <div className="mb-8 flex items-center gap-3 bg-red-50 text-red-600 px-5 py-4 rounded-2xl border border-red-100 text-base font-semibold animate-pulse">
                <HiExclamationCircle className="text-2xl shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Nama Lengkap */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    Nama Lengkap <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <HiIdentification className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-2xl group-focus-within:text-sky-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      autoFocus
                      placeholder="Masukkan nama lengkap..."
                      value={form.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all text-base font-semibold text-slate-700"
                    />
                  </div>
                </div>

                {/* Nomor HP */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    WhatsApp / HP <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-2xl group-focus-within:text-sky-500 transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="08xx xxxx xxxx"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all text-base font-semibold text-slate-700"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    Email Aktif <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-2xl group-focus-within:text-sky-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      placeholder="contoh@mail.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all text-base font-semibold text-slate-700"
                    />
                  </div>
                </div>

                {/* Jenis Pelanggan (CRM) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    Kategori (CRM Attribute)
                  </label>
                  <div className="relative">
                    <HiUserGroup className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-2xl z-10" />
                    <select
                      name="customerType"
                      value={form.customerType}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all text-base font-semibold text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="Pekerja">Pekerja / Karyawan</option>
                      <option value="Pelajar">Pelajar / Mahasiswa</option>
                      <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
                      <option value="Bisnis">Bisnis / Instansi</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                       <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Segmen Membership */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    Loyalty Segment
                  </label>
                  <div className="relative">
                    <HiClipboardCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-2xl z-10" />
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all text-base font-semibold text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="Regular">Regular Member</option>
                      <option value="Premium">Premium Member (Gold)</option>
                      <option value="VIP">VIP / Corporate</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                       <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Alamat */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    Alamat Lengkap Penjemputan
                  </label>
                  <div className="relative group">
                    <HiLocationMarker className="absolute left-4 top-5 text-slate-300 text-2xl group-focus-within:text-sky-500 transition-colors" />
                    <textarea
                      name="address"
                      rows="3"
                      placeholder="Nama jalan, blok, nomor rumah, atau detail patokan lokasi..."
                      value={form.address}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all text-base font-semibold text-slate-700 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-10 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => navigate("/members")}
                  className="flex-1 px-8 py-4 rounded-2xl font-bold text-slate-400 bg-transparent hover:bg-slate-50 hover:text-slate-600 transition-all text-base"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-8 py-4 rounded-2xl font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-xl shadow-sky-100 transition-all active:scale-[0.98] text-base"
                >
                  {isEdit ? "Konfirmasi Perubahan" : "Daftarkan Sekarang"}
                </button>
              </div>

            </form>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 font-medium pb-10">
           Data dilindungi secara lokal melalui sistem enkripsi database browser.
        </p>
      </div>
    </div>
  );
}