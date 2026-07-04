import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineUser, 
  HiSparkles,
  HiArrowSmRight,
  HiEye,
  HiEyeOff
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../utils/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "customer" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await register(
        formData.email,
        formData.password,
        formData.name,
        formData.role
      );

      if (data?.user && !data?.session) {
        setSuccess("Registrasi berhasil! Silakan cek kotak masuk email Anda untuk verifikasi.");
      } else {
        const targetPath = formData.role === "admin" ? "/dashboard" : "/";
        setSuccess("Registrasi berhasil! Mengalihkan ke halaman yang sesuai...");
        setTimeout(() => {
          navigate(targetPath);
        }, 1500);
      }
    } catch (err) {
      console.error("Register error:", err);
      let errMsg = "Gagal melakukan registrasi.";
      if (err) {
        if (typeof err === "string") {
          errMsg = err;
        } else if (err.message && typeof err.message === "string") {
          errMsg = err.message;
        } else if (err.error_description && typeof err.error_description === "string") {
          errMsg = err.error_description;
        } else {
          try {
            errMsg = JSON.stringify(err);
          } catch (e) {
            errMsg = String(err);
          }
        }
      }
      if (errMsg === "{}" || errMsg === "null" || !errMsg) {
        errMsg = "Terjadi kesalahan database atau koneksi Supabase. Pastikan Anda sudah menjalankan sql query untuk membuat tabel profiles dan kolom role.";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err.message || "Gagal masuk menggunakan Google.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F0F7FF] via-[#F8FAFC] to-[#E0F2FE] flex items-center justify-center p-4 md:p-8 text-[#0F172A] antialiased font-sans relative overflow-hidden">
      
      {/* ELEMEN DEKORATIF GLOWING BACKGROUND */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(2,132,199,0.1)] bg-white/80 backdrop-blur-xl border border-white/60 grid grid-cols-1 lg:grid-cols-12 relative z-10 transition-all">
        
        {/* PANEL KIRI: BRANDING & UTILITY INFO */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-gradient-to-br from-[#2563EB] to-[#0284C7] text-white p-10 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] border border-white/10">
              <HiSparkles className="animate-pulse text-sky-200" /> Laundry Partner
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black leading-tight italic uppercase">
                GROW YOUR <br/><span className="text-sky-200 not-italic">LAUNDRY BUSINESS</span>
              </h2>
              <p className="text-xs font-medium text-sky-50/80 leading-relaxed">
                Satu dashboard terpusat untuk mengontrol data pelanggan CRM, timbangan antrean kasir, hingga laporan omzet digital.
              </p>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="rounded-2xl bg-white/10 border border-white/5 p-4 shadow-xs backdrop-blur-xs">
              <p className="text-[10px] font-black uppercase tracking-wider text-sky-200">Pendaftaran Instan</p>
              <p className="mt-1 text-xs text-sky-50/90 font-medium">Buat akun dalam hitungan detik dan langsung siap pakai di perangkat kasir mana pun.</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/5 p-4 shadow-xs backdrop-blur-xs">
              <p className="text-[10px] font-black uppercase tracking-wider text-sky-200">Keamanan Data CRM</p>
              <p className="mt-1 text-xs text-sky-50/90 font-medium">Database pelanggan tersimpan rapi menggunakan skema enkripsi modern.</p>
            </div>
          </div>
        </div>

        {/* PANEL KANAN: FORM REGISTRASI */}
        <div className="p-6 md:p-10 lg:col-span-7 bg-white flex flex-col justify-center">
          
          <div className="lg:hidden mb-6">
            <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
              <img
                src="https://img.freepik.com/free-vector/laundry-service-concept-illustration_114360-8438.jpg"
                alt="Register Illustration"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-multiply"></div>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black block mb-1">
              START FOR FREE
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              Daftar Akun Admin Baru
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-400">
              Lengkapi formulir di bawah untuk bergabung ke sistem manajemen Netto Laundry.
            </p>
          </div>

          {/* ALERT MESSAGES */}
          {error && (
            <div className="mb-4 p-4 text-xs font-bold text-rose-600 bg-rose-50 rounded-2xl border border-rose-100 animate-pulse">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-2xl border border-emerald-100">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            
            {/* INPUT NAMA LENGKAP */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Nama Lengkap</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <HiOutlineUser size={18} />
                </span>
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="Masukkan nama lengkap..."
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/40 pl-11 pr-4 py-3 text-xs font-bold text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 shadow-inner disabled:opacity-60"
                />
              </div>
            </div>

            {/* INPUT EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Email Kerja</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <HiOutlineMail size={18} />
                </span>
                <input
                  type="email"
                  required
                  disabled={loading}
                  placeholder="nama@nettolaundry.com"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/40 pl-11 pr-4 py-3 text-xs font-bold text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 shadow-inner disabled:opacity-60"
                />
              </div>
            </div>

            {/* SELECT ROLE */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Pilih Peran (Role)</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <HiOutlineUser size={18} />
                </span>
                <select
                  required
                  disabled={loading}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/40 pl-11 pr-10 py-3 text-xs font-bold text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 shadow-inner appearance-none cursor-pointer"
                >
                  <option value="customer">Customer (Pelanggan)</option>
                  <option value="admin">Admin (Staf Laundry)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* INPUT PASSWORD */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Kata Sandi (Password)</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <HiOutlineLockClosed size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/40 pl-11 pr-12 py-3 text-xs font-bold text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 shadow-inner disabled:opacity-60"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-2 space-y-3">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-105 active:scale-[0.98] cursor-pointer disabled:opacity-60"
              >
                {loading ? "Mendaftarkan..." : "Buat Akun Admin"} <HiArrowSmRight size={16} />
              </button>

              <button 
                type="button" 
                disabled={loading}
                onClick={handleGoogleSignIn}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 py-3.5 text-xs font-black text-slate-600 transition-all cursor-pointer shadow-2xs disabled:opacity-60"
              >
                <FcGoogle size={18} /> {loading ? "Memproses..." : "Register dengan Google"}
              </button>
            </div>
          </form>

          {/* FOOTER SWITCH TO LOGIN */}
          <p className="text-center mt-6 text-xs font-bold text-slate-400">
            Sudah terdaftar sebagai tim?{" "}
            <Link to="/login" className="text-blue-600 font-black hover:text-blue-700 hover:underline transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
