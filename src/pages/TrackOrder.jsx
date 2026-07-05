import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { HiCheckCircle, HiClock, HiExclamationCircle } from "react-icons/hi";
import { MdLocalLaundryService, MdIron, MdLayers } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { getOrderById, subscribeToOrder, STEP_THEME } from "../utils/ordersStorage";
import { useAuth } from "../utils/AuthContext";

// ====================================================================
// HALAMAN PUBLIK — dibuka pelanggan lewat scan barcode/QR di struk.
// TIDAK memerlukan login. Data diambil sekali di awal, lalu di-subscribe
// REALTIME ke Supabase supaya progress ikut bergerak begitu admin
// update status di halaman /tracking, tanpa perlu refresh manual.
// ====================================================================

export default function TrackOrder() {
  const { orderId } = useParams();
  const { role } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    let isMounted = true;

    async function init() {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await getOrderById(orderId);
      if (!isMounted) return;

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setOrder(data);
      setLoading(false);

      // Begitu ada perubahan status dari admin, state di sini otomatis update
      unsubscribe = subscribeToOrder(orderId, (updated) => {
        setOrder(updated);
      });
    }

    init();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Memuat status laundry...</p>
        </div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
        <div className="text-center max-w-sm bg-white border border-dashed border-slate-300 rounded-3xl p-8 space-y-3">
          <HiExclamationCircle className="text-5xl text-slate-300 mx-auto" />
          <h1 className="text-xl font-black text-slate-800">Nota Tidak Ditemukan</h1>
          <p className="text-sm font-medium text-slate-400">
            Nomor nota <span className="font-bold">{orderId}</span> tidak ada di sistem kami. Pastikan barcode/QR
            yang dipindai masih valid, atau hubungi laundry untuk konfirmasi.
          </p>
          <Link to="/" className="inline-block text-sm font-black text-blue-600 uppercase tracking-wide">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const steps = STEP_THEME;

  const themeStyles = [
    { bg: "bg-slate-50/60", border: "border-slate-200", accent: "bg-slate-600", icon: "text-slate-600" },
    { bg: "bg-blue-50/60", border: "border-blue-200", accent: "bg-blue-600", icon: "text-blue-600" },
    { bg: "bg-amber-50/60", border: "border-amber-200", accent: "bg-amber-600", icon: "text-amber-600" },
    { bg: "bg-green-50/60", border: "border-green-200", accent: "bg-green-600", icon: "text-green-600" },
  ][order.currentStep] || { bg: "bg-slate-50/60", border: "border-slate-200", accent: "bg-slate-600", icon: "text-slate-600" };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 flex items-center justify-center">
      <div className={`w-full max-w-lg rounded-3xl border-2 ${themeStyles.border} ${themeStyles.bg} p-6 md:p-8 shadow-sm`}>
        <div className="text-center mb-6">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Netto Laundry • Live Tracking</p>
          <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
            {order.id}
          </span>
        </div>

        <div className="flex flex-col items-center gap-3 mb-8">
          <div className={`w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-4xl ${themeStyles.icon}`}>
            {order.currentStep === 0 && <MdLayers />}
            {order.currentStep === 1 && <MdLocalLaundryService className="animate-spin" style={{ animationDuration: "4s" }} />}
            {order.currentStep === 2 && <MdIron />}
            {order.currentStep === 3 && <HiCheckCircle />}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{order.user}</h2>
            {order.phone && (
              <p className="text-xs font-bold text-slate-400 mt-1">📱 {order.phone}</p>
            )}
          </div>
          <p className={`text-xl font-black ${themeStyles.icon}`}>{order.status}</p>
        </div>

        {/* PROGRESS STEPPER — sama persis dengan yang admin lihat, biar konsisten */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {steps.map((step, idx) => {
            const isDone = order.currentStep >= idx;
            const isCurrent = order.currentStep === idx;
            return (
              <div key={idx} className="space-y-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    isDone ? step.color : "bg-white border border-slate-200"
                  } ${isCurrent ? "ring-4 ring-white shadow-sm animate-pulse" : ""}`}
                />
                <p className={`text-[11px] font-black uppercase text-center ${isDone ? step.text : "text-slate-300"}`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-white/90 p-4 rounded-2xl border border-slate-200/80 space-y-2 mb-6">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-400">Nomor Nota</span>
            <span className="text-slate-800">{order.id}</span>
          </div>
          {order.phone && (
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-400">Kontak Pelanggan</span>
              <span className="text-slate-800">{order.phone}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-400">Layanan</span>
            <span className="text-slate-800">{order.service} • {order.weight}</span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-400">Total Tagihan</span>
            <span className="text-slate-800">Rp {Number(order.price || 0).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-400">Status Bayar</span>
            <span className={order.isPaid ? "text-green-600" : "text-rose-600"}>
              {order.isPaid ? "Lunas" : "Belum Bayar"}
            </span>
          </div>
          {order.detail && (
            <p className="text-sm italic text-slate-500 pt-2 border-t border-slate-100">"{order.detail}"</p>
          )}
          {order.eta && (
            <div className="flex items-center gap-1.5 text-slate-400 pt-1">
              <HiClock className="text-base" />
              <span className="text-[10px] font-bold uppercase tracking-tight">
                {order.eta === "Selesai" ? "Siap Diambil" : `Estimasi: ${order.eta}`}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Halo, saya mau tanya soal laundry saya nomor nota ${order.id}.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
          >
            <FaWhatsapp size={16} /> Hubungi Laundry
          </a>

          {role === "customer" ? (
            <Link
              to="/user"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
            >
              <HiExclamationCircle size={16} /> Masuk Dasbor Pelanggan & Komplain
            </Link>
          ) : (
            <Link
              to={`/cek-order?orderId=${order.id}`}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
            >
              <HiExclamationCircle size={16} /> Verifikasi untuk Ajukan Komplain
            </Link>
          )}
        </div>

        <p className="text-center text-[10px] font-medium text-slate-400 mt-4">
          Halaman ini update otomatis secara realtime setiap kali status laundry kamu berubah.
        </p>
      </div>
    </div>
  );
}
