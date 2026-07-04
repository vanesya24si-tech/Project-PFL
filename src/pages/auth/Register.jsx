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
    <div className="min-h-screen w-full bg-[#F8FAFC] flex font-sans text-[#0F172A] antialiased relative overflow-hidden">
      
      {/* PANEL KIRI: GRADIENT BIRU-TOSKA MELENGKUNG (Slightly different from login) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-sky-600 text-white flex-col justify-between p-12 relative overflow-hidden" style={{ borderBottomRightRadius: '35% 100%', borderTopRightRadius: '0%' }}>
        {/* Dekorasi halus */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-sky-400/20 rounded-full -ml-32 -mt-32 blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full translate-x-1/3 translate-y-1/3 opacity-30"></div>

        {/* Brand Header */}
        <div className="space-y-4 relative z-10 flex flex-col items-center mt-12">
          <img 
            src="/img/logo2.png" 
            alt="Netto Laundromat" 
            className="h-24 w-auto object-contain" 
          />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] bg-white/10 border border-white/15 px-4 py-1.5 rounded-full">
            <HiSparkles className="inline-block mr-1 mb-0.5" /> Program Kemitraan Laundry
          </span>
        </div>

        {/* Teks Deskripsi Pendaftaran */}
        <div className="relative z-10 space-y-4 mb-24 px-6 text-center">
          <h2 className="text-4xl font-black tracking-tight leading-tight">
            Gabung Mitra Kami
          </h2>
          <p className="text-base font-medium text-slate-100/90 leading-relaxed max-w-sm mx-auto">
            Satu dashboard untuk memantau CRM pelanggan, poin loyalty, status antrean kasir, dan laporan omzet real-time.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-blue-200 text-center font-medium opacity-70">
          © {new Date().getFullYear()} Netto Laundry. All rights reserved
        </div>
      </div>

      {/* PANEL KANAN: FORM REGISTRASI BERSIH */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md space-y-6">
          
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black">
              Start For Free
            </span>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Daftar Akun Baru
            </h1>
            <p className="text-sm font-bold text-slate-400">
              Lengkapi formulir untuk bergabung ke sistem Netto
            </p>
          </div>

          {/* ALERT MESSAGES */}
          {error && (
            <div className="p-4 text-sm font-bold text-rose-600 bg-rose-50 rounded-2xl border border-rose-100 animate-pulse">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-2xl border border-emerald-100">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            
            {/* INPUT NAMA LENGKAP */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-1">Nama Lengkap</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <HiOutlineUser size={18} />
                </span>
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="Masukkan nama lengkap..."
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 pl-11 pr-4 py-3 text-sm font-bold text-slate-800 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 shadow-inner"
                />
              </div>
            </div>

            {/* INPUT EMAIL */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-1">Email Kerja</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <HiOutlineMail size={18} />
                </span>
                <input
                  type="email"
                  required
                  disabled={loading}
                  placeholder="nama@nettolaundry.com"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 pl-11 pr-4 py-3 text-sm font-bold text-slate-800 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 shadow-inner"
                />
              </div>
            </div>

            {/* SELECT ROLE */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-1">Pilih Peran (Role)</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <HiOutlineUser size={18} />
                </span>
                <select
                  required
                  disabled={loading}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 pl-11 pr-10 py-3 text-sm font-bold text-slate-800 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 shadow-inner appearance-none cursor-pointer"
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
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-1">Kata Sandi (Password)</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <HiOutlineLockClosed size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 pl-11 pr-12 py-3 text-sm font-bold text-slate-800 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 shadow-inner"
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
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-blue-200 transition-all active:scale-[0.98] cursor-pointer"
              >
                {loading ? "Mendaftarkan..." : "Daftar"} <HiArrowSmRight size={16} />
              </button>

              <button 
                type="button" 
                disabled={loading}
                onClick={handleGoogleSignIn}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 py-3.5 text-sm font-black text-slate-650 transition-all cursor-pointer shadow-2xs"
              >
                <FcGoogle size={18} /> {loading ? "Memproses..." : "Daftar dengan Google"}
              </button>
            </div>
          </form>

          {/* FOOTER SWITCH TO LOGIN */}
          <p className="text-center mt-6 text-sm font-bold text-slate-400">
            Sudah terdaftar sebagai tim?{" "}
            <Link to="/login" className="text-blue-650 font-black hover:text-blue-700 hover:underline transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
