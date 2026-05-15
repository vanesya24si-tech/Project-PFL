import { Link } from "react-router-dom";
import { HiOutlineMail, HiOutlineArrowNarrowLeft, HiOutlineInformationCircle, HiPaperAirplane } from "react-icons/hi";

export default function Forgot() {
  return (
    <div className="w-full max-w-sm mx-auto md:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="mb-8 text-center md:text-left">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-rose-50 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-[0.65rem] font-black tracking-[0.2em] uppercase text-rose-600">
            Pemulihan Akses
          </span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
          Lupa Kata <span className="text-rose-600 italic">Sandi?</span>
        </h2>
        <p className="mt-3 text-sm text-slate-500 leading-relaxed font-medium">
          Jangan khawatir, masukkan email admin Anda di bawah. Kami akan mengirimkan instruksi pemulihan.
        </p>
      </div>

      {/* INFO BOX */}
      <div className="flex items-start gap-3 px-4 py-4 rounded-[1.2rem] bg-slate-50 border border-slate-100 mb-8">
        <HiOutlineInformationCircle className="text-xl text-rose-500 shrink-0 mt-0.5" />
        <p className="text-[0.8rem] text-slate-600 leading-relaxed">
          Tautan reset akan berlaku selama <strong className="text-slate-900">15 menit</strong>. Pastikan periksa folder spam jika email tidak muncul.
        </p>
      </div>

      {/* FORM */}
      <form className="space-y-6" onSubmit={e => e.preventDefault()}>

        {/* EMAIL INPUT */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
            Email Terdaftar
          </label>
          <div className="relative group">
            <input
              type="email"
              id="email"
              required
              placeholder="admin@nettolaundry.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-12 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/5 group-hover:border-slate-300 font-medium"
            />
            <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-rose-500 transition-colors" />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-rose-200 transition-all active:scale-[0.98] group"
        >
          <HiPaperAirplane className="text-lg rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          Kirim Instruksi
        </button>
      </form>

      {/* BACK TO LOGIN */}
      <div className="mt-10 pt-6 border-t border-slate-50">
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors group"
        >
          <HiOutlineArrowNarrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
          Kembali ke halaman login
        </Link>
      </div>

    </div>
  );
}