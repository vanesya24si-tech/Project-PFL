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
    <div className="p-6 bg-[#F8FAFB] min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header & Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-black text-[#1A2E35] flex items-center gap-3">
              <div className="p-2 bg-[#1ABC9C] rounded-xl text-white shadow-lg shadow-[#1ABC9C]/20">
                <HiChatAlt />
              </div>
              Feedback & Review
            </h1>
            <p className="text-[#7F9E97] mt-2 text-sm font-medium">Apa yang pelanggan katakan tentang Netto Laundry hari ini?</p>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#7F9E97] uppercase tracking-widest">Rating Rata-rata</p>
              <h2 className="text-3xl font-black text-[#1A2E35]">4.8 <span className="text-sm font-medium text-slate-400">/ 5</span></h2>
            </div>
            <div className="flex text-amber-400 text-xl">
              <HiStar /> <HiStar /> <HiStar /> <HiStar /> <HiStar className="opacity-30" />
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-6">
          {reviews.map((r, i) => (
            <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#1ABC9C]/5 transition-all relative">
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E8F8F5] to-[#A3DDD0] flex items-center justify-center text-[#1ABC9C] font-black text-lg shrink-0 border border-[#1ABC9C]/10">
                  {r.avatar}
                </div>

                <div className="flex-1">
                  {/* Top Row */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#1A2E35] text-lg">{r.user}</h4>
                        <HiOutlineBadgeCheck className="text-[#1ABC9C]" title="Verified Customer" />
                      </div>
                      <div className="flex text-amber-400 mt-1">
                        {[...Array(5)].map((_, idx) => (
                          <HiStar key={idx} className={idx < r.rate ? "opacity-100" : "opacity-20"} />
                        ))}
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      r.tag === "Puas" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {r.tag === "Puas" ? <HiThumbUp className="inline mr-1" /> : <HiThumbDown className="inline mr-1" />}
                      {r.tag}
                    </span>
                  </div>

                  {/* Comment */}
                  <div className="relative">
                    <span className="absolute -left-4 -top-2 text-4xl text-slate-100 font-serif leading-none">“</span>
                    <p className="text-[#5D7279] text-sm leading-relaxed font-medium">
                      {r.comment}
                    </p>
                    <span className="absolute -right-2 -bottom-2 text-4xl text-slate-100 font-serif leading-none">”</span>
                  </div>

                  {/* Footer Card */}
                  <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1 uppercase tracking-widest">
                      <MdOutlineRateReview /> Dikirim {r.date}
                    </span>
                    <button className="text-[10px] font-bold text-[#1ABC9C] hover:underline uppercase tracking-widest">
                      Balas Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <button className="bg-[#1A2E35] text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg hover:scale-105 transition-all">
            Load More Reviews
          </button>
        </div>
      </div>
    </div>
  );
}