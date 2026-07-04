import React, { useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { submitFeedback } from "../../utils/feedbackStorage";
import {
  HiStar,
  HiChatAlt2,
  HiCheckCircle,
  HiPaperAirplane,
} from "react-icons/hi";

const SERVICES = [
  "Cuci Komplit",
  "Cuci Kering",
  "Setrika Saja",
  "Express 6 Jam",
  "Laundry Bedcover",
  "Cuci Sepatu",
  "Lainnya",
];

const RATING_LABELS = ["", "Sangat Buruk", "Buruk", "Cukup", "Bagus", "Sangat Bagus!"];

export default function UserFeedback() {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [service, setService] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "Pelanggan";
  const phone = user?.user_metadata?.phone || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Pilih rating bintang terlebih dahulu.");
      return;
    }
    if (!comment.trim()) {
      setError("Tulis komentar sebelum mengirim.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await submitFeedback({
        customerName: name,
        phone,
        rating,
        comment: comment.trim(),
        service,
      });
      setSuccess(true);
      setRating(0);
      setComment("");
      setService("");
    } catch (err) {
      setError("Gagal mengirim ulasan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── SUCCESS SCREEN ─────────────────────────────────────────── */
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-5">
        {/* Animated emerald checkmark */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-bounce">
            <HiCheckCircle size={48} className="text-white" />
          </div>
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-3xl bg-emerald-400/20 blur-xl -z-10 animate-pulse" />
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-sm px-8 py-6 max-w-xs w-full">
          <h2 className="text-xl font-black text-slate-800">Terima Kasih!</h2>
          <p className="text-sm text-slate-400 font-medium mt-2 leading-relaxed">
            Ulasan kamu sudah kami terima. Masukan Anda sangat berarti untuk Netto Laundry 💙
          </p>
        </div>

        <button
          onClick={() => setSuccess(false)}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-sm font-black rounded-2xl shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 hover:shadow-xl transition-all active:scale-95 uppercase tracking-widest"
        >
          Kirim Ulasan Lagi
        </button>
      </div>
    );
  }

  /* ── MAIN FORM ──────────────────────────────────────────────── */
  return (
    <div className="space-y-4">
      {/* PREMIUM AMBER GRADIENT HEADER CARD */}
      <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-amber-500 via-orange-400 to-yellow-400 shadow-xl shadow-amber-500/25">
        {/* Decorative blobs */}
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-lg pointer-events-none" />

        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
            <HiChatAlt2 size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white leading-tight">Beri Ulasan</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mt-0.5">
              Bantu kami jadi lebih baik
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* STAR RATING */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">
            Bagaimana pengalaman Anda? *
          </p>
          <div className="flex gap-2 justify-center mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-125 active:scale-95"
                style={{ lineHeight: 0 }}
              >
                <HiStar
                  size={40}
                  className={`transition-all duration-150 drop-shadow-sm ${
                    star <= (hovered || rating)
                      ? "text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]"
                      : "text-slate-200"
                  }`}
                />
              </button>
            ))}
          </div>
          {(hovered || rating) > 0 && (
            <p className="text-center text-sm font-black text-amber-500 tracking-wide">
              {RATING_LABELS[hovered || rating]}
            </p>
          )}
        </div>

        {/* SERVICE SELECTOR — pill-shaped flex-wrap */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">
            Layanan yang digunakan
          </label>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setService(s)}
                className={`py-2 px-4 rounded-full text-[10px] font-black uppercase tracking-wide transition-all border ${
                  service === s
                    ? "bg-gradient-to-r from-amber-500 to-orange-400 text-white border-transparent shadow-lg shadow-amber-500/20"
                    : "bg-white/60 text-slate-400 border-slate-200 hover:border-amber-300 hover:text-amber-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* COMMENT — glassmorphism wrapper */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-sm p-5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">
            Komentar Anda *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Ceritakan pengalaman mencuci Anda di Netto Laundry..."
            className="w-full px-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-2xl font-medium text-slate-700 placeholder:text-slate-300 focus:border-amber-400 outline-none resize-none transition-all"
          />
          <p className="text-[10px] text-slate-300 font-medium mt-1 text-right">
            {comment.length} karakter
          </p>
        </div>

        {/* ERROR — rose glassmorphism */}
        {error && (
          <div className="bg-rose-50/80 backdrop-blur-md border border-rose-200 rounded-2xl px-4 py-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />
            <p className="text-sm font-bold text-rose-600">{error}</p>
          </div>
        )}

        {/* SUBMIT — amber gradient */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 hover:shadow-xl transition-all active:scale-95 disabled:opacity-60"
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <HiPaperAirplane size={14} className="-rotate-45" />
              Kirim Ulasan
            </>
          )}
        </button>

        <div className="h-4" />
      </form>
    </div>
  );
}
