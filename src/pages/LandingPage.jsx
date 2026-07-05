import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer
} from "recharts";
import {
  HiOutlineChevronDown,
  HiOutlineCheckCircle,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineVolumeUp,
  HiOutlineSparkles,
  HiOutlineTrendingUp,
  HiArrowRight,
  HiOutlineArrowNarrowRight,
  HiCheck,
  HiMenu,
  HiX,
  HiStar
} from "react-icons/hi";
import { useAuth } from "../utils/AuthContext";
import { getOrderById } from "../utils/ordersStorage";
import { toast } from "react-hot-toast";
import heroImg from "../assets/hero_image.jpg";

const activityData = [
  { name: "Sen", berat: 120, omzet: 1200000 },
  { name: "Sel", berat: 150, omzet: 1500000 },
  { name: "Rab", berat: 180, omzet: 1800000 },
  { name: "Kam", berat: 140, omzet: 1400000 },
  { name: "Jum", berat: 210, omzet: 2100000 },
  { name: "Sab", berat: 250, omzet: 2500000 },
  { name: "Min", berat: 280, omzet: 2800000 }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  // Preloader
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Fullscreen Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // FAQ
  const [activeFaq, setActiveFaq] = useState(null);

  // Poll
  const [selectedOption, setSelectedOption] = useState(null);
  const [pollVotes, setPollVotes] = useState({ 1: 52, 2: 38, 3: 20 });
  const [voted, setVoted] = useState(false);

  // Live Chat
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Halo! Selamat datang di Netto Laundry Help Center. Ada yang bisa kami bantu hari ini?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Tracking
  const [trackingInput, setTrackingInput] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  // Complaints
  const [complaints, setComplaints] = useState([
    { id: "KLM-001", title: "Baju Kaos Merah Tertukar", category: "Pakaian Hilang", status: "Selesai", date: "Hari ini" },
    { id: "KLM-002", title: "Keterlambatan Paket Express", category: "Durasi Layanan", status: "Diproses", date: "Kemarin" }
  ]);
  const [newComplaint, setNewComplaint] = useState({ title: "", category: "Pakaian Hilang" });
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  // Feedback
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, name: "Budi Santoso", role: "Pelanggan Reguler", comment: "Sangat suka dengan wangi parfum Sakura dan layanan setrikanya yang super rapi!", rating: 5 },
    { id: 2, name: "Siti Aminah", role: "Pelanggan Premium", comment: "Tracking WhatsApp cuciannya sangat membantu, saya tahu persis kapan cucian siap diambil.", rating: 5 }
  ]);
  const [userFeedback, setUserFeedback] = useState({ name: "", comment: "", rating: 5 });
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Preloader auto-complete
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 8;
      if (progress >= 100) {
        progress = 100;
        setLoadingProgress(100);
        clearInterval(interval);
        setTimeout(() => setLoadingComplete(true), 400);
      } else {
        setLoadingProgress(Math.floor(progress));
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleLiveTrack = async (e) => {
    e.preventDefault();
    if (!trackingInput.trim()) {
      toast.error("Silakan masukkan nomor invoice / nota!");
      return;
    }
    setTrackingLoading(true);
    setTrackingError("");
    setTrackingResult(null);
    try {
      const { data, error } = await getOrderById(trackingInput.trim().toUpperCase());
      if (error || !data) {
        setTrackingError("Nomor order / nota tidak ditemukan. Coba pakai format seperti ORD-XXXX.");
        toast.error("Nomor order tidak ditemukan.");
      } else {
        setTrackingResult(data);
        toast.success("Order berhasil ditemukan!");
      }
    } catch (err) {
      setTrackingError("Terjadi kesalahan koneksi database.");
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const userMsg = { sender: "user", text: inputMessage };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setTimeout(() => {
      let replyText = "Terima kasih atas pesan Anda. Untuk pengaduan cucian atau komplain resmi, silakan gunakan formulir Klaim Cucian di bawah agar langsung masuk ke antrean admin.";
      if (inputMessage.toLowerCase().includes("harga") || inputMessage.toLowerCase().includes("tarif")) {
        replyText = "Tarif Netto Laundry: Cuci Kiloan Rp 7.000/Kg (Reguler 2 hari), Express Rp 12.000/Kg (1 hari), Super Express Rp 20.000/Kg (6 jam).";
      } else if (inputMessage.toLowerCase().includes("status") || inputMessage.toLowerCase().includes("laundry")) {
        replyText = "Anda dapat melacak status pakaian Anda menggunakan nomor invoice melalui WhatsApp Gateway kami atau menu Tracking Laundry.";
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: replyText }]);
    }, 1000);
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    if (!newComplaint.title.trim()) return;
    const code = `KLM-00${complaints.length + 1}`;
    setComplaints((prev) => [{ id: code, title: newComplaint.title, category: newComplaint.category, status: "Diterima", date: "Baru saja" }, ...prev]);
    setNewComplaint({ title: "", category: "Pakaian Hilang" });
    setComplaintSuccess(true);
    toast.success("Pengaduan berhasil didaftarkan!");
    setTimeout(() => setComplaintSuccess(false), 3000);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!userFeedback.name.trim() || !userFeedback.comment.trim()) return;
    setFeedbacks((prev) => [{ id: prev.length + 1, name: userFeedback.name, role: "Pelanggan", comment: userFeedback.comment, rating: userFeedback.rating }, ...prev]);
    setUserFeedback({ name: "", comment: "", rating: 5 });
    setFeedbackSuccess(true);
    toast.success("Terima kasih atas ulasan Anda!");
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  const handleVoteSubmit = (e) => {
    e.preventDefault();
    if (selectedOption) {
      setPollVotes((prev) => ({ ...prev, [selectedOption]: prev[selectedOption] + 1 }));
      setVoted(true);
      toast.success("Pilihan aroma terekam!");
    }
  };

  const faqs = [
    { q: "Berapa lama estimasi waktu pengerjaan laundry kiloan?", a: "Layanan reguler membutuhkan waktu 48 jam. Kami juga menyediakan paket Express (24 jam) dan Super Express (6 jam) untuk kebutuhan mendesak." },
    { q: "Apakah cucian saya dicampur dengan pakaian pelanggan lain?", a: "Tidak. Kebijakan higienitas Netto Laundry mewajibkan 1 mesin cuci hanya digunakan untuk 1 nota pelanggan guna mencegah kontaminasi dan cucian tertukar." },
    { q: "Bagaimana sistem tracking WhatsApp bekerja?", a: "Setelah cucian Anda masuk ke kasir dan ditimbang, Anda akan menerima pesan WhatsApp otomatis berisi detail nota. Anda juga akan menerima pesan otomatis ketika cucian telah selesai disetrika dan siap diambil." },
    { q: "Bagaimana cara mendapatkan poin loyalitas?", a: "Setiap transaksi senilai Rp 10.000 akan mendapatkan 1 Poin Loyalitas. Poin ini dapat ditukarkan dengan potongan harga atau paket cuci gratis di kemudian hari." },
    { q: "Apakah ada garansi jika pakaian saya hilang atau rusak?", a: "Ya. Kami memberikan garansi klaim ganti rugi maksimal hingga 5 kali dari tarif nota jika terbukti terjadi kelalaian atau kehilangan pakaian oleh staf kami." },
    { q: "Jenis pewangi apa saja yang bisa dipilih?", a: "Kami menyediakan pilihan parfum premium gratis seperti Sakura, Lavender, Ocean Fresh, dan Baby Cuddle." },
    { q: "Apakah menerima layanan cuci satuan seperti bedcover atau jas?", a: "Ya. Kami menerima cuci satuan (Dry Cleaning / Wet Cleaning) untuk bedcover, selimut, jas formal, gaun, sepatu, hingga helm." },
    { q: "Apakah ada layanan antar-jemput?", a: "Ya, kami menyediakan layanan antar-jemput gratis untuk radius 2 KM dari outlet Netto Laundry terdekat dengan minimum berat transaksi tertentu." },
    { q: "Bagaimana cara melakukan pembayaran?", a: "Kami menerima pembayaran tunai, transfer bank, maupun scan QRIS (GoPay, OVO, Dana, LinkAja, ShopeePay)." },
    { q: "Apakah bisa mengajukan komplain jika pakaian kurang bersih?", a: "Tentu. Warga dapat mengajukan komplain cuci ulang gratis maksimal dalam 24 jam setelah cucian diambil dengan membawa nota fisik asli." }
  ];

  const outlets = [
    { name: "Netto Laundry Pusat", address: "Jl. Soekarno-Hatta No. 456, Pasteur, Bandung", hours: "07:00 – 21:00", phone: "+62 812-9988-7766", maps: "https://maps.google.com/?q=Pasteur+Bandung" },
    { name: "Netto Express Dago", address: "Jl. Ir. H. Juanda No. 12, Dago, Bandung", hours: "08:00 – 20:00", phone: "+62 812-9988-7767", maps: "https://maps.google.com/?q=Dago+Bandung" },
    { name: "Netto Laundry Setiabudhi", address: "Jl. Setiabudhi No. 88, Bandung Utara", hours: "07:30 – 21:00", phone: "+62 812-9988-7768", maps: "https://maps.google.com/?q=Setiabudhi+Bandung" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F7FF] via-[#F8FAFC] to-[#E0F2FE] text-slate-800 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden antialiased">

      {/* ─── KEYFRAMES ─── */}
      <style>{`
        @keyframes marquee-run {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .do-marquee { animation: marquee-run 18s linear infinite; display: flex; width: max-content; }
        @keyframes float-slow { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-14px); } }
        .float-slow { animation: float-slow 5s ease-in-out infinite; }
        @keyframes float-med { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-9px); } }
        .float-med { animation: float-med 3.5s ease-in-out infinite; }
      `}</style>

      {/* ─── PRELOADER ─── */}
      <AnimatePresence>
        {!loadingComplete && (
          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
            className="fixed inset-0 z-[999] bg-[#090d16] flex flex-col justify-between p-8 md:p-16 select-none"
          >
            <div className="flex justify-between items-center">
              <span className="font-sans font-black text-xs uppercase tracking-[0.3em] text-blue-500">NETTO LAUNDRY</span>
              <span className="font-sans font-medium text-slate-500 text-[10px] uppercase tracking-widest">Premium Laundry CRM & POS</span>
            </div>
            <div className="my-auto space-y-6">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="font-black text-7xl md:text-9xl tracking-tighter text-white"
              >
                {loadingProgress}%
              </motion.h1>
              <div className="h-[2px] bg-slate-800 w-full overflow-hidden rounded-full">
                <motion.div className="h-full bg-blue-500 rounded-full" style={{ width: `${loadingProgress}%`, transition: "width 0.1s linear" }} />
              </div>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Memuat platform manajemen laundry...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/25">N</div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-800 italic uppercase">
                Netto<span className="text-blue-600 font-black not-italic">Laundry</span>
              </span>
              <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-bold leading-none">Smart Laundry CRM & POS</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[["#hero","Home"],["#features","Fitur"],["#workflow","Alur Kerja"],["#loyalty","Loyalty"],["#engagement","Interaksi"],["#lokasi","Lokasi"],["#faq","FAQ"]].map(([href, label]) => (
              <a key={href} href={href} className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors">{label}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link to={role === "admin" ? "/dashboard" : "/user"} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-[0.98]">
                Ke Dasbor <HiArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link to="/cek-order" className="hidden md:inline-flex items-center gap-2 rounded-2xl border border-blue-600 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-wider text-blue-600 hover:bg-blue-50 transition-all active:scale-[0.98]">
                  🔍 Cek Order
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-800 transition-all active:scale-[0.98]">
                  Login Admin
                </Link>
              </>
            )}
            <button onClick={() => setIsMenuOpen(true)} className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors md:hidden">
              <HiMenu size={18} className="text-slate-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── FULLSCREEN MENU (Mobile) ─── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col p-8 pt-6">
            <div className="flex justify-between items-center mb-10">
              <span className="font-black text-slate-800 uppercase italic text-lg">Netto<span className="text-blue-600 not-italic">Laundry</span></span>
              <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center">
                <HiX size={20} className="text-slate-700" />
              </button>
            </div>
            <div className="space-y-2 flex-1">
              {[["#hero","Home"],["#features","Fitur Sistem"],["#workflow","Alur Kerja"],["#loyalty","Program Loyalty"],["#engagement","Interaksi & Poll"],["#lokasi","Lokasi Outlet"],["#faq","FAQ"]].map(([href, label], i) => (
                <motion.a key={href} href={href} onClick={() => setIsMenuOpen(false)}
                  initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="block py-4 border-b border-slate-100 text-xl font-black text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-tight">
                  {label}
                </motion.a>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hotline CS</p>
              <p className="font-bold text-slate-700 text-sm">+62 812-9988-7766</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════
          1. HERO PREMIUM
      ═══════════════════════════════════════ */}
      <section id="hero" className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-20 px-6 overflow-hidden">
        {/* Dynamic Light Background */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none animate-pulse z-0" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 space-y-8 text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 shadow-sm">
              <HiOutlineSparkles className="animate-pulse" /> Era Baru Manajemen Laundry
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-800 leading-[1.1] uppercase italic">
              Level Up <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-blue-500 font-black not-italic drop-shadow-sm">
                Bisnis Laundry
              </span> <br />
              Mu Sekarang
            </h1>
            <p className="text-sm md:text-base font-medium text-slate-500 max-w-xl leading-relaxed">
              Tinggalkan cara lama. Beralih ke sistem CRM & POS berteknologi canggih dengan otomasi WhatsApp, pelacakan real-time, dan analitik cerdas.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#features" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-1 active:scale-[0.98]">
                Eksplorasi Fitur
              </a>
              <a href="#engagement" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm">
                Lihat Demo <HiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Premium Image Card with Glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 relative"
          >
            <div className="relative p-1 bg-gradient-to-br from-blue-100 via-transparent to-sky-100 rounded-[3rem] shadow-[0_32px_80px_-16px_rgba(14,165,233,0.15)]">
              <div className="bg-white/60 backdrop-blur-xl rounded-[2.9rem] border border-white p-2 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img 
                  src={heroImg} 
                  alt="Premium Laundry Management" 
                  className="w-full h-auto object-cover rounded-[2.5rem] shadow-lg scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out float-slow"
                />
                
                {/* Floating Glass Badges */}
                <div className="absolute -left-6 top-1/4 bg-white/90 backdrop-blur-md border border-slate-100 rounded-2xl p-4 shadow-xl float-med hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <HiOutlineCheckCircle className="text-emerald-500 text-xl" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Cuci</p>
                      <p className="text-xs font-black text-slate-700">Selesai 100%</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -right-6 bottom-1/4 bg-white/90 backdrop-blur-md border border-slate-100 rounded-2xl p-4 shadow-xl float-slow hidden md:block" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <HiOutlineVolumeUp className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Notifikasi WA</p>
                      <p className="text-xs font-black text-slate-700">Terkirim</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MARQUEE RIBBON (Pita)
      ═══════════════════════════════════════ */}
      <div style={{ background: "#2563eb", overflow: "hidden", padding: "12px 0", transform: "rotate(-1.5deg)", margin: "8px 0", boxShadow: "0 10px 40px rgba(37,99,235,0.3)", position: "relative", zIndex: 20 }}>
        <div className="do-marquee" style={{ gap: 0, alignItems: "center" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: "1.5rem", paddingRight: "1.5rem", whiteSpace: "nowrap" }}>
              <span style={{ color: "white", fontSize: "13px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }}>⭐ PREMIUM LAUNDRY</span>
              <span style={{ color: "#93c5fd", fontWeight: 900 }}>•</span>
              <span style={{ color: "white", fontSize: "13px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }}>100% GARANSI BERSIH</span>
              <span style={{ color: "#93c5fd", fontWeight: 900 }}>•</span>
              <span style={{ color: "white", fontSize: "13px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }}>WANGI MAKSIMAL</span>
              <span style={{ color: "#93c5fd", fontWeight: 900 }}>•</span>
              <span style={{ color: "white", fontSize: "13px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }}>FREE DELIVERY 2KM</span>
              <span style={{ color: "#93c5fd", fontWeight: 900 }}>•</span>
              <span style={{ color: "white", fontSize: "13px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }}>SMART TRACKING POS</span>
              <span style={{ color: "#93c5fd", fontWeight: 900, paddingRight: "1.5rem" }}>•</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          TRUSTED BY
      ═══════════════════════════════════════ */}
      <section className="py-12 bg-white/40 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">DIGUNAKAN OLEH JARINGAN OUTLET LAUNDRY MODERN & FRANCHISE</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-45 grayscale hover:grayscale-0 hover:opacity-80 transition-all">
            {["NETTO LAUNDRY PUSAT","NETTO EXPRESS DAGO","LAUNDRY PARTNER JAYA","ASSOCIATION OF LAUNDRY"].map((b,i) => (
              <span key={i} className="text-xs md:text-sm font-black tracking-widest text-slate-500">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATISTICS
      ═══════════════════════════════════════ */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">SKALA OPERASIONAL</span>
            <h2 className="text-3xl font-black text-slate-800 uppercase italic">Operasional Bisnis yang Terpercaya</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: "12+", label: "Mitra Outlet", desc: "Cabang aktif terhubung" },
              { val: "48+", label: "Mesin Cuci & Pengering", desc: "Kapasitas besar 24 jam" },
              { val: "48K+ Kg", label: "Cucian Diselesaikan", desc: "Nota pengerjaan sukses" },
              { val: "1.450+", label: "Pelanggan Loyal", desc: "Terhubung program poin" }
            ].map((stat, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white/80 backdrop-blur-lg border border-white/60 shadow-lg rounded-3xl p-6 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/20 hover:bg-white transition-colors group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-cyan-400/20 transition-all"></div>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-500 group-hover:from-blue-600 group-hover:to-cyan-500 transition-all tracking-tight mb-2 relative z-10">{stat.val}</p>
                <p className="text-xs font-black uppercase tracking-wider text-slate-700 relative z-10">{stat.label}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1 relative z-10">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PROBLEM
      ═══════════════════════════════════════ */}
      <section className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500">TANTANGAN OPERASIONAL LAUNDRY</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Kendala Klasik <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500 font-black not-italic">Pengelolaan Laundry Manual</span>
            </h2>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              Tanpa dukungan sistem digital terpadu, pemilik outlet dan kasir sering kewalahan mengelola riwayat nota, pengerjaan cucian yang bertumpuk, dan menjaga retensi pelanggan.
            </p>
          </div>
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { num: "01", t: "Pakaian Hilang atau Tertukar", d: "Kasir kesulitan mencocokkan nota manual sehingga pakaian pelanggan sering terselip." },
              { num: "02", t: "Antrean Kasir Menumpuk", d: "Timbangan manual memperlambat proses pendaftaran order di kasir." },
              { num: "03", t: "Status Cucian Tidak Jelas", d: "Pelanggan sering menelepon berulang kali untuk menanyakan status cucian." },
              { num: "04", t: "Poin Loyalitas Tidak Terdata", d: "Pencatatan poin di kertas struk fisik mudah hilang, merusak retensi pelanggan." }
            ].map((p, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ x: 10, scale: 1.02 }}
                className="bg-white/60 backdrop-blur-md border border-slate-200/40 rounded-3xl p-5 space-y-2 shadow-sm hover:shadow-xl hover:shadow-rose-500/10 hover:border-rose-300/50 transition-colors group cursor-pointer"
              >
                <span className="text-xs font-black text-rose-500 group-hover:text-rose-600 transition-colors">{p.num}</span>
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider group-hover:text-slate-900">{p.t}</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{p.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SOLUTION
      ═══════════════════════════════════════ */}
      <section className="py-20 bg-white/40 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">SOLUSI DIGITAL NETTO</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Satu Dasbor <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">Solusi Manajemen Mutakhir</span>
            </h2>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              Netto Laundry mengotomatisasi seluruh pendaftaran timbangan kasir, pencatatan status tim pengerjaan, dan pengiriman notifikasi instan kepada pelanggan dalam satu platform.
            </p>
          </div>
          <div className="lg:col-span-6 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { t: "Otomasi Status Nota", d: "Status pakaian terpantau dari tahap Antre, Lagi Dicuci, Tahap Setrika, hingga Siap Ambil." },
              { t: "Notifikasi WA Otomatis", d: "Sistem mengirimkan rincian invoice dan status pakaian langsung ke WA pelanggan secara instan." },
              { t: "Integrated Loyalty Program", d: "Poin belanja terakumulasi otomatis ke nomor HP member, siap ditukarkan dengan kupon diskon." },
              { t: "Log Feedback & Klaim", d: "Menerima ulasan kepuasan dan pencatatan komplain pakaian warga demi menjaga mutu pelayanan." }
            ].map((s, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ scale: 1.05 }}
                className="bg-white backdrop-blur-md border border-slate-200/50 shadow-sm rounded-3xl p-5 space-y-3 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-200/50 transition-colors"></div>
                <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all relative z-10">✓</span>
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider relative z-10">{s.t}</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed relative z-10">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WORKFLOW
      ═══════════════════════════════════════ */}
      <section id="workflow" className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">ALUR KERJA OPERASIONAL</span>
            <h2 className="text-3xl font-black text-slate-800 uppercase italic">Siklus Pengerjaan Pakaian</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", step: "Drop & Timbang", d: "Pelanggan membawa cucian, kasir mendaftarkan order dan menimbang pakaian di POS." },
              { num: "02", step: "Notifikasi Invoice", d: "WhatsApp Gateway mengirim invoice digital berisi rincian item, berat, dan harga nota." },
              { num: "03", step: "Proses Pencucian", d: "Pakaian dicuci terpisah menggunakan mesin khusus sesuai instruksi label kain." },
              { num: "04", step: "Selesai & Notifikasi", d: "Setelah disetrika rapi, sistem mengirim pesan instan bahwa cucian siap diambil." }
            ].map((wf, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -15, scale: 1.02 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/90 backdrop-blur-sm border border-slate-200/50 shadow-md rounded-3xl p-6 text-left space-y-4 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/20 transition-colors group cursor-pointer relative"
              >
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b-3xl"></div>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-black text-slate-200 group-hover:text-blue-500/20 transition-colors">{wf.num}</span>
                  {idx < 3 && <HiOutlineArrowNarrowRight className="text-slate-300 hidden lg:block text-2xl group-hover:translate-x-2 group-hover:text-blue-500 transition-all" />}
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">{wf.step}</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{wf.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CUSTOMER SERVICE
      ═══════════════════════════════════════ */}
      <section className="py-20 bg-white/40 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">PELAYANAN PELANGGAN</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Akselerasi Kepuasan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">Pelayanan Laundry Cepat</span>
            </h2>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">Membangun keterhubungan optimal dengan pelanggan. Status pengerjaan real-time dan notifikasi WhatsApp meminimalkan kekhawatiran pakaian tertukar.</p>
          </div>
          <div className="lg:col-span-6 space-y-4">
            {[
              { title: "Status Pengerjaan Terlacak", desc: "Lacak posisi cucian Anda mulai dari antrean pencucian, pengeringan, hingga proses setrika rapi." },
              { title: "Kirim Notifikasi Otomatis", desc: "Pesan instan otomatis meluncur ke nomor HP Anda begitu cucian selesai dikemas oleh petugas kami." },
              { title: "Layanan Antar-Jemput Praktis", desc: "Cukup konfirmasi alamat Anda, staf kami akan menjemput cucian kotor dan mengantarkannya kembali dalam kondisi wangi maksimal." }
            ].map((serv, idx) => (
              <div key={idx} className="bg-white border border-slate-200/40 shadow-sm rounded-3xl p-5 flex items-start gap-4 hover:border-blue-500/10 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <HiOutlineCheckCircle className="text-lg" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">{serv.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{serv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LOYALTY
      ═══════════════════════════════════════ */}
      <section id="loyalty" className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">PROGRAM LOYALITAS PENGGUNA</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Apresiasi Loyalitas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">Pelanggan Netto Laundry</span>
            </h2>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">Program keanggotaan member yang memberikan poin loyalitas dari setiap kilogram cucian Anda. Kumpulkan poin dan tukarkan dengan voucher cuci gratis.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><span className="w-2 h-2 rounded-full bg-blue-600" /> Diskon 15% khusus member Premium di hari ulang tahun.</div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><span className="w-2 h-2 rounded-full bg-blue-600" /> Layanan antar-jemput gratis tanpa batas minimum nota pengerjaan.</div>
            </div>
          </div>
          <div className="lg:col-span-6 lg:order-1 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">TIER MEMBERSHIP LAUNDRY</span>
            {[
              { badge: "Regular Member", desc: "Tier standar. Mendapatkan 1 poin setiap transaksi kelipatan Rp 10.000.", color: "from-blue-500/10 to-sky-500/10 border-blue-500/35 text-blue-600" },
              { badge: "Premium Member", desc: "Tarif cuci khusus, gratis pewangi eksklusif tambahan, dan prioritas antrean pengerjaan.", color: "from-sky-500/10 to-blue-600/10 border-sky-500/35 text-sky-600" },
              { badge: "Corporate Partner", desc: "Tier khusus hotel, salon, atau instansi. Tarif khusus grosir dengan penagihan bulanan.", color: "from-slate-700/10 to-slate-800/10 border-slate-600/35 text-slate-700" }
            ].map((ly, idx) => (
              <div key={idx} className={`bg-gradient-to-r ${ly.color} border rounded-3xl p-5 flex items-center justify-between gap-4`}>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider">{ly.badge}</h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed max-w-sm">{ly.desc}</p>
                </div>
                <span className="text-2xl">💎</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ENGAGEMENT / POLL (Interaktif)
      ═══════════════════════════════════════ */}
      <section id="engagement" className="py-20 bg-white/40 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">INTERAKSI PELANGGAN</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Tentukan Aroma <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">Parfum Favorit Anda</span>
            </h2>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">Kami peduli dengan preferensi Anda. Berikan masukan wewangian parfum apa saja yang ingin kami hadirkan sebagai parfum pilihan gratis di outlet Netto.</p>
          </div>
          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200/50 rounded-[2rem] p-6 shadow-sm space-y-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">POLLING PARFUM LAUNDRY BULAN INI</span>
              <p className="text-xs font-bold text-slate-800 leading-normal">Varian aroma parfum premium manakah yang paling Anda inginkan tersedia di outlet Netto Laundry berikutnya?</p>
              {!voted ? (
                <form onSubmit={handleVoteSubmit} className="space-y-3">
                  {[{ id: 1, label: "Sakura Blossom (Wangi Lembut & Floral)" },{ id: 2, label: "Ocean Fresh (Wangi Segar & Maskulin)" },{ id: 3, label: "Baby Cuddle (Wangi Bedak Bayi Lembut)" }].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${selectedOption === opt.id ? "bg-blue-500/5 border-blue-500 text-slate-800" : "bg-slate-50/60 border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                      <input type="radio" name="poll" value={opt.id} onChange={() => setSelectedOption(opt.id)} className="hidden" />
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedOption === opt.id ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}>
                        {selectedOption === opt.id && <HiCheck size={9} className="text-white" />}
                      </span>
                      <span className="text-xs font-bold">{opt.label}</span>
                    </label>
                  ))}
                  <button type="submit" disabled={!selectedOption} className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer">
                    Kirim Pilihan Saya
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs font-bold text-emerald-600 flex items-center gap-2">
                    <HiOutlineCheckCircle className="text-lg" /> Terima kasih! Pilihan aroma Anda telah terekam.
                  </div>
                  {[{ id:1, label:"Sakura Blossom" },{ id:2, label:"Ocean Fresh" },{ id:3, label:"Baby Cuddle" }].map((res) => {
                    const total = pollVotes[1] + pollVotes[2] + pollVotes[3];
                    const percent = ((pollVotes[res.id] / total) * 100).toFixed(1);
                    return (
                      <div key={res.id} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700"><span>{res.label}</span><span>{percent}%</span></div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  <button onClick={() => setVoted(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 cursor-pointer block text-center w-full">Ulangi Polling (Simulasi)</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          NEWS
      ═══════════════════════════════════════ */}
      <section className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">EDUKASI DAN KABAR</span>
              <h2 className="text-3xl font-black text-slate-800 uppercase italic">Kabar & Tips Perawatan Pakaian</h2>
            </div>
            <a href="#news" className="text-xs font-black uppercase text-blue-600 hover:text-blue-500 transition-colors flex items-center gap-1.5">Lihat Semua Artikel <HiOutlineArrowNarrowRight /></a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tag: "Perawatan Kain", date: "28 Juni 2026", title: "Cara Tepat Mencuci Pakaian Berbahan Sutra agar Serat Tidak Rusak", desc: "Bahan sutra membutuhkan penanganan khusus. Ketahui teknik memeras dan jenis sabun detergen pH netral yang wajib digunakan." },
              { tag: "Tips & Trik", date: "24 Juni 2026", title: "Mengapa Pakaian Putih Mudah Menguning? Ini Penyebab & Cara Mencegahnya", desc: "Hindari penggunaan pemutih klorin berlebih. Simak tips menjaga kecerahan baju putih menggunakan baking soda secara alami." },
              { tag: "Layanan Netto", date: "19 Juni 2026", title: "Netto Laundry Hadirkan Pewangi Khusus Anti Alergi untuk Pakaian Bayi", desc: "Parfum Baby Cuddle kini hadir dengan formulasi hipoalergenik yang aman untuk kulit sensitif bayi baru lahir." }
            ].map((n, idx) => (
              <div key={idx} className="bg-white border border-slate-200/40 shadow-sm rounded-3xl p-6 space-y-4 hover:border-blue-500/20 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <span className="text-blue-600">{n.tag}</span><span>{n.date}</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-800 leading-snug tracking-tight">{n.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{n.desc}</p>
                </div>
                <a href="#news-detail" className="text-[10px] font-black uppercase text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 pt-4">Baca Selengkapnya <HiArrowRight size={12} /></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PROMO
      ═══════════════════════════════════════ */}
      <section className="py-20 bg-white/40 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">PROMO AKTIF OUTLET</span>
              <h2 className="text-3xl font-black text-slate-800 uppercase italic">Promo & Paket Diskon Spesial</h2>
            </div>
            <a href="#promos" className="text-xs font-black uppercase text-blue-600 hover:text-blue-500 transition-colors flex items-center gap-1.5">Lihat Kalender Promo <HiOutlineArrowNarrowRight /></a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { date: "04 Jul 2026", time: "Khusus Sabtu - Minggu", loc: "Berlaku Semua Outlet", title: "Weekend Discount 15% Minimal Cuci 6Kg Kiloan Reguler" },
              { date: "09 Jul 2026", time: "Pukul 09:00 - 14:00", loc: "Outlet Dago & Pasteur", title: "Promo Happy Hour: Cuci Satuan Jas Gratis Setrika Kemeja" },
              { date: "15 Jul 2026", time: "Sepanjang Bulan Juli", loc: "Khusus Member Premium", title: "Free Upgrade Parfum Eksklusif Setiap Cuci Sprei/Bedcover" }
            ].map((a, idx) => (
              <div key={idx} className="bg-white border border-slate-200/40 shadow-sm rounded-3xl p-6 hover:border-blue-500/20 transition-all flex gap-4">
                <div className="bg-slate-900 rounded-2xl p-3 flex flex-col justify-center items-center text-center shrink-0 w-16 h-20 text-white">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Juli</span>
                  <span className="text-lg font-black leading-none">{a.date.split(" ")[0]}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-slate-800 leading-snug tracking-tight">{a.title}</h3>
                  <div className="space-y-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <p>🕒 {a.time}</p>
                    <p>📍 {a.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          NOTIFICATION CENTER
      ═══════════════════════════════════════ */}
      <section className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">NOTIFIKASI PENGINGAT</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              WhatsApp Gateway <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">Notifikasi Instan Nota & Poin</span>
            </h2>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">Anda tidak perlu lagi menyimpan struk kertas. Sistem kami secara otomatis mengirimkan pemberitahuan status cucian dan info poin masuk langsung ke WhatsApp Anda.</p>
          </div>
          <div className="lg:col-span-6 space-y-4">
            {[
              { type: "Reminder Cucian Selesai", msg: "Notifikasi otomatis dikirimkan begitu pakaian Anda telah disetrika, dipacking rapi, dan siap diambil." },
              { type: "Reminder Pengambilan", msg: "Pemberitahuan ramah pengingat pengambilan jika cucian sudah siap lebih dari 3 hari di loker kami." },
              { type: "Pemberitahuan Poin Loyalitas", msg: "Update saldo poin instan setiap selesai melakukan transaksi pembayaran di kasir." }
            ].map((n, idx) => (
              <div key={idx} className="bg-white border border-slate-200/40 shadow-sm rounded-3xl p-5 flex items-start gap-4 hover:border-blue-500/10 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <HiOutlineVolumeUp className="text-lg" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">{n.type}</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{n.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LIVE CHAT (Interaktif)
      ═══════════════════════════════════════ */}
      <section className="py-20 bg-white/40 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">KONTAK DUKUNGAN CS</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Customer Service <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">24/7 Staf Admin Kasir</span>
            </h2>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">Hubungi layanan admin pelanggan kami secara langsung. Dapatkan bantuan mengenai salah antar, paket hilang, klaim ganti rugi, atau pertanyaan umum.</p>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700"><HiOutlinePhone className="text-blue-600 text-lg shrink-0" /><span>WhatsApp Hotline: +62 812-9988-7766</span></div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700"><HiOutlineMail className="text-blue-600 text-lg shrink-0" /><span>Email Dukungan: cs.nettolaundry@gmail.com</span></div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col h-96 shadow-md">
              <div className="bg-slate-900 px-6 py-4 flex items-center gap-3 text-white">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-black text-xs">NL</div>
                <div>
                  <h4 className="text-xs font-black">ASISTEN CHAT NETTO</h4>
                  <span className="block text-[8px] text-blue-400 font-bold uppercase tracking-wider">Online Sekarang</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-white text-slate-800 border border-slate-200"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
                <input type="text" required value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Ketik pesan di sini (contoh: harga cuci)..." className="flex-1 bg-slate-50/60 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all placeholder:text-slate-400" />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer">Kirim</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          COMPLAINTS (Interaktif)
      ═══════════════════════════════════════ */}
      <section className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500">MANAJEMEN KLAIM PENGADUAN</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Layanan Pengaduan & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500 font-black not-italic">Penyelesaian Masalah Warga</span>
            </h2>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">Kami berkomitmen menjaga kualitas pencucian. Ajukan klaim jika ada pakaian hilang, tertukar, rusak, atau keterlambatan penyelesaian nota cuci.</p>
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">STATUS KLAIM TERDAFTAR</span>
              <div className="space-y-2">
                {complaints.map((c) => (
                  <div key={c.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between text-xs shadow-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-700">{c.id}</span>
                        <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full ${c.status === "Selesai" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{c.status}</span>
                      </div>
                      <p className="font-bold text-slate-800 mt-1">{c.title}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{c.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">AJUKAN KLAIM BARU</span>
              {complaintSuccess ? (
                <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2">
                  <span className="text-3xl">🎉</span>
                  <h4 className="text-xs font-black uppercase text-emerald-700">Klaim Berhasil Dikirim</h4>
                  <p className="text-[10.5px] text-emerald-600 font-medium leading-relaxed">Laporan Anda telah terdaftar dan akan segera ditinjau dalam waktu maksimal 24 jam.</p>
                </div>
              ) : (
                <form onSubmit={handleComplaintSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Rincian Komplain Pakaian</label>
                    <input type="text" required value={newComplaint.title} onChange={(e) => setNewComplaint((p) => ({ ...p, title: e.target.value }))} placeholder="Contoh: Kaos polo biru kurang bersih / luntur..." className="w-full bg-slate-50/60 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Kategori Masalah</label>
                    <select value={newComplaint.category} onChange={(e) => setNewComplaint((p) => ({ ...p, category: e.target.value }))} className="w-full bg-slate-50/60 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all">
                      <option>Pakaian Hilang</option>
                      <option>Pakaian Rusak/Sobek</option>
                      <option>Hasil Setrika Kurang Rapi</option>
                      <option>Hasil Cuci Kurang Bersih</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer">Ajukan Pengaduan Resmi</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEEDBACK (Interaktif)
      ═══════════════════════════════════════ */}
      <section className="py-20 bg-white/40 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">ULASAN KEPUASAN</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Kirimkan Ulasan & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">Beri Masukan Pelayanan</span>
            </h2>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">Kami sangat menghargai setiap masukan Anda. Berikan penilaian terhadap kualitas cuci, setrika, ketepatan waktu, dan keramahan staf kasir.</p>
            <div className="space-y-2">
              {feedbacks.map((f) => (
                <div key={f.id} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-1 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-700">{f.name}</span>
                    <div className="flex gap-0.5 text-amber-400 text-xs">{[...Array(f.rating)].map((_,i) => <HiStar key={i} />)}</div>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-medium italic">"{f.comment}"</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">KIRIMKAN RATING PELAYANAN</span>
              {feedbackSuccess ? (
                <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2">
                  <span className="text-3xl">🎉</span>
                  <h4 className="text-xs font-black uppercase text-emerald-700">Ulasan Berhasil Dikirim</h4>
                  <p className="text-[10.5px] text-emerald-600 font-medium leading-relaxed">Terima kasih! Penilaian Anda membantu kami meningkatkan mutu pengerjaan laundry.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Nama Lengkap</label>
                    <input type="text" required value={userFeedback.name} onChange={(e) => setUserFeedback((p) => ({ ...p, name: e.target.value }))} placeholder="Contoh: Budi Santoso..." className="w-full bg-slate-50/60 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Penilaian (Rating)</label>
                    <select value={userFeedback.rating} onChange={(e) => setUserFeedback((p) => ({ ...p, rating: parseInt(e.target.value) }))} className="w-full bg-slate-50/60 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all">
                      <option value="5">⭐⭐⭐⭐⭐ (Sangat Bagus)</option>
                      <option value="4">⭐⭐⭐⭐ (Bagus)</option>
                      <option value="3">⭐⭐⭐ (Cukup)</option>
                      <option value="2">⭐⭐ (Kurang Baik)</option>
                      <option value="1">⭐ (Buruk)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Ulasan Kritik & Saran</label>
                    <textarea required rows={3} value={userFeedback.comment} onChange={(e) => setUserFeedback((p) => ({ ...p, comment: e.target.value }))} placeholder="Masukkan kritik atau saran membangun Anda untuk kami..." className="w-full bg-slate-50/60 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all resize-none" />
                  </div>
                  <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer">Kirim Feedback Mutu Layanan</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════ */}
      <section className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">TESTIMONIAL</span>
            <h2 className="text-3xl font-black text-slate-800 uppercase italic">Ulasan Pemilik & Pelanggan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: "Budi Santoso", r: "Pelanggan Kiloan", t: "Sangat dimudahkan dengan adanya info status cuci lewat WhatsApp. Saya tidak perlu bolak-balik ke outlet lagi untuk mengecek." },
              { n: "Hendra Wijaya", r: "Pemilik Outlet Franchise", t: "Platform CRM & POS Netto membantu saya melacak omzet bulanan, beban timbangan pakaian, dan retensi kepuasan pelanggan secara otomatis." },
              { n: "Siti Aminah", r: "Pelanggan Jas Satuan", t: "Layanan cuci dry cleaning jas formalnya luar biasa wangi dan bersih. Pengemasan dengan gantungan baju sangat premium!" }
            ].map((t, idx) => (
              <div key={idx} className="bg-white border border-slate-200/40 shadow-sm rounded-3xl p-6 text-left space-y-4 hover:border-blue-500/20 transition-all">
                <p className="text-[11.5px] text-slate-500 leading-relaxed font-medium italic">"{t.t}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-sky-600 flex items-center justify-center text-white font-black text-xs">{t.n[0]}</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">{t.n}</h4>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t.r}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LOKASI OUTLET
      ═══════════════════════════════════════ */}
      <section id="lokasi" className="py-24 relative overflow-hidden bg-white/40 border-t border-slate-200/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10">
          <div className="text-center space-y-4">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 border border-blue-200 rounded-full px-4 py-1.5 bg-blue-50">Jaringan Outlet</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 uppercase italic">
              Temukan Outlet <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Terdekat</span>
            </h2>
            <p className="text-sm text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">Kunjungi outlet kami yang tersebar di lokasi strategis, atau nikmati layanan antar-jemput gratis untuk radius 2 KM.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Cards Column */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {outlets.map((o, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-sm rounded-3xl p-5 hover:border-blue-400/50 hover:bg-white hover:shadow-md transition-colors group cursor-pointer flex gap-4 items-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-sky-500/10 text-blue-600 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all border border-blue-100">
                    <HiOutlineLocationMarker className="text-2xl" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 group-hover:text-blue-600 transition-colors">{o.name}</h3>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{o.address}</p>
                    <div className="flex gap-4 pt-1">
                      <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {o.hours}
                      </span>
                      <a href={o.maps} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-500 transition-colors ml-auto">
                        Arahkan <HiArrowRight size={10} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Map Column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-7 h-[400px] lg:h-auto rounded-[2rem] overflow-hidden border border-slate-200/50 shadow-sm relative group bg-white"
            >
              <div className="absolute inset-0 bg-blue-500/5 mix-blend-color pointer-events-none group-hover:opacity-0 transition-opacity duration-700 z-10" />
              <iframe
                title="Lokasi Netto Laundry"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.46282798566!2d107.5306113!3d-6.9174639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20Kota%20Bandung%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1688000000000!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="z-0 relative"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ
      ═══════════════════════════════════════ */}
      <section id="faq" className="py-20 border-t border-slate-200/50">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">PANDUAN INFORMASI</span>
            <h2 className="text-3xl font-black text-slate-800 uppercase italic">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-colors">
                  <button onClick={() => setActiveFaq(isOpen ? null : idx)} className="w-full px-6 py-4 flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer">
                    <span>{idx + 1}. {faq.q}</span>
                    <HiOutlineChevronDown className={`transform transition-transform shrink-0 ml-4 ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <p className="px-6 pb-4 pt-1 text-[11px] text-slate-500 font-medium leading-relaxed border-t border-slate-100">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════ */}
      <section className="py-24 border-t border-slate-200/50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800 uppercase italic leading-tight">
            Tingkatkan Bisnis Laundry Anda <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">Bersama Netto Laundry CRM & POS</span>
          </h2>
          <p className="text-sm font-medium text-slate-500 max-w-xl mx-auto leading-relaxed">Mulailah mengotomatisasi pencatatan nota kasir, penimbangan pakaian, dan sistem loyalty program pelanggan secara terpadu sekarang juga.</p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to={user ? (role === "admin" ? "/dashboard" : "/user") : "/login"} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:brightness-105 active:scale-[0.98]">
              {user ? "Ke Dasbor" : "Coba Sekarang"}
            </Link>
            <a href="#lokasi" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm">
              Temukan Outlet <HiOutlineLocationMarker size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">N</div>
              <span className="text-sm font-black tracking-tight text-white uppercase italic">Netto<span className="text-blue-500 not-italic">Laundry</span></span>
            </div>
            <p className="text-[11px] leading-relaxed">Platform Manajemen Hubungan Pelanggan & Point of Sale Laundry Modern demi mempercepat pengerjaan cucian higienis.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">Hubungi Kami</h4>
            <div className="space-y-2 text-[11px]">
              <p>📞 +62 812-9988-7766</p>
              <p>✉️ cs.nettolaundry@gmail.com</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">Alamat Kantor</h4>
            <p className="text-[11px] leading-relaxed">Jl. Soekarno-Hatta No. 456, Pasteur, Kec. Coblong, Kota Bandung, Jawa Barat.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">Sosial Media</h4>
            <div className="flex gap-4 text-[11px]">
              <a href="#instagram" className="hover:text-blue-500 transition-colors">Instagram</a>
              <a href="#facebook" className="hover:text-blue-500 transition-colors">Facebook</a>
              <a href="#youtube" className="hover:text-blue-500 transition-colors">YouTube</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-slate-800 text-center text-[10px] tracking-wide uppercase font-bold text-slate-600">
          © {new Date().getFullYear()} Netto Laundry. Hak Cipta Dilindungi Undang-Undang.
        </div>
      </footer>

    </div>
  );
}
