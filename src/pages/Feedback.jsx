import { HiChatAlt, HiStar, HiThumbUp, HiThumbDown, HiOutlineBadgeCheck } from "react-icons/hi";
import { MdOutlineRateReview } from "react-icons/md";

export default function Feedback() {
  const reviews = [
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
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-900 antialiased">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header & Stats Summary Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
              <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-sm">
                <HiChatAlt size={20} />
              </div>
              Feedback & Review Pelanggan
            </h1>
            <p className="text-xs text-slate-500 mt-1">Pantau dan kelola seluruh ulasan masuk dari pengguna layanan Netto Laundry.</p>
          </div>
          
          {/* Consolidated Rating Card */}
          <div className="bg-white px-4 py-3 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-4 shrink-0">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating Rata-rata</p>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                4.8 <span className="text-xs font-normal text-slate-400">/ 5.0</span>
              </h2>
            </div>
            <div className="flex text-amber-400 gap-0.5">
              <HiStar size={16} /> 
              <HiStar size={16} /> 
              <HiStar size={16} /> 
              <HiStar size={16} /> 
              <HiStar size={16} className="text-slate-200" />
            </div>
          </div>
        </div>

        {/* Feedback List Container */}
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <div key={i} className="group bg-white p-5 md:p-6 rounded-xl border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all">
              <div className="flex items-start gap-4">
                
                {/* Modern Fixed Avatar */}
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 border border-slate-200/40">
                  {r.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Top Metadata Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold text-slate-900 text-sm leading-none">{r.user}</h4>
                        <HiOutlineBadgeCheck className="text-emerald-600" size={16} title="Verified Customer" />
                      </div>
                      
                      {/* Dynamic Star Generator */}
                      <div className="flex text-amber-400 mt-1.5 gap-0.5">
                        {[...Array(5)].map((_, idx) => (
                          <HiStar key={idx} size={14} className={idx < r.rate ? "text-amber-400" : "text-slate-200"} />
                        ))}
                      </div>
                    </div>

                    {/* Minimalist Status Badge */}
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                      r.tag === "Puas" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/40" 
                        : "bg-amber-50 text-amber-700 border-amber-200/40"
                    }`}>
                      {r.tag === "Puas" ? <HiThumbUp size={11} /> : <HiThumbDown size={11} />}
                      {r.tag}
                    </span>
                  </div>

                  {/* Clean Content Area */}
                  <div className="mt-3.5">
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {r.comment}
                    </p>
                  </div>

                  {/* Structured Action Footer */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-between items-center text-[11px] font-bold">
                    <span className="text-slate-400 flex items-center gap-1 font-medium">
                      <MdOutlineRateReview size={14} /> Dikirim {r.date}
                    </span>
                    <button className="text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-wide">
                      Balas Review
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Pagination Trigger Container */}
        <div className="pt-4 flex justify-center">
          <button className="inline-flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-semibold px-5 py-2 rounded-lg shadow-sm transition-colors active:scale-98">
            Muat Ulasan Terdahulu
          </button>
        </div>

      </div>
    </div>
  );
}