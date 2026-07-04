import { useEffect, useMemo, useState } from "react";
import {
  HiChatAlt,
  HiStar,
  HiThumbUp,
  HiThumbDown,
  HiOutlineBadgeCheck,
  HiLightningBolt,
  HiReply,
  HiCheck,
  HiX,
  HiSearch,
  HiRefresh,
} from "react-icons/hi";
import { MdOutlineRateReview } from "react-icons/md";
import { loadFeedback, saveFeedbackReply } from "../utils/feedbackStorage";

const FILTER_TABS = ["Semua", "Puas", "Netral", "Keluhan"];

export default function Feedback() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [savingReply, setSavingReply] = useState(false);
  const [replySaved, setReplySaved] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  async function fetchFeedback() {
    setLoading(true);
    try {
      const data = await loadFeedback();
      setReviews(data || []);
    } catch (err) {
      console.error("Gagal memuat feedback:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    setReplySaved("");
  }, [replyingTo]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (reviews.reduce((s, r) => s + (r.rate || 0), 0) / reviews.length).toFixed(1);
  }, [reviews]);

  const filtered = useMemo(() => {
    let result = reviews;
    if (activeFilter !== "Semua") result = result.filter((r) => r.tag === activeFilter);
    if (search.trim()) {
      result = result.filter(
        (r) =>
          r.user?.toLowerCase().includes(search.toLowerCase()) ||
          r.comment?.toLowerCase().includes(search.toLowerCase()) ||
          r.service?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
  }, [reviews, activeFilter, search]);

  const handleReplySubmit = async (reviewId, userName) => {
    const draft = replyDrafts[reviewId] || "";
    if (!draft.trim()) return;
    setSavingReply(true);
    try {
      await saveFeedbackReply(reviewId, draft.trim());
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, reply: draft.trim() } : r))
      );
      setReplyDrafts((prev) => ({ ...prev, [reviewId]: "" }));
      setReplyingTo(null);
      setReplySaved(`Balasan berhasil disimpan untuk ${userName}.`);
      setTimeout(() => setReplySaved(""), 4000);
    } catch (err) {
      console.error("Gagal menyimpan balasan:", err);
    } finally {
      setSavingReply(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-6 md:p-12 flex items-center justify-center font-sans antialiased text-[#0F172A]">
      <div className="bg-white rounded-[3rem] border border-blue-50 shadow-2xl shadow-blue-900/5 p-8 md:p-12 max-w-4xl w-full space-y-8 relative overflow-hidden">

        {/* DECORATIVE */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -mr-8 -mt-8 z-0 opacity-50" />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 pb-8 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-sm font-black uppercase tracking-widest text-blue-600">
              <HiLightningBolt /> Kepuasan Pengguna
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Feedback <span className="text-blue-600">&amp; Review</span>
            </h1>
            <p className="text-base font-bold text-slate-400 max-w-xl">
              Pantau dan kelola seluruh ulasan masuk dari pengguna layanan Netto Laundry.
            </p>
          </div>

          {/* RATING CARD */}
          <div className="rounded-[1.5rem] bg-blue-600 p-5 text-white shadow-lg shadow-blue-100 flex items-center gap-4 shrink-0 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-sm font-black uppercase tracking-widest text-blue-200">Rating Rata-rata</p>
              <h2 className="text-3xl font-black tracking-tight mt-0.5">
                {avgRating} <span className="text-base font-normal text-blue-200">/ 5.0</span>
              </h2>
              <div className="flex text-yellow-300 mt-1 gap-0.5">
                {[...Array(5)].map((_, idx) => (
                  <HiStar key={idx} size={14} className={idx < Math.round(Number(avgRating)) ? "text-yellow-300" : "text-blue-400"} />
                ))}
              </div>
            </div>
            <div className="absolute -right-2 -bottom-2 w-14 h-14 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all" />
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="relative z-10 space-y-3">
          <div className="relative">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, komentar, atau layanan..."
              className="w-full pl-10 pr-4 py-3 text-base rounded-2xl border border-slate-200 bg-slate-50 font-bold placeholder:text-slate-300 focus:outline-none focus:border-blue-400 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-1.5 rounded-xl text-sm font-black uppercase tracking-wide transition-all ${
                  activeFilter === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {tab}
                {tab !== "Semua" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({reviews.filter((r) => r.tag === tab).length})
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={fetchFeedback}
              className="ml-auto p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
              title="Refresh"
            >
              <HiRefresh size={18} />
            </button>
          </div>
        </div>

        {/* SUCCESS BANNER */}
        {replySaved && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-base font-bold text-emerald-700 relative z-10">
            {replySaved}
          </div>
        )}

        {/* FEEDBACK LIST */}
        <div className="space-y-5 relative z-10">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-base font-bold text-slate-400">Memuat feedback...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-3xl">
              <HiChatAlt size={40} className="text-slate-200 mx-auto mb-3" />
              <p className="text-lg font-black text-slate-300">
                {search || activeFilter !== "Semua" ? "Tidak ada feedback yang cocok" : "Belum ada feedback masuk"}
              </p>
              <p className="text-base text-slate-300 mt-1">
                {!search && activeFilter === "Semua" && "Feedback dari pelanggan akan muncul di sini."}
              </p>
            </div>
          ) : filtered.map((r) => {
            const isReplying = replyingTo === r.id;
            return (
              <div key={r.id} className="rounded-[2rem] border border-slate-100 bg-slate-50/50 p-6 md:p-7 space-y-4 hover:border-blue-100 hover:bg-white transition-all shadow-sm group">
                <div className="flex items-start gap-4">

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-base shrink-0 border border-blue-100/50 shadow-inner">
                    {r.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-black text-slate-800 text-lg tracking-tight">{r.user}</h4>
                          <HiOutlineBadgeCheck className="text-blue-500" size={16} />
                        </div>
                        {r.service && (
                          <p className="text-sm text-slate-400 font-bold mt-0.5">Layanan: {r.service}</p>
                        )}
                        <div className="flex text-amber-400 mt-1 gap-0.5">
                          {[...Array(5)].map((_, idx) => (
                            <HiStar key={idx} size={14} className={idx < r.rate ? "text-amber-400" : "text-slate-200"} />
                          ))}
                        </div>
                      </div>

                      <span className={`self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-black uppercase tracking-wider border ${
                        r.tag === "Puas"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : r.tag === "Netral"
                          ? "bg-slate-50 text-slate-500 border-slate-200"
                          : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}>
                        {r.tag === "Puas" ? <HiThumbUp size={12} /> : <HiThumbDown size={12} />}
                        {r.tag}
                      </span>
                    </div>

                    {/* Comment */}
                    <div className="mt-4">
                      <p className="text-base text-slate-600 leading-relaxed font-bold italic">
                        "{r.comment}"
                      </p>
                    </div>

                    {/* Existing reply */}
                    {r.reply && !isReplying && (
                      <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                        <p className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1">Balasan Admin</p>
                        <p className="text-base font-bold text-slate-700">{r.reply}</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-5 pt-4 border-t border-slate-100/60 flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
                      <span className="text-slate-400 flex items-center gap-1.5 font-medium text-base">
                        <MdOutlineRateReview size={16} className="text-blue-500" /> Dikirim {r.date}
                      </span>
                      <button
                        type="button"
                        onClick={() => setReplyingTo(isReplying ? null : r.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-base font-black"
                      >
                        <HiReply size={14} />
                        {isReplying ? "Tutup Balasan" : r.reply ? "Edit Balasan" : "Balas Review"}
                      </button>
                    </div>

                    {/* Reply form */}
                    {isReplying && (
                      <div className="rounded-2xl border border-blue-100 bg-white p-4 space-y-3 mt-3">
                        <label className="text-sm font-black uppercase tracking-wider text-slate-500">Tulis balasan</label>
                        <textarea
                          rows="3"
                          value={replyDrafts[r.id] || r.reply || ""}
                          onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
                          placeholder="Tulis balasan untuk pelanggan..."
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleReplySubmit(r.id, r.user)}
                            disabled={savingReply}
                            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-black uppercase tracking-wider text-white transition-all hover:bg-blue-700 disabled:opacity-60"
                          >
                            {savingReply ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <HiCheck size={14} />
                            )}
                            Simpan Balasan
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyDrafts((prev) => ({ ...prev, [r.id]: "" }));
                            }}
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black uppercase tracking-wider text-slate-600 transition-all hover:bg-slate-50"
                          >
                            <HiX size={14} /> Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* COUNT INFO */}
        {!loading && (
          <p className="text-center text-sm text-slate-400 font-bold relative z-10">
            Menampilkan {filtered.length} dari {reviews.length} ulasan
          </p>
        )}

      </div>
    </div>
  );
}