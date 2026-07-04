import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import Lenis from "lenis";
import {
  HiOutlineChevronDown,
  HiOutlineCheckCircle,
  HiOutlineChatAlt,
  HiOutlineShieldCheck,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineVolumeUp,
  HiOutlineSparkles,
  HiArrowRight,
  HiCheck,
  HiMenu,
  HiX,
  HiStar,
  HiExclamationCircle,
  HiPaperAirplane
} from "react-icons/hi";
import { MdLocalLaundryService } from "react-icons/md";
import { useAuth } from "../utils/AuthContext";
import { getOrderById } from "../utils/ordersStorage";
import { submitFeedback } from "../utils/feedbackStorage";
import { toast } from "react-hot-toast";
import SequenceScroll from "../components/SequenceScroll";

// ─── COUNT UP COMPONENT FOR STATS ───
const CountUp = ({ value, duration = 2.5 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.replace(/\D/g, ""), 10) || 0;
      const startTime = performance.now();

      const animate = (timestamp) => {
        const progress = Math.min(1, (timestamp - startTime) / (duration * 1000));
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration]);

  const suffix = value.replace(/[0-9]/g, "");

  return (
    <span ref={ref} className="font-outfit font-black text-6xl md:text-8xl tracking-tight text-white">
      {count.toLocaleString("id-ID")}
      <span className="text-blue-500">{suffix}</span>
    </span>
  );
};

