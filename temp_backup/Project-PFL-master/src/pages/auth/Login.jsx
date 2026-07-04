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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F0F7FF] via-[#F8FAFC] to-[#E0F2FE] flex items-center justify-center p-4 md:p-8 text-[#0F172A] antialiased font-sans relative overflow-hidden">
      
      {/* ELEMEN DEKORATIF GLOWING BACKGROUND */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_32px_64px_-16px_rgba(2,132,199,0.1)] p-6 md:p-8 relative z-10 transition-all">
        
        {/* LOGO & BRANDING */}
        <div className="flex flex-col items-center text-center space-y-4">
          
          {/* Logo Netto Laundry dengan Efek Glow Hover */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md group-hover:blur-xl transition-all duration-300"></div>
            <img 
              src="/img/logo2.png" 
              alt="Netto Laundry Logo" 
              className="relative h-16 w-16 rounded-2xl bg-blue-50 p-2 shadow-md border border-blue-200/50 object-contain" 
            />
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 flex items-center justify-center gap-1">
              NETTO LAUNDRY <HiSparkles className="animate-pulse" />
            </p>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase italic">
              WELCOME <span className="text-blue-500 font-black not-italic">BACK</span>
            </h1>
            <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto">
              Masuk ke panel CRM untuk memantau aktivitas pelanggan dan antrean laundry secara real-time.
            </p>
          </div>
        </div>

        {/* BOX FORM UTAMA */}
        <div className="mt-8">
          
          {/* ALERT ERROR */}
          {error && (
            <div className="mb-4 p-4 text-xs font-bold text-rose-600 bg-rose-50 rounded-2xl border border-rose-100 animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* INPUT EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <HiOutlineMail size={18} />
                </span>
                <input
                  type="email"
                  required
                  disabled={loading}
                  placeholder="namaemail@gmail.com"
                  onChange={(e) => setDataForm({ ...dataForm, email: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/40 pl-11 pr-4 py-3.5 text-xs font-bold text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 shadow-inner disabled:opacity-60"
                />
              </div>
            </div>

            {/* INPUT PASSWORD */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">
                Password
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <HiOutlineLockClosed size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  onChange={(e) => setDataForm({ ...dataForm, password: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/40 pl-11 pr-12 py-3.5 text-xs font-bold text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 shadow-inner disabled:opacity-60"
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
            <div className="flex items-center justify-between text-xs font-bold pt-1 select-none">
              <label className="inline-flex items-center gap-2 cursor-pointer text-slate-500 group">
                <input 
                  type="checkbox" 
                  disabled={loading}
                  className="h-4 w-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500/10 cursor-pointer" 
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-105 active:scale-[0.98] cursor-pointer mt-2 disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk ke Dashboard"} <HiArrowSmRight size={16} />
            </button>
          </form>

          {/* REGISTER FOOTER */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs font-bold text-slate-400">
            Belum punya akun admin?{" "}
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Daftar sekarang
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
