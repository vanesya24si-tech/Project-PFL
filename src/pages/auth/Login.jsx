import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiLogin } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const navigate = useNavigate();
  const [dataForm, setDataForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user", "logged_in");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(26,188,156,0.18),_transparent_45%),_radial-gradient(circle_at_bottom_right,_rgba(23,162,184,0.14),_transparent_32%),_linear-gradient(to_bottom,_#F8FAFB_0%,_#E8F8F5_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl rounded-[2rem] overflow-hidden shadow-2xl bg-white grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-between bg-[#1ABC9C] text-white p-12 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.25em]">
              Laundry Dashboard
            </div>
            <h2 className="mt-8 text-4xl font-black leading-tight">Kelola bisnis laundry Anda dengan satu login.</h2>
            <p className="mt-6 max-w-xs text-slate-100/90 leading-relaxed">Masuk untuk mengakses pesanan, anggota, dan laporan dengan pengalaman admin modern.</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] bg-white/10 p-5 shadow-inner">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-100/80">Real-time insights</p>
              <p className="mt-2 text-sm text-slate-100/85">Monitor performa laundry Anda secara langsung.</p>
            </div>
            <div className="rounded-[1.75rem] bg-white/10 p-5 shadow-inner">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-100/80">Secure access</p>
              <p className="mt-2 text-sm text-slate-100/85">Akun admin Anda terlindungi dan mudah digunakan.</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-16 bg-white">
          <div className="md:hidden mb-8">
            <div className="relative w-full h-64 rounded-[2rem] overflow-hidden bg-[#F8FAFB] shadow-lg">
              <img
                src="https://img.freepik.com/free-vector/clean-laundry-concept-illustration_114360-10103.jpg"
                alt="Login Illustration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1ABC9C]/15 mix-blend-multiply"></div>
            </div>
          </div>

          <div className="mb-10">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-400 font-black mb-3">Selamat datang kembali</div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Masuk ke panel admin Anda</h2>
            <p className="mt-3 text-sm text-slate-500">Masukkan email dan kata sandi untuk melanjutkan pengelolaan laundry Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-12 outline-none focus:border-[#1ABC9C] transition-all"
                  onChange={(e) => setDataForm({ ...dataForm, email: e.target.value })}
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
                  onChange={(e) => setDataForm({ ...dataForm, password: e.target.value })}
                />
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center text-xs font-bold px-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="accent-[#1ABC9C]" /> Ingat saya
              </label>
              <Link to="/forgot" className="text-[#1ABC9C] hover:text-[#148F72] transition-colors">Lupa kata sandi?</Link>
            </div>

            <button type="submit" className="w-full bg-[#1ABC9C] hover:bg-[#16A085] text-white font-black py-4 rounded-2xl shadow-lg transition-all">
              Masuk
            </button>

            <button type="button" className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all">
              <FcGoogle className="text-2xl" /> Masuk dengan Google
            </button>
          </form>

          <p className="text-center mt-8 text-sm font-medium text-slate-500">
            Belum punya akun? <Link to="/register" className="text-[#1ABC9C] font-black hover:underline">Daftar gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}