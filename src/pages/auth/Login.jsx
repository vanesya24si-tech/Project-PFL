import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiLogin } from "react-icons/hi";
import { MdOutlineInventory2 } from "react-icons/md";
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_35%),_radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.1),_transparent_30%),_linear-gradient(to_bottom,_#F6FEF7_0%,_#ECF9F0_100%)] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-[0_40px_120px_rgba(16,185,129,0.12)] bg-white">
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <img src="/logo192.png" alt="Netto Logo" className="h-16 w-16 rounded-full bg-[#10B981]/10 p-3" />
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#10B981]">Customer Relationship Management</p>
            <h1 className="text-5xl font-extrabold text-[#0F172A]">Selamat Datang</h1>
            <p className="max-w-xl text-sm text-[#475569]">Masuk ke panel admin Netto Laundry CRM untuk mengelola pelanggan, transaksi, notifikasi, dan laporan dalam satu platform.</p>
          </div>

          <div className="mt-10 bg-[#F8FEF8] border border-[#DCFCE7] rounded-[2rem] p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#0F172A]">Login</h2>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[#475569]">Email Address</label>
                  <input
                    type="email"
                    placeholder="namaemail@gmail.com"
                    className="w-full rounded-3xl border border-[#D1FAE5] bg-white px-5 py-4 text-sm text-[#0F172A] outline-none transition focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
                    onChange={(e) => setDataForm({ ...dataForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[#475569]">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-3xl border border-[#D1FAE5] bg-white px-5 py-4 text-sm text-[#0F172A] outline-none transition focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
                      onChange={(e) => setDataForm({ ...dataForm, password: e.target.value })}
                    />
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <MdOutlineInventory2 className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-[#475569]">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-[#D1FAE5] accent-[#10B981]" />
                  Ingat saya
                </label>
                <Link to="/forgot" className="text-[#10B981] font-semibold hover:text-[#047857] transition-colors">Lupa password?</Link>
              </div>

              <button type="submit" className="w-full rounded-[1.5rem] bg-[#10B981] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-[#10B981]/20 transition hover:bg-[#0f766e]">
                Login
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#64748B]">
              Belum punya akun? <Link to="/register" className="font-semibold text-[#10B981] hover:text-[#047857]">Daftar sekarang</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}