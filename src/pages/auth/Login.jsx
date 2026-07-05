import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiEye, 
  HiEyeOff,
  HiArrowSmRight,
  HiSparkles
} from "react-icons/hi";
import { useAuth } from "../../utils/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [dataForm, setDataForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const sessionData = await login(dataForm.email, dataForm.password);
      const resolvedRole = sessionData?.user?.user_metadata?.role || "customer";
      navigate(resolvedRole === "admin" ? "/dashboard" : "/");
    } catch (err) {
      console.error("Login error:", err);
      let errMsg = "Email atau password salah.";
      if (err) {
        if (typeof err === "string") {
          errMsg = err;
        } else if (err.message && typeof err.message === "string") {
          errMsg = err.message;
        } else {
          try {
            errMsg = JSON.stringify(err);
          } catch (e) {
            errMsg = String(err);
          }
        }
      }
      if (errMsg === "{}" || errMsg === "null" || !errMsg) {
        errMsg = "Terjadi kesalahan koneksi atau konfigurasi Supabase. Pastikan email dan password sudah benar.";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex font-sans text-[#0F172A] antialiased relative overflow-hidden">
      
      {/* PANEL KIRI: BIRU MELENGKUNG BESAR (SPLASH) */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 text-white flex-col justify-between p-12 relative overflow-hidden" style={{ borderBottomRightRadius: '50% 100%', borderTopRightRadius: '0%' }}>
        {/* Dekorasi lingkaran transparan */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-20 -mt-20 blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500 rounded-full translate-x-1/4 translate-y-1/4 opacity-40"></div>

        {/* Logo brand */}
        <div className="space-y-4 relative z-10 flex flex-col items-center mt-20">
          <img 
            src="/img/logo2.png" 
            alt="Netto Laundromat" 
            className="h-28 w-auto object-contain" 
          />
          <p className="text-xl font-bold tracking-widest text-blue-200">LAUNDROMAT</p>
        </div>

        {/* Teks Sambutan */}
        <div className="relative z-10 space-y-3 mb-24 text-center">
          <h2 className="text-5xl font-black tracking-tight leading-tight">
            Selamat Datang!
          </h2>
          <p className="text-lg font-medium text-blue-150">
            Masuk ke panel Admin <span className="font-bold text-white">Netto Laundry</span>
          </p>
        </div>

        {/* Hak cipta footer */}
        <div className="relative z-10 text-xs text-blue-200 text-center font-medium opacity-70">
          © {new Date().getFullYear()} Netto Laundry. All rights reserved
        </div>
      </div>

      {/* PANEL KANAN: FORM LOGIN BERSIH MINIMALIS */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">
              Selamat Datang
            </h1>
            <p className="text-sm font-bold text-slate-400">
              Masuk ke panel Netto Laundry CRM
            </p>
          </div>

          <h2 className="text-2xl font-black text-slate-800 text-center uppercase tracking-wider mt-4">
            Login
          </h2>

          {/* ALERT ERROR */}
          {error && (
            <div className="p-4 text-sm font-bold text-rose-600 bg-rose-50 rounded-2xl border border-rose-100 animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* INPUT EMAIL */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-1">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <HiOutlineMail size={18} />
                </span>
                <input
                  type="email"
                  required
                  disabled={loading}
                  placeholder="admin@netto.com"
                  onChange={(e) => setDataForm({ ...dataForm, email: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 pl-11 pr-4 py-3.5 text-sm font-bold text-slate-800 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 shadow-inner"
                />
              </div>
            </div>

            {/* INPUT PASSWORD */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-1">
                Password
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <HiOutlineLockClosed size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  onChange={(e) => setDataForm({ ...dataForm, password: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 pl-11 pr-12 py-3.5 text-sm font-bold text-slate-800 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 shadow-inner"
                />
                <button 
                  type="button" 
                  disabled={loading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div className="flex items-center justify-between text-sm font-bold pt-1 select-none">
              <label className="inline-flex items-center gap-2 cursor-pointer text-slate-500 group">
                <input 
                  type="checkbox" 
                  disabled={loading}
                  className="h-4 w-4 rounded text-blue-600 border-slate-350 focus:ring-blue-500/10 cursor-pointer" 
                />
                <span className="group-hover:text-slate-700 transition-colors">Ingat saya</span>
              </label>
              <Link 
                to="/forgot" 
                className="text-blue-600 hover:text-blue-700 hover:underline tracking-tight transition-all"
              >
                Lupa password?
              </Link>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-blue-200 transition-all active:scale-[0.98] cursor-pointer mt-2"
            >
              {loading ? "Memproses..." : "Login"} <HiArrowSmRight size={16} />
            </button>
          </form>

          {/* CUSTOMER FOOTER */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm font-bold text-slate-400">
            Pelanggan yang ingin cek cucian?{" "}
            <Link 
              to="/cek-order" 
              className="text-blue-600 font-black hover:text-blue-700 hover:underline transition-colors"
            >
              Cek Order di sini
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
