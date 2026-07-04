import React, { useState } from "react";
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
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineNewspaper,
  HiOutlineCalendar,
  HiOutlineChevronDown,
  HiOutlineCheckCircle,
  HiOutlineChatAlt,
  HiOutlineShieldCheck,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineVolumeUp,
  HiOutlineSparkles,
  HiOutlineTrendingUp,
  HiArrowRight,
  HiOutlineArrowNarrowRight,
  HiCheck,
  HiOutlineAnnotation
} from "react-icons/hi";
import { useAuth } from "../utils/AuthContext";

// Fake data for charts in Dashboard Preview (Laundry weight and revenue)
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
  const { user } = useAuth();

  // FAQ Active State
  const [activeFaq, setActiveFaq] = useState(null);

  // Poll Voter State (Preferred Laundry Fragrance)
  const [selectedOption, setSelectedOption] = useState(null);
  const [pollVotes, setPollVotes] = useState({ 1: 52, 2: 38, 3: 20 });
  const [voted, setVoted] = useState(false);

  // Live Chat Simulator State
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Halo! Selamat datang di Netto Laundry Help Center. Ada yang bisa kami bantu hari ini?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Complaint Management State (Klaim Cucian)
  const [complaints, setComplaints] = useState([
    { id: "KLM-001", title: "Baju Kaos Merah Tertukar", category: "Pakaian Hilang", status: "Selesai", date: "Hari ini" },
    { id: "KLM-002", title: "Keterlambatan Paket Express", category: "Durasi Layanan", status: "Diproses", date: "Kemarin" }
  ]);
  const [newComplaint, setNewComplaint] = useState({ title: "", category: "Pakaian Hilang" });
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  // Feedback Management State
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, name: "Budi Santoso", role: "Pelanggan Reguler", comment: "Sangat suka dengan wangi parfum Sakura dan layanan setrikanya yang super rapi!", rating: 5 },
    { id: 2, name: "Siti Aminah", role: "Pelanggan Premium", comment: "Tracking WhatsApp cuciannya sangat membantu, saya tahu persis kapan cucian siap diambil.", rating: 5 }
  ]);
  const [userFeedback, setUserFeedback] = useState({ name: "", comment: "", rating: 5 });
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // handle submit poll
  const handleVoteSubmit = (e) => {
    e.preventDefault();
    if (selectedOption) {
      setPollVotes((prev) => ({
        ...prev,
        [selectedOption]: prev[selectedOption] + 1
      }));
      setVoted(true);
    }
  };

  // handle chat send
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

  // handle submit complaint
  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    if (!newComplaint.title.trim()) return;

    const code = `KLM-00${complaints.length + 1}`;
    const item = {
      id: code,
      title: newComplaint.title,
      category: newComplaint.category,
      status: "Diterima",
      date: "Baru saja"
    };

    setComplaints((prev) => [item, ...prev]);
    setNewComplaint({ title: "", category: "Pakaian Hilang" });
    setComplaintSuccess(true);
    setTimeout(() => setComplaintSuccess(false), 3000);
  };

  // handle submit feedback
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!userFeedback.name.trim() || !userFeedback.comment.trim()) return;

    const item = {
      id: feedbacks.length + 1,
      name: userFeedback.name,
      role: "Pelanggan",
      comment: userFeedback.comment,
      rating: userFeedback.rating
    };

    setFeedbacks((prev) => [item, ...prev]);
    setUserFeedback({ name: "", comment: "", rating: 5 });
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  // FAQ Array (Laundry-specific)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F7FF] via-[#F8FAFC] to-[#E0F2FE] text-slate-800 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden antialiased">
      
      {/* 1. NAVBAR (Sticky & Glassmorphism Light) */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/25">
              N
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-800 italic uppercase">
                Netto<span className="text-blue-600 font-black not-italic">Laundry</span>
              </span>
              <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-bold leading-none">
                Smart Laundry CRM & POS
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#hero" className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors">Home</a>
            <a href="#features" className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors">Fitur</a>
            <a href="#workflow" className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors">Alur Kerja</a>
            <a href="#loyalty" className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors">Loyalty</a>
            <a href="#engagement" className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors">Interaksi</a>
            <a href="#faq" className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors">FAQ</a>
          </div>

          {/* Action Button */}
          <div>
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-[0.98]"
              >
                Ke Dashboard <HiArrowRight size={14} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                Login Admin
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO PREMIUM (Glassmorphism & animations Light Mode) */}
      <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-16 pb-20 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">
              <HiOutlineSparkles className="animate-pulse" /> Solusi Manajemen Laundry Premium
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-800 leading-tight uppercase italic">
              Digitalisasi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-blue-500 font-black not-italic">
                Bisnis Laundry
              </span> <br />
              Dalam Satu Dasbor Terpusat
            </h1>
            <p className="text-sm md:text-base font-medium text-slate-500 max-w-xl leading-relaxed">
              Platform CRM & POS (Point of Sale) Laundry modern yang mempermudah pelacakan timbangan cucian kasir, status pengerjaan pakaian real-time, manajemen feedback pelanggan, hingga program loyalitas poin otomatis.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#download"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:brightness-105 active:scale-[0.98]"
              >
                Coba Demo Aplikasi
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-650 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-2xs"
              >
                Pelajari Fitur <HiArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* 3. DASHBOARD PREVIEW (Smart Laundry CRM Demo) */}
          <div className="lg:col-span-6">
            <div className="relative p-1 bg-gradient-to-br from-blue-500/30 via-sky-500/10 to-blue-600/30 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(2,132,199,0.15)]">
              <div className="bg-white rounded-[2.4rem] p-6 border border-white/60 space-y-6">
                {/* Mockup Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-500"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] text-slate-400 font-bold ml-2">DASBOR KASIR REAL-TIME</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md border border-blue-200">
                    Live Demo
                  </span>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100 shadow-inner">
                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Total Pelanggan</span>
                    <span className="text-lg font-black text-slate-800">1,450+</span>
                  </div>
                  <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100 shadow-inner">
                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Antrean Aktif</span>
                    <span className="text-lg font-black text-blue-600">12 Nota</span>
                  </div>
                  <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100 shadow-inner">
                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Selesai Tepat Waktu</span>
                    <span className="text-lg font-black text-sky-500">98.4%</span>
                  </div>
                </div>

                {/* Dashboard Chart */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Grafik Omzet & Berat Laundry (Mingguan)</span>
                    <span className="text-[9px] text-blue-600 font-bold flex items-center gap-1"><HiOutlineTrendingUp /> +14.2%</span>
                  </div>
                  <div className="h-32 w-full bg-slate-50/40 rounded-2xl border border-slate-100 p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={8} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={8} tickLine={false} />
                        <ChartTooltip />
                        <Area type="monotone" dataKey="berat" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorOmzet)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Dashboard Notification & Alerts */}
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-blue-600">
                    <HiOutlineVolumeUp className="text-sm animate-bounce" /> Status Cucian Terakhir:
                  </div>
                  <p className="text-[11px] font-medium text-slate-650 leading-normal">
                    Nota #TRX-1025 milik Rian Hidayat (Cuci Kering) telah selesai memasuki tahap Setrika dan siap dipacking. SMS notifikasi siap dikirim.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUSTED BY (Laundry Outlets Partnerships) */}
      <section className="py-12 bg-white/40 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            DIGUNAKAN OLEH JARINGAN OUTLET LAUNDRY MODERN & FRANCHISE
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-45 grayscale hover:grayscale-0 hover:opacity-80 transition-all font-sans">
            <span className="text-xs md:text-sm font-black tracking-widest text-slate-500">NETTO LAUNDRY PUSAT</span>
            <span className="text-xs md:text-sm font-black tracking-widest text-slate-500">NETTO EXPRESS DAGO</span>
            <span className="text-xs md:text-sm font-black tracking-widest text-slate-500">LAUNDRY PARTNER JAYA</span>
            <span className="text-xs md:text-sm font-black tracking-widest text-slate-500">ASSOCIATION OF LAUNDRY</span>
          </div>
        </div>
      </section>

      {/* 5. STATISTICS */}
      <section className="py-20 relative">
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
              <div key={idx} className="bg-white/80 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-3xl p-6 hover:border-blue-500/20 hover:bg-white transition-all group">
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-850 to-slate-500 group-hover:from-blue-600 group-hover:to-sky-500 transition-all tracking-tight mb-2">
                  {stat.val}
                </p>
                <p className="text-xs font-black uppercase tracking-wider text-slate-700">{stat.label}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROBLEM SECTION */}
      <section className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500">TANTANGAN OPERASIONAL LAUNDRY</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Kendala Klasik <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500 font-black not-italic">
                Pengelolaan Laundry Manual
              </span>
            </h2>
            <p className="text-sm font-medium text-slate-550 leading-relaxed">
              Tanpa dukungan sistem digital terpadu, pemilik outlet dan kasir sering kewalahan mengelola riwayat nota, pengerjaan cucian yang bertumpuk, dan menjaga retensi pelanggan.
            </p>
          </div>
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { num: "01", t: "Pakaian Hilang atau Tertukar", d: "Kasir kesulitan mencocokkan nota manual sehingga pakaian pelanggan sering terselip." },
              { num: "02", t: "Antrean Kasir Menumpuk", d: "Timbangan manual dan proses kalkulasi harga manual memperlambat proses pendaftaran order." },
              { num: "03", t: "Status Cucian Tidak Jelas", d: "Pelanggan sering menelepon berulang kali hanya untuk menanyakan apakah baju mereka sudah selesai dicuci." },
              { num: "04", t: "Poin Loyalitas Tidak Terdata", d: "Pencatatan poin member di kertas struk fisik mudah hilang, merusak retensi loyalitas pelanggan." }
            ].map((p, idx) => (
              <div key={idx} className="bg-white/60 border border-slate-200/40 rounded-3xl p-5 space-y-2 shadow-2xs">
                <span className="text-xs font-black text-rose-500">{p.num}</span>
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">{p.t}</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SOLUTION SECTION */}
      <section className="py-20 bg-white/40 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">SOLUSI DIGITAL NETTO</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Satu Dasbor <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">
                Solusi Manajemen Mutakhir
              </span>
            </h2>
            <p className="text-sm font-medium text-slate-550 leading-relaxed">
              Netto Laundry mengotomatisasi seluruh pendaftaran timbangan kasir, pencatatan status tim pengerjaan, dan pengiriman notifikasi instan kepada pelanggan dalam satu platform.
            </p>
          </div>
          <div className="lg:col-span-6 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { num: "✓", t: "Otomasi Status Nota", d: "Status pakaian terpantau dari tahap Antre, Lagi Dicuci, Tahap Setrika, hingga Siap Ambil." },
              { num: "✓", t: "Notifikasi WA Otomatis", d: "Sistem mengirimkan rincian invoice dan status pakaian langsung ke nomor WA pelanggan secara instan." },
              { num: "✓", t: "Integrated Loyalty Program", d: "Poin belanja terakumulasi otomatis ke nomor HP member, siap ditukarkan dengan kupon diskon." },
              { num: "✓", t: "Log Feedback & Klaim", d: "Menerima ulasan kepuasan dan pencatatan komplain pakaian warga demi menjaga mutu pelayanan." }
            ].map((s, idx) => (
              <div key={idx} className="bg-white border border-slate-200/50 shadow-xs rounded-3xl p-5 space-y-2 hover:border-blue-500/20 transition-all">
                <span className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">{s.num}</span>
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">{s.t}</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CRM WORKFLOW (Interactive progress maps) */}
      <section id="workflow" className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">ALUR KERJA OPERASIONAL</span>
            <h2 className="text-3xl font-black text-slate-800 uppercase italic">Siklus Pengerjaan Pakaian</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              { num: "01", step: "Drop & Timbang", d: "Pelanggan membawa cucian, kasir mendaftarkan order dan menimbang pakaian di POS." },
              { num: "02", step: "Notifikasi Invoice", d: "WhatsApp Gateway mengirim invoice digital berisi rincian item, berat, dan harga nota." },
              { num: "03", step: "Proses Pencucian", d: "Pakaian dicuci terpisah menggunakan mesin khusus sesuai instruksi label kain." },
              { num: "04", step: "Selesai & Notifikasi", d: "Setelah disetrika rapi, sistem mengirim pesan instan bahwa cucian siap diambil." }
            ].map((wf, idx) => (
              <div key={idx} className="bg-white/80 border border-slate-200/40 shadow-xs rounded-3xl p-6 text-left relative space-y-4 hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-blue-600/30">{wf.num}</span>
                  {idx < 3 && <HiOutlineArrowNarrowRight className="text-slate-300 hidden lg:block text-lg" />}
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">{wf.step}</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{wf.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CITIZEN/CUSTOMER SERVICE */}
      <section className="py-20 bg-white/40 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">PELAYANAN PELANGGAN</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Akselerasi Kepuasan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">
                Pelayanan Laundry Cepat
              </span>
            </h2>
            <p className="text-sm font-medium text-slate-550 leading-relaxed">
              Membangun keterhubungan optimal dengan pelanggan. Status pengerjaan real-time dan notifikasi WhatsApp meminimalkan kekhawatiran pakaian tertukar.
            </p>
          </div>
          <div className="lg:col-span-6 space-y-4">
            {[
              { title: "Status Pengerjaan Terlacak", desc: "Lacak posisi cucian Anda mulai dari antrean pencucian, pengeringan, hingga proses setrika rapi." },
              { title: "Kirim Notifikasi Otomatis", desc: "Pesan instan otomatis meluncur ke nomor HP Anda begitu cucian selesai dikemas oleh petugas kami." },
              { title: "Layanan Antar-Jemput Praktis", desc: "Cukup konfirmasi alamat Anda, staf kami akan menjemput cucian kotor dan mengantarkannya kembali dalam kondisi wangi maksimal." }
            ].map((serv, idx) => (
              <div key={idx} className="bg-white border border-slate-200/40 shadow-xs rounded-3xl p-5 flex items-start gap-4 hover:border-blue-500/10 transition-all">
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

      {/* 10. CUSTOMER LOYALTY (Gamification & rewards) */}
      <section id="loyalty" className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">PROGRAM LOYALITAS PENGGUNA</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Apresiasi Loyalitas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">
                Pelanggan Netto Laundry
              </span>
            </h2>
            <p className="text-sm font-medium text-slate-550 leading-relaxed">
              Program keanggotaan member yang memberikan poin loyalitas dari setiap kilogram cucian Anda. Kumpulkan poin dan tukarkan dengan voucher cuci gratis.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-650">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span> Diskon 15% khusus member Premium di hari ulang tahun.
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-650">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span> Layanan antar-jemput gratis tanpa batas minimum nota pengerjaan.
              </div>
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

      {/* 11. CUSTOMER ENGAGEMENT (Pollings, Fragrance Selection) */}
      <section id="engagement" className="py-20 bg-white/40 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">INTERAKSI PELANGGAN</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Tentukan Aroma <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">
                Parfum Favorit Anda
              </span>
            </h2>
            <p className="text-sm font-medium text-slate-550 leading-relaxed">
              Kami peduli dengan preferensi Anda. Berikan masukan wewangian parfum apa saja yang ingin kami hadirkan sebagai parfum pilihan gratis di outlet Netto.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200/50 rounded-[2rem] p-6 shadow-xs space-y-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">POLLING PARFUM LAUNDRY BULAN INI</span>
              <p className="text-xs font-bold text-slate-800 leading-normal">
                Varian aroma parfum premium manakah yang paling Anda inginkan tersedia di outlet Netto Laundry berikutnya?
              </p>

              {!voted ? (
                <form onSubmit={handleVoteSubmit} className="space-y-3">
                  {[
                    { id: 1, label: "Sakura Blossom (Wangi Lembut & Floral)" },
                    { id: 2, label: "Ocean Fresh (Wangi Segar & Maskulin)" },
                    { id: 3, label: "Baby Cuddle (Wangi Bedak Bayi Lembut)" }
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                        selectedOption === opt.id
                          ? "bg-blue-500/5 border-blue-500 text-slate-800"
                          : "bg-slate-50/60 border-slate-200 text-slate-500 hover:border-slate-350"
                      }`}
                    >
                      <input
                        type="radio"
                        name="laundry_poll"
                        value={opt.id}
                        onChange={() => setSelectedOption(opt.id)}
                        className="hidden"
                      />
                      <span className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedOption === opt.id ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"
                      }`}>
                        {selectedOption === opt.id && <HiCheck size={10} />}
                      </span>
                      <span className="text-xs font-bold">{opt.label}</span>
                    </label>
                  ))}
                  <button
                    type="submit"
                    disabled={!selectedOption}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Kirim Pilihan Saya
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs font-bold text-emerald-600 flex items-center gap-2">
                    <HiOutlineCheckCircle className="text-lg" /> Terima kasih! Pilihan aroma Anda telah terekam.
                  </div>
                  {[
                    { id: 1, label: "Sakura Blossom (Wangi Lembut & Floral)", key: 1 },
                    { id: 2, label: "Ocean Fresh (Wangi Segar & Maskulin)", key: 2 },
                    { id: 3, label: "Baby Cuddle (Wangi Bedak Bayi Lembut)", key: 3 }
                  ].map((res) => {
                    const total = pollVotes[1] + pollVotes[2] + pollVotes[3];
                    const percent = ((pollVotes[res.key] / total) * 100).toFixed(1);
                    return (
                      <div key={res.id} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>{res.label}</span>
                          <span>{percent}% ({pollVotes[res.key]} Vote)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-gradient-to-r from-blue-600 to-sky-500" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => setVoted(false)}
                    className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors cursor-pointer block text-center w-full"
                  >
                    Ulangi Polling (Simulasi)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 12. NEWS PREVIEW */}
      <section className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">EDUKASI DAN KABAR</span>
              <h2 className="text-3xl font-black text-slate-800 uppercase italic">Kabar & Tips Perawatan Pakaian</h2>
            </div>
            <a href="#news" className="text-xs font-black uppercase text-blue-600 hover:text-blue-500 transition-colors flex items-center gap-1.5">
              Lihat Semua Artikel <HiOutlineArrowNarrowRight />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tag: "Perawatan Kain", date: "28 Juni 2026", title: "Cara Tepat Mencuci Pakaian Berbahan Sutra agar Serat Tidak Rusak", desc: "Bahan sutra membutuhkan penanganan khusus. Ketahui teknik memeras dan jenis sabun detergen pH netral yang wajib digunakan." },
              { tag: "Tips & Trik", date: "24 Juni 2026", title: "Mengapa Pakaian Putih Mudah Menguning? Ini Penyebab & Cara Mencegahnya", desc: "Hindari penggunaan pemutih klorin berlebih. Simak tips menjaga kecerahan baju putih menggunakan baking soda secara alami." },
              { tag: "Layanan Netto", date: "19 Juni 2026", title: "Netto Laundry Hadirkan Pewangi Khusus Anti Alergi untuk Pakaian Bayi", desc: "Parfum Baby Cuddle kini hadir dengan formulasi hipoalergenik yang aman untuk kulit sensitif bayi baru lahir." }
            ].map((n, idx) => (
              <div key={idx} className="bg-white border border-slate-200/40 shadow-xs rounded-3xl p-6 space-y-4 hover:border-blue-500/20 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <span className="text-blue-600">{n.tag}</span>
                    <span>{n.date}</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-800 leading-snug tracking-tight">{n.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{n.desc}</p>
                </div>
                <a href="#news-detail" className="text-[10px] font-black uppercase text-slate-650 hover:text-blue-600 transition-colors flex items-center gap-1.5 pt-4">
                  Baca Selengkapnya <HiArrowRight size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. AGENDA / PROMO PREVIEW */}
      <section className="py-20 bg-white/40 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">PROMO AKTIF OUTLET</span>
              <h2 className="text-3xl font-black text-slate-800 uppercase italic">Promo & Paket Diskon Spesial</h2>
            </div>
            <a href="#promos" className="text-xs font-black uppercase text-blue-600 hover:text-blue-500 transition-colors flex items-center gap-1.5">
              Lihat Kalender Promo <HiOutlineArrowNarrowRight />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { date: "04 Jul 2026", time: "Khusus Sabtu - Minggu", loc: "Berlaku Semua Outlet", title: "Weekend Discount 15% Minimal Cuci 6Kg Kiloan Reguler", host: "Petugas Kasir Netto" },
              { date: "09 Jul 2026", time: "Pukul 09:00 - 14:00", loc: "Outlet Dago & Pasteur", title: "Promo Happy Hour: Cuci Satuan Jas Gratis Setrika Kemeja", host: "Petugas Kasir Netto" },
              { date: "15 Jul 2026", time: "Sepanjang Bulan Juli", loc: "Khusus Member Premium", title: "Free Upgrade Parfum Eksklusif Setiap Cuci Sprei/Bedcover", host: "Petugas Kasir Netto" }
            ].map((a, idx) => (
              <div key={idx} className="bg-white border border-slate-200/40 shadow-xs rounded-3xl p-6 hover:border-blue-500/20 transition-all flex gap-4">
                <div className="bg-slate-900 rounded-2xl p-3 flex flex-col justify-center items-center text-center shrink-0 w-16 h-20 text-white">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Juli</span>
                  <span className="text-lg font-black leading-none">{a.date.split(" ")[0]}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-slate-800 leading-snug tracking-tight">{a.title}</h3>
                  <div className="space-y-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <p>🕒 {a.time}</p>
                    <p>📍 {a.loc}</p>
                    <p>👤 Host: {a.host}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. NOTIFICATION CENTER */}
      <section className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">NOTIFIKASI PENGINGAT</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              WhatsApp Gateway <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">
                Notifikasi Instan Nota & Poin
              </span>
            </h2>
            <p className="text-sm font-medium text-slate-550 leading-relaxed">
              Anda tidak perlu lagi menyimpan struk kertas. Sistem kami secara otomatis mengirimkan pemberitahuan status cucian dan info poin masuk langsung ke WhatsApp Anda.
            </p>
          </div>
          <div className="lg:col-span-6 space-y-4">
            {[
              { type: "Reminder Cucian Selesai", msg: "Notifikasi otomatis dikirimkan begitu pakaian Anda telah disetrika, dipacking rapi, dan siap diambil." },
              { type: "Reminder Pengambilan", msg: "Pemberitahuan ramah pengingat pengambilan jika cucian sudah siap lebih dari 3 hari di loker kami." },
              { type: "Pemberitahuan Poin Loyalitas", msg: "Update saldo poin instan setiap selesai melakukan transaksi pembayaran di kasir." }
            ].map((n, idx) => (
              <div key={idx} className="bg-white border border-slate-200/40 shadow-xs rounded-3xl p-5 flex items-start gap-4 hover:border-blue-500/10 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <HiOutlineVolumeUp className="text-lg" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">{n.type}</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{n.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. CUSTOMER SERVICE CENTER (Live Chat Simulator) */}
      <section className="py-20 bg-white/40 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">KONTAK DUKUNGAN CS</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Customer Service <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">
                24/7 Staf Admin Kasir
              </span>
            </h2>
            <p className="text-sm font-medium text-slate-550 leading-relaxed">
              Hubungi layanan admin pelanggan kami secara langsung. Dapatkan bantuan mengenai salah antar, paket hilang, klaim ganti rugi, atau pertanyaan umum seputar paket franchise laundry.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                <HiOutlinePhone className="text-blue-600 text-lg shrink-0" />
                <span>WhatsApp Hotline: +62 812-9988-7766</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                <HiOutlineMail className="text-blue-600 text-lg shrink-0" />
                <span>Email Dukungan: cs.nettolaundry@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col h-96 shadow-md">
              {/* CS Header */}
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                    NL
                  </div>
                  <div>
                    <h4 className="text-xs font-black">ASISTEN CHAT NETTO</h4>
                    <span className="block text-[8px] text-blue-400 font-bold uppercase tracking-wider">Online Sekarang</span>
                  </div>
                </div>
              </div>

              {/* CS Message Box */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed ${
                      msg.sender === "user" ? "bg-blue-600 text-white" : "bg-white text-slate-800 border border-slate-200"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* CS Form Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  required
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik pesan di sini (contoh: harga cuci)..."
                  className="flex-1 bg-slate-50/60 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Kirim
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 16. COMPLAINT MANAGEMENT (Klaim Cucian Hilang/Rusak) */}
      <section className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">MANAJEMEN KLAIM PENGADUAN</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Klaim Cucian & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">
                Pantau Tindakan Kasir
              </span>
            </h2>
            <p className="text-sm font-medium text-slate-550 leading-relaxed">
              Jika pakaian Anda terselip, tertukar, atau mengalami kerusakan, silakan ajukan laporan klaim langsung. Staf kami akan segera menindaklanjutinya dalam 1x24 jam.
            </p>

            {/* List Keluhan Aktif */}
            <div className="space-y-3 pt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">STATUS KLAIM TERDAFTAR</span>
              {complaints.map((c) => (
                <div key={c.id} className="bg-white border border-slate-200/60 shadow-2xs rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-blue-600">{c.id} • {c.category}</span>
                    <h4 className="text-xs font-bold text-slate-800">{c.title}</h4>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                    c.status === "Selesai" ? "bg-emerald-100 text-emerald-700 border border-emerald-250" :
                    c.status === "Diproses" ? "bg-amber-100 text-amber-700 border border-amber-250" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200/50 rounded-[2rem] p-6 shadow-xs space-y-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">AJUKAN KLAIM BARU</span>

              {complaintSuccess && (
                <div className="p-4 bg-emerald-100 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-2">
                  <HiOutlineCheckCircle className="text-lg" /> Laporan klaim pakaian berhasil diajukan! Staf kami akan segera memproses.
                </div>
              )}

              <form onSubmit={handleComplaintSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Rincian Komplain Pakaian</label>
                  <input
                    type="text"
                    required
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                    placeholder="Contoh: Kemeja flanel biru hilang di nota #TRX-1024..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Kategori Masalah</label>
                  <select
                    value={newComplaint.category}
                    onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="Pakaian Hilang">Pakaian Hilang / Tertukar</option>
                    <option value="Durasi Layanan">Keterlambatan Waktu Cucian</option>
                    <option value="Pakaian Rusak">Pakaian Robek / Luntur</option>
                    <option value="Lainnya">Lainnya (Masalah Pembayaran, Kasir)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Ajukan Klaim Pakaian
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 17. FEEDBACK MANAGEMENT (Customer Feedback collection) */}
      <section className="py-20 bg-white/40 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">ULASAN KEPUASAN</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic leading-tight">
              Masukan & Rating <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">
                Aspirasi Pelanggan Netto
              </span>
            </h2>
            <p className="text-sm font-medium text-slate-550 leading-relaxed">
              Ulasan jujur Anda membantu kami melatih staf kasir dan tim laundry untuk memberikan hasil cucian yang lebih higienis, rapi, dan cepat.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {feedbacks.map((f) => (
                <div key={f.id} className="bg-white border border-slate-200/50 rounded-3xl p-5 space-y-2 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-slate-800">{f.name}</h4>
                    <span className="text-[9.5px] font-bold text-slate-400">{f.role}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">"{f.comment}"</p>
                  <p className="text-xs text-amber-400">{"★".repeat(f.rating)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="bg-white border border-slate-200/50 rounded-[2rem] p-6 shadow-xs space-y-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">KIRIMKAN RATING PELAYANAN</span>

              {feedbackSuccess && (
                <div className="p-4 bg-emerald-100 border border-emerald-250 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-2">
                  <HiOutlineCheckCircle className="text-lg" /> Terima kasih! Masukan Anda sangat berharga bagi kami.
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={userFeedback.name}
                    onChange={(e) => setUserFeedback({ ...userFeedback, name: e.target.value })}
                    placeholder="Masukkan nama Anda..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Penilaian (Rating)</label>
                  <select
                    value={userFeedback.rating}
                    onChange={(e) => setUserFeedback({ ...userFeedback, rating: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ Sangat Puas</option>
                    <option value={4}>⭐⭐⭐⭐ Puas</option>
                    <option value={3}>⭐⭐⭐ Cukup</option>
                    <option value={2}>⭐⭐ Mengecewakan</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Ulasan Kritik & Saran</label>
                  <textarea
                    required
                    rows={3}
                    value={userFeedback.comment}
                    onChange={(e) => setUserFeedback({ ...userFeedback, comment: e.target.value })}
                    placeholder="Tuliskan pengalaman mencuci Anda di sini..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Kirim Ulasan Saya
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 18. INTEGRATIONS (Tech Stack integrations showcase) */}
      <section className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">INTEGRASI DIGITAL</span>
            <h2 className="text-3xl font-black text-slate-800 uppercase italic">Sistem Kasir Terintegrasi Modern</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {[
              { title: "Google Maps API", d: "Menemukan lokasi cabang outlet Netto Laundry terdekat." },
              { title: "WhatsApp Gateway", d: "Pengiriman invoice digital dan status nota cuci secara otomatis." },
              { title: "SMTP Mailer", d: "Sistem pengirim tagihan korporasi hotel/salon bulanan." },
              { title: "Firebase Messaging", d: "Pusat broadcast kupon diskon member real-time." },
              { title: "RESTful JSON API", d: "Konektivitas stabil antara timbangan digital & sistem POS kasir." },
              { title: "SQLite / Room DB", d: "Pencatatan data pelanggan offline di tablet kasir." }
            ].map((integ, idx) => (
              <div key={idx} className="bg-white border border-slate-200/50 shadow-xs rounded-3xl p-5 hover:border-blue-500/20 transition-all space-y-2">
                <span className="text-lg">⚡</span>
                <h4 className="text-[10.5px] font-black uppercase tracking-wider text-slate-800">{integ.title}</h4>
                <p className="text-[9.5px] text-slate-400 font-medium leading-normal">{integ.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 19. TESTIMONIALS */}
      <section className="py-20 bg-white/40 border-t border-slate-200/50">
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
              <div key={idx} className="bg-white border border-slate-200/40 shadow-xs rounded-3xl p-6 text-left space-y-4 hover:border-blue-500/20 transition-all">
                <p className="text-[11.5px] text-slate-500 leading-relaxed font-medium italic">"{t.t}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-sky-600 flex items-center justify-center text-white font-black text-xs">
                    {t.n[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-850">{t.n}</h4>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t.r}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 20. FAQ SECTION */}
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
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span>{idx + 1}. {faq.q}</span>
                    <HiOutlineChevronDown className={`transform transition-transform ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-4 pt-1 text-[11px] text-slate-500 font-medium leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 21. FINAL CTA */}
      <section id="download" className="py-24 border-t border-slate-200/50 relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800 uppercase italic leading-tight">
            Tingkatkan Bisnis Laundry Anda Bersama <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 font-black not-italic">
              Netto Laundry CRM & POS
            </span>
          </h2>
          <p className="text-sm font-medium text-slate-500 max-w-xl mx-auto leading-relaxed">
            Mulailah mengotomatisasi pencatatan pembukuan nota kasir, penimbangan pakaian, dan sistem loyalty program pelanggan secara terpadu sekarang juga.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => alert("Mengunduh aplikasi Netto Laundry Kasir v3.0.0...")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:brightness-105 active:scale-[0.98] cursor-pointer"
            >
              Coba Sekarang
            </button>
            <a
              href="#cs-center"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("engagement")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-650 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-2xs"
            >
              Hubungi Admin Kasir
            </a>
          </div>
        </div>
      </section>

      {/* 22. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
                N
              </div>
              <span className="text-sm font-black tracking-tight text-white uppercase italic">
                Netto<span className="text-blue-500 font-black not-italic">Laundry</span>
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Platform Manajemen Hubungan Pelanggan & Point of Sale Laundry Modern demi mempercepat pengerjaan cucian higienis.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">Hubungi Kami</h4>
            <div className="space-y-2 text-[11px]">
              <p className="flex items-center gap-2">📞 +62 812-9988-7766</p>
              <p className="flex items-center gap-2">✉️ cs.nettolaundry@gmail.com</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">Alamat Kantor</h4>
            <p className="text-[11px] leading-relaxed">
              Jl. Soekarno-Hatta No. 456, Pasteur, Kec. Coblong, Kota Bandung, Jawa Barat, Indonesia.
            </p>
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
