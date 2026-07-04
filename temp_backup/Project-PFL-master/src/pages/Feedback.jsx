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
} from "react-icons/hi";
import { MdOutlineRateReview } from "react-icons/md";
import { loadFeedbackReplies, saveFeedbackReply } from "../utils/feedbackStorage";

export default function Feedback() {
  const [reviews, setReviews] = useState([
    { 
      user: "Dewi Lestari", 
      rate: 5, 
      comment: "Wangi banget dan rapi setrikanya! Pelayanan antar jemputnya juga sangat ramah.", 
      date: "Tadi pagi",
      tag: "Puas",
      avatar: "DL"
    },
    { 
      user: "Andi Saputra", 
      rate: 4, 
      comment: "Cepat sampai, tapi ada sedikit lipatan di kerah baju kemeja saya.", 
      date: "Kemarin, 14:20",
      tag: "Saran",
      avatar: "AS"
    },
    { 
      user: "Siti Aisyah", 
      rate: 5, 
      comment: "Langganan terbaik! Selalu konsisten kebersihannya.", 
      date: "2 hari lalu",
      tag: "Puas",
      avatar: "SA"
    },
  ]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replySaved, setReplySaved] = useState("");

  const replies = useMemo(() => loadFeedbackReplies(), []);

  useEffect(() => {
    setReplySaved("");
  }, [replyingTo]);

  const handleReplySubmit = (reviewIndex) => {
    const draft = replyDrafts[reviewIndex] || "";
    if (!draft.trim()) return;

    const reviewKey = `review-${reviewIndex}`;
    saveFeedbackReply(reviewKey, draft.trim());
    setReplyDrafts((prev) => ({ ...prev, [reviewIndex]: "" }));
    setReplyingTo(null);
    setReplySaved(`Balasan berhasil disimpan untuk ${reviews[reviewIndex].user}.`);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-6 md:p-12 flex items-center justify-center font-sans antialiased text-[#0F172A]">
      <div className="bg-white rounded-[3rem] border border-blue-50 shadow-2xl shadow-blue-900/5 p-8 md:p-12 max-w-4xl w-full space-y-8 relative overflow-hidden">
        
        {/* DECORATIVE ELEMENT */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -mr-8 -mt-8 z-0 opacity-50" />

        {/* TOP BAR / NAVIGATION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 pb-8 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600">
              <HiLightningBolt /> Kepuasan Pengguna
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
              Feedback <span className="text-blue-600">& Review</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 max-w-xl">
              Pantau dan kelola seluruh ulasan masuk dari pengguna layanan Netto Laundry.
            </p>
          </div>

          {/* CONSOLIDATED RATING CARD */}
          <div className="rounded-[1.5rem] bg-blue-600 p-5 text-white shadow-lg shadow-blue-100 flex items-center gap-4 shrink-0 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[9px] font-black uppercase tracking-widest text-blue-200">Rating Rata-rata</p>
              <h2 className="text-2xl font-black tracking-tight mt-0.5">
                4.8 <span className="text-xs font-normal text-blue-200">/ 5.0</span>
              </h2>
              <div className="flex text-yellow-300 mt-1 gap-0.5">
                {[...Array(5)].map((_, idx) => (
                  <HiStar key={idx} size={14} className={idx < 4 ? "text-yellow-300" : "text-blue-400"} />
                ))}
              </div>
            </div>
            <div className="absolute -right-2 -bottom-2 w-14 h-14 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all" />
          </div>
        </div>

        {replySaved && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[11px] font-bold text-emerald-700 relative z-10">
            {replySaved}
          </div>
        )}

        {/* FEEDBACK LIST CONTAINER */}
        <div className="space-y-5 relative z-10">
          {reviews.map((r, i) => {
            const reviewKey = `review-${i}`;
            const savedReply = replies[reviewKey] || "";
            const isReplying = replyingTo === i;

            return (
            <div key={i} className="rounded-[2rem] border border-slate-100 bg-slate-50/50 p-6 md:p-7 space-y-4 hover:border-blue-100 hover:bg-white transition-all shadow-sm group">
              <div className="flex items-start gap-4">
                
                {/* Modern Rounded Avatar */}
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm shrink-0 border border-blue-100/50 shadow-inner">
                  {r.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Top Metadata Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-slate-800 text-sm tracking-tight">{r.user}</h4>
                        <HiOutlineBadgeCheck className="text-blue-500" size={16} title="Verified Customer" />
                      </div>
                      
                      {/* Star Rating */}
                      <div className="flex text-amber-400 mt-1 gap-0.5">
                        {[...Array(5)].map((_, idx) => (
                          <HiStar key={idx} size={14} className={idx < r.rate ? "text-amber-400" : "text-slate-200"} />
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Status Badge */}
                    <span className={`self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                      r.tag === "Puas" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                      {r.tag === "Puas" ? <HiThumbUp size={12} /> : <HiThumbDown size={12} />}
                      {r.tag}
                    </span>
                  </div>

                  {/* Comment Content Area */}
                  <div className="mt-4">
                    <p className="text-xs text-slate-600 leading-relaxed font-bold italic">
                      "{r.comment}"
                    </p>
                  </div>

                  {/* Action Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-100/60 flex flex-col gap-3 md:flex-row md:justify-between md:items-center text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium normal-case text-xs">
                      <MdOutlineRateReview size={16} className="text-blue-500" /> Dikirim {r.date}
                    </span>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(isReplying ? null : i)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                    >
                      <HiReply size={14} /> {isReplying ? "Tutup Balasan" : "Balas Review"}
                    </button>
                  </div>

                  {savedReply && !isReplying && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-[11px] font-bold text-emerald-700">
                      <p className="text-[10px] uppercase tracking-wider mb-1">Balasan Tersimpan</p>
                      <p>{savedReply}</p>
                    </div>
                  )}

                  {isReplying && (
                    <div className="rounded-2xl border border-blue-100 bg-white p-4 space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tulis balasan</label>
                      <textarea
                        rows="3"
                        value={replyDrafts[i] || ""}
                        onChange={(event) =>
                          setReplyDrafts((prev) => ({ ...prev, [i]: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
                        placeholder="Tulis balasan untuk pelanggan..."
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleReplySubmit(i)}
                          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white transition-all hover:bg-blue-700"
                        >
                          <HiCheck size={14} /> Simpan Balasan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyDrafts((prev) => ({ ...prev, [i]: "" }));
                          }}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-600 transition-all hover:bg-slate-50"
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

        {/* PAGINATION BUTTON */}
        <div className="pt-4 flex justify-center relative z-10">
          <button className="inline-flex items-center justify-center bg-white border border-slate-100 text-slate-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 text-xs font-bold px-6 py-3 rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm">
            Muat Ulasan Terdahulu
          </button>
        </div>

      </div>
    </div>
  );
}