// ─── SCROLL REVEAL TEXT COMPONENT ───
const ScrollRevealText = ({ text }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const words = text.split(" ");
  return (
    <p ref={ref} className="text-3xl md:text-5xl font-jakarta font-extrabold text-slate-450 leading-relaxed max-w-4xl mx-auto flex flex-wrap gap-x-3 gap-y-2 justify-center">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
        return (
          <motion.span key={i} style={{ opacity }} className="text-white">
            {word}
          </motion.span>
        );
      })}
    </p>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  // Loading Sequence State
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Fullscreen Menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Smooth Scroll (Lenis) setup
  useEffect(() => {
    if (!loadingComplete) return;
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, [loadingComplete]);

  // Scrollytelling scroll calculation for overlay text animations
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  // Calculate Opacity & Translation for each overlay text block
  const opacity1 = useTransform(scrollYProgress, [0, 0.12, 0.20], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.20], [0, -50]);

  const opacity2 = useTransform(scrollYProgress, [0.22, 0.28, 0.38, 0.45], [0, 1, 1, 0]);
  const x2 = useTransform(scrollYProgress, [0.22, 0.28, 0.45], [-50, 0, 50]);

  const opacity3 = useTransform(scrollYProgress, [0.48, 0.55, 0.65, 0.72], [0, 1, 1, 0]);
  const x3 = useTransform(scrollYProgress, [0.48, 0.55, 0.72], [50, 0, -50]);

  const opacity4 = useTransform(scrollYProgress, [0.75, 0.82, 0.95], [0, 1, 1]);
  const y4 = useTransform(scrollYProgress, [0.75, 0.82], [50, 0]);

  // Interactive Live Tracking State
  const [trackingInput, setTrackingInput] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");

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
        setTrackingError("Nota tidak ditemukan. Contoh: ORD-001");
        toast.error("Nomor order tidak ditemukan.");
      } else {
        setTrackingResult(data);
        toast.success("Pesanan ditemukan!");
      }
    } catch (err) {
      setTrackingError("Kesalahan koneksi database.");
      toast.error("Kesalahan koneksi database.");
    } finally {
      setTrackingLoading(false);
    }
  };

  // Interactive Live Chat Simulator State
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Halo! Saya Asisten Virtual Netto. Ada yang bisa saya bantu hari ini?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = { sender: "user", text: inputMessage };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    setTimeout(() => {
      let replyText = "Terima kasih. Kami menyediakan layanan cuci kiloan, dry cleaning, dan perawatan kulit premium.";
      if (inputMessage.toLowerCase().includes("harga") || inputMessage.toLowerCase().includes("tarif")) {
        replyText = "Tarif kami: Kiloan Rp 7.000/Kg, Express Rp 12.000/Kg, Cuci Sepatu mulai dari Rp 35.000.";
      } else if (inputMessage.toLowerCase().includes("status") || inputMessage.toLowerCase().includes("lacak")) {
        replyText = "Gunakan widget 'Lacak Pakaian' di dashboard bento ini dengan memasukkan nomor invoice Anda.";
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: replyText }]);
    }, 800);
  };

  // Interactive Feedback state
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [userFeedback, setUserFeedback] = useState({ name: "", comment: "", rating: 5 });

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!userFeedback.name.trim() || !userFeedback.comment.trim()) {
      toast.error("Nama dan ulasan wajib diisi!");
      return;
    }
    try {
      await submitFeedback({
        customerName: userFeedback.name.trim(),
        rating: userFeedback.rating,
        comment: userFeedback.comment.trim(),
        service: "Layanan Premium",
      });
      setFeedbackSuccess(true);
      toast.success("Ulasan berhasil dikirim! Terima kasih.");
    } catch (err) {
      toast.error("Gagal mengirim ulasan.");
    }
  };

  // Testimonial Carousel AutoPlay state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    { n: "Alexandra V.", r: "Sosialita & Kolektor Fashion", t: "Sutera dan gaun couture saya dirawat dengan keahlian luar biasa. Wanginya anggun dan serat kainnya tetap sempurna." },
    { n: "Bramantyo N.", r: "Pengusaha", t: "Netto membantu menghemat waktu saya. Jas premium disetrika dengan kehalusan tingkat tinggi. Layanan terbaik di kota." },
    { n: "Siti Rahma", r: "Desainer Interior", t: "Koleksi linen mewah dan karpet sutera saya selalu kembali bersih tanpa cela. Komitmen ramah lingkungan mereka sangat patut diapresiasi." }
  ];

  useEffect(() => {
    if (!loadingComplete) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [loadingComplete, testimonials.length]);

  return (
    <div className="bg-[#090d16] text-[#f8fafc] font-outfit min-h-screen relative overflow-x-hidden">
      
      {/* ─── PRELOADER SCREEN ─── */}
      <AnimatePresence>
        {!loadingComplete && (
          <motion.div
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            className="fixed inset-0 z-999 bg-[#090d16] flex flex-col justify-between p-8 md:p-16 select-none"
          >
            <div className="flex justify-between items-center">
              <span className="font-outfit font-black text-xs uppercase tracking-[0.3em] text-blue-500">NETTO LAUNDRY</span>
              <span className="font-outfit font-medium text-xs text-slate-500">LINDUNGI BENANG TERDALAM</span>
            </div>
            
            <div className="my-auto space-y-6">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: 80 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="font-outfit font-black text-6xl md:text-9xl tracking-tighter text-white"
                >
                  {loadingProgress}%
                </motion.h1>
              </div>
              <div className="h-[2px] bg-slate-800 w-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-end">
              <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed uppercase tracking-wider">
                Mempersiapkan pengalaman visual ultra-higienis
              </p>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                MEMUAT FRAME CITRA...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── IMMERSIVE NAVBAR ─── */}
      <nav className="fixed top-0 inset-x-0 z-45 bg-gradient-to-b from-[#090d16]/80 to-transparent backdrop-blur-md px-6 py-5 border-b border-white/5 flex items-center justify-between transition-all">
        <Link to="/" className="font-outfit font-black text-sm uppercase tracking-[0.3em] text-white flex items-center gap-2 group">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
          NETTO LAUNDRY
        </Link>

        <div className="flex items-center gap-6">
          {/* Main Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 font-outfit text-xs font-black uppercase tracking-widest text-slate-400">
            <a href="#about" className="hover:text-white transition-colors">Tentang</a>
            <a href="#services" className="hover:text-white transition-colors">Layanan</a>
            <a href="#stats" className="hover:text-white transition-colors">Statistik</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Ulasan</a>
          </div>

          <div className="h-4 w-[1px] bg-white/10 hidden lg:block" />

          {/* Quick Admin/User login buttons */}
          {user ? (
            <Link
              to={role === "admin" ? "/dashboard" : "/user"}
              className="px-4 py-2 rounded-full bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-md shadow-blue-500/25"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Masuk Pelanggan
            </Link>
          )}

          {/* Luxury Fullscreen Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors relative"
          >
            {isMenuOpen ? <HiX size={18} /> : <HiMenu size={18} />}
          </button>
        </div>
      </nav>

      {/* ─── FULLSCREEN NAV OVERLAY ─── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-[#090d16]/95 backdrop-blur-2xl flex flex-col justify-between p-8 md:p-24 pt-32"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-auto">
              <div className="space-y-6 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500">NAVIGASI UTAMA</span>
                <div className="space-y-3 font-outfit text-4xl md:text-6xl font-black uppercase tracking-tighter">
                  {[
                    { label: "Tentang Kami", href: "#about" },
                    { label: "Layanan Bento", href: "#services" },
                    { label: "Ulasan Klien", href: "#testimonials" },
                    { label: "Kemitraan", href: "#footer" }
                  ].map((link, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 15 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="group flex items-center gap-3"
                    >
                      <a
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-slate-400 group-hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                      <HiArrowRight className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" size={24} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Concierge Info Side */}
              <div className="space-y-8 border-l border-white/5 pl-8 md:pl-16 flex flex-col justify-center">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 block mb-2">HOTLINE 24/7</span>
                  <p className="text-lg font-bold text-white">+62 (21) 9988-7766</p>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 block mb-2">OUTLET UTAMA</span>
                  <p className="text-sm font-medium text-slate-300 leading-relaxed">
                    Jl. Luxury Avenue No. 25-27, Kebayoran Baru, Jakarta Selatan
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 block mb-2">SOSIAL MEDIA</span>
                  <div className="flex gap-4 text-xs font-black uppercase tracking-wider text-slate-400">
                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-white/5 pt-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>© {new Date().getFullYear()} NETTO LAUNDRY CO.</span>
              <span>TERAKREDITASI INTERNASIONAL</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── STICKY CANVAS SCROLLYTELLING HERO ─── */}
      <div ref={heroRef} className="relative">
        <SequenceScroll
          onLoadingProgress={(p) => setLoadingProgress(p)}
          onLoaded={() => setLoadingComplete(true)}
        />

        {/* Cinematic Indonesian Text Overlay Layers */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          
          {/* Overlay 1: 0% - 20% Scroll (Centered Title) */}
          <motion.div
            style={{ opacity: opacity1, y: y1 }}
            className="sticky top-0 h-screen w-full flex flex-col items-center justify-center text-center px-6"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-4">NETTO LAUNDRY</span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase italic leading-none max-w-4xl">
              SENI PERAWATAN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400">PAKAIAN MODERN.</span>
            </h1>
            <p className="text-xs md:text-sm font-medium text-slate-300 mt-6 tracking-widest max-w-[280px] uppercase">
              Gulir perlahan untuk melihat transformasi serat kain
            </p>
          </motion.div>

          {/* Overlay 2: 22% - 45% Scroll (Left Aligned Block) */}
          <motion.div
            style={{ opacity: opacity2, x: x2 }}
            className="sticky top-0 h-screen w-full flex flex-col justify-center items-start px-8 md:px-32 max-w-xl"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 mb-3">01 / HIGIENITAS MUTLAK</span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase italic">
              LEBIH DARI SEKADAR MENCUCI.
            </h2>
            <p className="text-sm font-medium text-slate-300 mt-4 leading-relaxed">
              Teknologi sanitasi ultra-higienis modern yang mengangkat partikel terkecil kotoran dan menjaga keaslian serat kain terdalam.
            </p>
          </motion.div>

          {/* Overlay 3: 48% - 72% Scroll (Right Aligned Block) */}
          <motion.div
            style={{ opacity: opacity3, x: x3 }}
            className="sticky top-0 h-screen w-full flex flex-col justify-center items-end text-right px-8 md:px-32 ml-auto max-w-xl"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-400 mb-3">02 / AKREDITASI HIJAU</span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase italic">
              KEMURNIAN YANG TERJAGA.
            </h2>
            <p className="text-sm font-medium text-slate-300 mt-4 leading-relaxed">
              Setiap helai benang pakaian Anda dirawat secara hati-hati dengan formula bio-biodegradable yang sepenuhnya ramah terhadap lingkungan.
            </p>
          </motion.div>

          {/* Overlay 4: 75% - 100% Scroll (Centered Call to Action) */}
          <motion.div
            style={{ opacity: opacity4, y: y4 }}
            className="sticky top-0 h-screen w-full flex flex-col items-center justify-center text-center px-6"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500 mb-4">TRANSFORMASI TOTAL</span>
            <h2 className="text-4xl md:text-7xl font-black text-white leading-none uppercase italic max-w-3xl">
              RASAKAN KEMEWAHAN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">PAKAIAN BERSIH.</span>
            </h2>
            
            {/* Interactive Magnetic CTA */}
            <div className="mt-8 pointer-events-auto">
              <a
                href="#services"
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white font-black text-xs uppercase tracking-widest px-8 py-5 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Pesan Layanan Sekarang <HiArrowRight size={14} />
              </a>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ─── CONTENT WRAPPER (Cinematic Overlap Effect) ─── */}
      <div className="-mt-[100vh] relative z-10 bg-[#090d16] pt-32 pb-24 space-y-36">
        
        {/* ─── ABOUT SECTION (Scroll reveal) ─── */}
        <section id="about" className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">MANIFESTO NETTO</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase italic">
              KOMMITMEN FISIKA & BIOLOGI KAIN
            </h2>
          </div>
          <ScrollRevealText
            text="Pakaian adalah lapisan identitas diri Anda. Kami di Netto tidak hanya membersihkan noda permukaan, melainkan merestorasi arsitektur benang, menjaga warna agar tetap cemerlang, dan menjamin tingkat higienitas tertinggi melalui teknologi inovatif ramah lingkungan."
          />
        </section>

        {/* ─── BENTO GRID SHOWCASE (Interactive & Services) ─── */}
        <section id="services" className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">LAYANAN BENTO</span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic leading-none">
              PORTAL LAYANAN INTELEKTUAL
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento 1: Dry Cleaning Card */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[360px] relative overflow-hidden group hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <HiOutlineSparkles size={24} />
                </div>
                <h3 className="font-outfit font-black text-xl text-white uppercase tracking-wider">Dry Cleaning Couture</h3>
                <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
                  Metode pencucian khusus pakaian berbahan premium, sutera, dan gaun formal dengan presisi temperatur dan detergen khusus.
                </p>
              </div>
              <div className="flex justify-between items-center relative z-10">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">MULAI RP 45.000</span>
                <span className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center transition-all">
                  <HiArrowRight size={14} />
                </span>
              </div>
            </div>

            {/* Bento 2: Premium Leather Care */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[360px] relative overflow-hidden group hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <HiOutlineShieldCheck size={24} />
                </div>
                <h3 className="font-outfit font-black text-xl text-white uppercase tracking-wider">Premium Leather Care</h3>
                <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
                  Seni merawat bahan kulit asli, suede, sepatu, dan tas branded. Memulihkan kelembutan permukaan tanpa merusak tekstur.
                </p>
              </div>
              <div className="flex justify-between items-center relative z-10">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">MULAI RP 75.000</span>
                <span className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-indigo-500 group-hover:text-white flex items-center justify-center transition-all">
                  <HiArrowRight size={14} />
                </span>
              </div>
            </div>

            {/* Bento 3: Bedding Therapy */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[360px] relative overflow-hidden group hover:border-sky-500/20 hover:shadow-2xl hover:shadow-sky-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors" />
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <MdLocalLaundryService size={24} />
                </div>
                <h3 className="font-outfit font-black text-xl text-white uppercase tracking-wider">Bedding Therapy</h3>
                <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
                  Sanitasi super higienis untuk bedcover besar, sprei sutera, dan tirai. Menghilangkan 99.9% tungau dan alergen debu mikro.
                </p>
              </div>
              <div className="flex justify-between items-center relative z-10">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">MULAI RP 35.000</span>
                <span className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center transition-all">
                  <HiArrowRight size={14} />
                </span>
              </div>
            </div>

            {/* Bento 4: Live Tracking Simulator Widget */}
            <div className="md:col-span-2 bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-500">PELACAKAN REALTIME</span>
                  <h3 className="font-outfit font-black text-2xl text-white uppercase tracking-wider">Lacak Pakaian Klien</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    Masukkan nomor nota / invoice Anda untuk melacak posisi cucian Anda di antrean pencucian secara waktu nyata.
                  </p>
                  
                  <form onSubmit={handleLiveTrack} className="flex gap-2 mt-4">
                    <input
                      type="text"
                      placeholder="Contoh: ORD-001"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 flex-1"
                    />
                    <button
                      type="submit"
                      disabled={trackingLoading}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] uppercase tracking-widest px-6 rounded-xl transition-all shadow-md shadow-blue-500/25 disabled:opacity-50"
                    >
                      {trackingLoading ? "..." : "Cari"}
                    </button>
                  </form>
                  {trackingError && <p className="text-[10px] text-red-400 font-bold mt-2">{trackingError}</p>}
                </div>

                {/* Tracking Result View */}
                <div className="bg-[#0b0e17]/80 rounded-2xl p-5 border border-white/5 space-y-4">
                  {trackingResult ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs font-black text-white">{trackingResult.id}</span>
                        <span className="text-[9px] font-black uppercase bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                          {trackingResult.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-400 font-medium">
                        <p>Layanan: <strong className="text-white">{trackingResult.service}</strong></p>
                        <p>Bobot: <strong className="text-white">{trackingResult.weight}</strong></p>
                        <p>Biaya: <strong className="text-white">Rp {Number(trackingResult.price || 0).toLocaleString("id-ID")}</strong></p>
                      </div>
                      
                      {/* Interactive Timeline Progress */}
                      <div className="pt-2">
                        <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                          <span className={trackingResult.currentStep >= 0 ? "text-blue-500" : ""}>Rak</span>
                          <span className={trackingResult.currentStep >= 1 ? "text-blue-500" : ""}>Cuci</span>
                          <span className={trackingResult.currentStep >= 2 ? "text-blue-500" : ""}>Setrika</span>
                          <span className={trackingResult.currentStep >= 3 ? "text-blue-500" : ""}>Ready</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden flex">
                          <div
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${((trackingResult.currentStep + 1) / 4) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col justify-center items-center text-center py-6 text-slate-500">
                      <HiOutlineVolumeUp className="text-2xl mb-2 text-slate-600 animate-bounce" />
                      <p className="text-[10px] font-black uppercase tracking-wider">MENUNGGU DATA INVOICE</p>
                      <p className="text-[9px] font-medium text-slate-600 max-w-[180px] mt-1 leading-normal">
                        Status cuci otomatis realtime langsung dari sistem pos kasir Netto.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bento 5: Live Chat Assistant */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden group flex flex-col justify-between h-[360px] md:h-auto">
              <div className="space-y-4">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-500">KONSULTASI INSTAN</span>
                <h3 className="font-outfit font-black text-2xl text-white uppercase tracking-wider leading-none">Netto Help Center</h3>
                
                <div className="h-[140px] overflow-y-auto bg-slate-900/60 rounded-2xl p-3 border border-white/5 space-y-2 text-[10px] scrollbar-thin">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-2.5 rounded-xl max-w-[85%] font-medium leading-relaxed ${msg.sender === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white/5 text-slate-300 rounded-tl-none border border-white/5"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
                <input
                  type="text"
                  placeholder="Ketik 'harga' atau tanya sesuatu..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-[10px] font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-white/10 hover:bg-blue-600 hover:text-white text-slate-400 font-bold p-2.5 rounded-xl transition-all flex items-center justify-center"
                >
                  <HiPaperAirplane size={14} className="rotate-45" />
                </button>
              </form>
            </div>

            {/* Bento 6: Customer Feedback Form */}
            <div className="md:col-span-3 bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-500">ULASAN KEPUASAN</span>
                  <h3 className="font-outfit font-black text-3xl text-white uppercase tracking-wider leading-none">Bagikan Pengalaman Anda</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    Kepuasan Anda adalah prioritas kami. Masukan dari Anda membantu tim Netto Laundry terus berkembang menjadi yang terbaik.
                  </p>
                  
                  {/* Rating Selector */}
                  <div className="flex gap-2 items-center">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Beri Rating:</span>
                    <div className="flex gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserFeedback((prev) => ({ ...prev, rating: star }))}
                        >
                          <HiStar size={20} className={star <= userFeedback.rating ? "fill-current" : "text-slate-600"} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-[#0b0e17]/80 rounded-2xl p-5 border border-white/5">
                  {feedbackSuccess ? (
                    <div className="text-center py-6 space-y-3">
                      <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500">
                        <HiCheck size={24} />
                      </div>
                      <p className="text-xs font-black text-white uppercase tracking-wider">ULASAN BERHASIL DIKIRIM</p>
                      <p className="text-[10px] text-slate-400 font-medium max-w-[240px] mx-auto leading-normal">
                        Terima kasih atas masukan Anda. Kami menghargai setiap ulasan yang Anda berikan.
                      </p>
                      <button
                        onClick={() => { setFeedbackSuccess(false); setUserFeedback({ name: "", comment: "", rating: 5 }); }}
                        className="text-amber-500 font-bold text-[10px] uppercase tracking-widest mt-2 underline"
                      >
                        Kirim Ulasan Lain
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Nama Lengkap Anda"
                        value={userFeedback.name}
                        onChange={(e) => setUserFeedback((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                      <textarea
                        rows={3}
                        placeholder="Tulis ulasan/komentar pengalaman Anda..."
                        value={userFeedback.comment}
                        onChange={(e) => setUserFeedback((prev) => ({ ...prev, comment: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                      />
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-400 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-xl transition-all shadow-md shadow-amber-500/20"
                      >
                        Kirim Ulasan
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── ANIMATED STATS SECTION ─── */}
        <section id="stats" className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-2">
              <CountUp value="50.000+" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-450">Helai Pakaian Dirawat</p>
            </div>
            <div className="space-y-2 border-y md:border-y-0 md:border-x border-white/5 py-8 md:py-0">
              <CountUp value="99.9%" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-450">Bakteri & Alergen Mati</p>
            </div>
            <div className="space-y-2">
              <CountUp value="100%" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-450">Formula Ramah Lingkungan</p>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIAL SLIDER ─── */}
        <section id="testimonials" className="max-w-7xl mx-auto px-6 py-12 relative overflow-hidden">
          <div className="text-center space-y-2 max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">ULASAN KLIEN</span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic leading-none">
              APRESIASI DARI MEREKA
            </h2>
          </div>

          <div className="min-h-[220px] flex items-center justify-center text-center">
            <AnimatePresence mode="wait">
              {testimonials.map((test, idx) => (
                idx === currentTestimonial && (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl space-y-6"
                  >
                    <p className="text-xl md:text-3xl font-jakarta font-medium text-slate-200 leading-relaxed italic">
                      "{test.t}"
                    </p>
                    <div className="space-y-1">
                      <p className="font-outfit font-black text-sm uppercase tracking-widest text-white">{test.n}</p>
                      <p className="text-[10px] font-black uppercase tracking-wider text-blue-500">{test.r}</p>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2 justify-center mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentTestimonial ? "w-6 bg-blue-500" : "bg-slate-700 hover:bg-slate-600"}`}
              />
            ))}
          </div>
        </section>

        {/* ─── CTA & FOOTER ─── */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 rounded-3xl p-8 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">LAYANAN MANDIRI</span>
              <h2 className="text-4xl md:text-7xl font-black text-white leading-none uppercase italic">
                SIAP MERAWAT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-sky-100">PAKAIAN KESAYANGAN?</span>
              </h2>
              <p className="text-sm font-medium text-blue-100/80 leading-relaxed">
                Segera nikmati kualitas perawatan pakaian premium kelas dunia langsung di genggaman Anda. Masuk ke portal pelanggan untuk transaksi cepat dan kumpulkan poin loyalitas.
              </p>
              <div className="pt-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 rounded-full bg-white text-blue-900 font-black text-xs uppercase tracking-widest px-8 py-5 shadow-xl hover:bg-blue-50 hover:shadow-2xl transition-all hover:-translate-y-0.5"
                >
                  Daftar Member Sekarang <HiArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer id="footer" className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-16 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <span className="font-outfit font-black text-sm uppercase tracking-[0.3em] text-white">NETTO LAUNDRY</span>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                Merestorasi identitas kain melalui keahlian sains dan ketelitian biologis. Layanan cuci premium bersertifikasi internasional.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">PRODUK & FITUR</h4>
              <div className="flex flex-col gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                <a href="#services" className="hover:text-white transition-colors">Cuci Kiloan</a>
                <a href="#services" className="hover:text-white transition-colors">Dry Cleaning</a>
                <a href="#services" className="hover:text-white transition-colors">Leather & Suede</a>
                <a href="#services" className="hover:text-white transition-colors">Bedding Care</a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">KEMITRAAN & LEBIH</h4>
              <div className="flex flex-col gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                <Link to="/login" className="hover:text-white transition-colors">Login Admin</Link>
                <Link to="/register" className="hover:text-white transition-colors">Gabung Member</Link>
                <a href="#" className="hover:text-white transition-colors">Franchise</a>
                <a href="#" className="hover:text-white transition-colors">Karir</a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">LINDUNGI PAKAIAN</h4>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                Langganan newsletter kami untuk mendapatkan tips eksklusif perawatan serat sutera & wol langsung dari para ahli tekstil.
              </p>
            </div>
          </div>

          <div className="border-t border-white/5 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-550 uppercase tracking-widest">
            <span>© {new Date().getFullYear()} NETTO LAUNDRY CO. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">KEBIJAKAN PRIVASI</a>
              <a href="#" className="hover:text-white transition-colors">SYARAT & KETENTUAN</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
