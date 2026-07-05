import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { HiOutlineSearchCircle, HiPhone, HiClipboardList, HiArrowLeft, HiArrowSmRight } from "react-icons/hi";
import { MdLocalLaundryService } from "react-icons/md";
import { getOrderById } from "../utils/ordersStorage";
import { useAuth } from "../utils/AuthContext";

export default function CekOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsCustomer } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const paramOrderId = queryParams.get("orderId") || "";

  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (paramOrderId) {
      setOrderId(paramOrderId.toUpperCase());
    }
  }, [paramOrderId]);

  const normalize = (s) => s?.replace(/\D/g, "") ?? "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!orderId.trim() || !phone.trim()) {
      setError("Mohon isi No. Order dan No. HP terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: fetchErr } = await getOrderById(orderId.trim().toUpperCase());

      if (fetchErr || !data) {
        setError("No. Order tidak ditemukan. Pastikan penulisan sudah benar.");
        return;
      }

      // Verifikasi nomor HP cocok dengan order
      const inputPhone = normalize(phone);
      const orderPhone = normalize(data.phone);

      if (orderPhone && inputPhone && orderPhone !== inputPhone) {
        setError("No. HP tidak sesuai dengan data order. Silakan cek kembali.");
        return;
      }

      // Lolos verifikasi → login sebagai customer & redirect ke portal /user
      loginAsCustomer(data);
      navigate("/user");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md">
            N
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-slate-800 italic uppercase">
              Netto<span className="text-blue-600 not-italic">Laundry</span>
            </span>
            <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold leading-none">
              Cek Status Cucian
            </span>
          </div>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <HiArrowLeft size={14} /> Kembali
        </Link>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">

          {/* ICON & TITLE */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-200">
              <MdLocalLaundryService size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Cek Status Cucian</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Masukkan No. Order dan No. HP untuk melihat status laundry Anda.
              </p>
            </div>
          </div>

          {/* FORM CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">

            {/* ERROR ALERT */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                <p className="text-sm font-bold text-rose-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* NO. ORDER */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 pl-1">
                  Nomor Order
                </label>
                <div className="relative">
                  <HiClipboardList
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Contoh: ORD-1234"
                    disabled={loading}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400 uppercase"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium pl-1">
                  No. Order tercetak di struk / barcode yang diberikan kasir.
                </p>
              </div>

              {/* NO. HP */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 pl-1">
                  Nomor HP / WhatsApp
                </label>
                <div className="relative">
                  <HiPhone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    disabled={loading}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium pl-1">
                  Nomor yang sama saat Anda menitipkan cucian di kasir.
                </p>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-2.5 text-sm font-black uppercase tracking-widest text-white shadow-md shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? "Mencari..." : (
                  <>
                    <HiOutlineSearchCircle size={18} />
                    Cek Status Sekarang
                  </>
                )}
              </button>
            </form>
          </div>

          {/* SEPARATOR */}
          <div className="flex items-center gap-3 text-slate-400">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-bold">atau</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* ADMIN LOGIN */}
          <div className="text-center space-y-2">
            <p className="text-xs text-slate-500 font-medium">Anda seorang admin / kasir outlet?</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-all active:scale-[0.98]"
            >
              Login Admin <HiArrowSmRight size={14} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
