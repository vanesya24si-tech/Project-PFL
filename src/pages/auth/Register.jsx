import { Link } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineUserAdd } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(26,188,156,0.18),_transparent_30%),_radial-gradient(circle_at_bottom_right,_rgba(26,188,156,0.12),_transparent_25%),_linear-gradient(to_bottom,_#F8FAFB_0%,_#E8F8F5_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl rounded-[2rem] overflow-hidden shadow-2xl bg-white grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-between bg-[#1ABC9C] text-white p-12 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.25em]">
              Laundry Partner
            </div>
            <h2 className="mt-8 text-4xl font-black leading-tight">Buat akun admin Anda dengan mudah.</h2>
            <p className="mt-6 max-w-xs text-slate-100/90 leading-relaxed">Kelola anggota, pesanan, dan laporan dari dashboard yang bersih untuk bisnis laundry.</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] bg-white/10 p-5 shadow-inner">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-100/80">Pendaftaran cepat</p>
              <p className="mt-2 text-sm text-slate-100/85">Daftar cepat dan mulai pantau pertumbuhan bisnis Anda.</p>
            </div>
            <div className="rounded-[1.75rem] bg-white/10 p-5 shadow-inner">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-100/80">Siap berkembang</p>
              <p className="mt-2 text-sm text-slate-100/85">Dirancang untuk admin yang ingin alur kerja laundry efisien.</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-16 bg-white">
          <div className="md:hidden mb-8">
            <div className="relative w-full h-64 rounded-[2rem] overflow-hidden bg-[#F8FAFB] shadow-lg">
              <img
                src="https://img.freepik.com/free-vector/laundry-service-concept-illustration_114360-8438.jpg"
                alt="Register Illustration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1ABC9C]/15 mix-blend-multiply"></div>
            </div>
          </div>

          <div className="mb-10">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-400 font-black mb-3">Buat akun</div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Bergabung dengan tim admin laundry Anda.</h2>
            <p className="mt-3 text-sm text-slate-500">Isi beberapa detail untuk mulai mengelola operasional Anda dengan jelas.</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Nama Lengkap</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-12 outline-none focus:border-[#1ABC9C] transition-all"
                />
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="nama@laundry.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-12 outline-none focus:border-[#1ABC9C] transition-all"
                />
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-12 outline-none focus:border-[#1ABC9C] transition-all"
                />
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#1ABC9C] hover:bg-[#16A085] text-white font-black py-4 rounded-2xl shadow-lg mt-4 transition-all">
              Daftar
            </button>

            <button type="button" className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-3">
              <FcGoogle className="text-2xl" /> Daftar dengan Google
            </button>
          </form>

          <p className="text-center mt-8 text-sm font-medium text-slate-500">
            Sudah punya akun? <Link to="/login" className="text-[#1ABC9C] font-black hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}