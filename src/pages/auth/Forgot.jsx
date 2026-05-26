import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  HiOutlineMail, 
  HiOutlineArrowNarrowLeft, 
  HiOutlineInformationCircle, 
  HiPaperAirplane,
  HiSparkles 
} from "react-icons/hi";

export default function Forgot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      alert(`Tautan pemulihan akses telah dikirim ke: ${email}`);
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F0F7FF] via-[#F8FAFC] to-[#E0F2FE] flex items-center justify-center p-4 md:p-8 text-[#0F172A] antialiased font-sans relative overflow-hidden">
      
      {/* ELEMEN DEKORATIF GLOWING BACKGROUND */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_32px_64px_-16px_rgba(2,132,199,0.1)] p-6 md:p-8 relative z-10 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* HEADER */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-blue-700 flex items-center gap-1">
              PEMULIHAN AKSES <HiSparkles className="text-blue-500" />
            </span>
          </div>
          <h2 className="text-3xl font-black text-slate-800 leading-tight tracking-tight uppercase italic">
            LUPA KATA <span className="text-blue-500 font-black not-italic">SANDI?</span>
          </h2>
          <p className="mt-2 text-xs font-medium text-slate-400 max-w-xs mx-auto leading-relaxed">
            Jangan khawatir, masukkan email admin Anda di bawah. Kami akan mengirimkan tautan instruksi pemulihan.
          </p>
        </div>

        {/* INFO BOX */}
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 mt-6 mb-6">
          <HiOutlineInformationCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Tautan reset akan berlaku selama <strong className="text-slate-700 font-bold">15 menit</strong>. Pastikan periksa folder spam jika email tidak kunjung masuk ke inbox utama.
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleResetSubmit}>

          {/* EMAIL INPUT */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">
              Email Terdaftar
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <HiOutlineMail size={18} />
              </span>
              <input
                type="email"
                id="email"
                required
                disabled={isSent}
                placeholder="admin@nettolaundry.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/40 pl-11 pr-4 py-3.5 text-xs font-bold text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 shadow-inner disabled:opacity-60"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSent}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-105 active:scale-[0.98] disabled:from-slate-400 disabled:to-slate-500 cursor-pointer"
          >
            <HiPaperAirplane className={`text-sm rotate-45 transition-transform ${isSent ? '' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`} />
            {isSent ? "Mengirim Tautan..." : "Kirim Instruksi"}
          </button>
        </form>

        {/* BACK TO LOGIN */}
        <div className="mt-8 pt-4 border-t border-slate-100">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 tracking-tight transition-colors group"
          >
            <HiOutlineArrowNarrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            Kembali ke halaman login
          </Link>
        </div>

      </div>
    </div>
  );
}