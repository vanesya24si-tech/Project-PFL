import React, { useState, useMemo, useEffect } from "react";
import { getAllOrders, advanceOrderStep, subscribeToAllOrders, STEP_THEME, buildTrackingUrl } from "../utils/ordersStorage";
import { HiClock, HiCheckCircle, HiSearch, HiPrinter } from "react-icons/hi";
import { MdLocalLaundryService, MdIron, MdLayers, MdArrowForward } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { Separator } from "../components/ui/Separator";
import { Switch } from "../components/ui/Switch";
import { Tooltip } from "../components/ui/Tooltip";

export default function Tracking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePrintOrder, setActivePrintOrder] = useState(null);
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Data order diambil dari Supabase (bukan lokal lagi) supaya nyambung dengan
  // order yang dibuat lewat /orders/add dan barcode/QR yang di-scan pelanggan.
  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      setIsLoading(true);
      const { data, error } = await getAllOrders();
      if (!isMounted) return;
      if (error) {
        setLoadError("Gagal memuat data order dari server. Cek koneksi/konfigurasi Supabase.");
      } else {
        setTracks(data);
      }
      setIsLoading(false);
    }

    loadOrders();

    // REALTIME: kalau ada order baru masuk, atau ada admin lain (atau sesi ini
    // sendiri) yang update status, list di sini otomatis ikut berubah.
    const unsubscribe = subscribeToAllOrders({
      onInsert: (order) => setTracks((prev) => [order, ...prev.filter((t) => t.id !== order.id)]),
      onUpdate: (order) => setTracks((prev) => prev.map((t) => (t.id === order.id ? order : t))),
      onDelete: (id) => setTracks((prev) => prev.filter((t) => t.id !== id)),
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const steps = STEP_THEME;

  const handleNextStep = async (id) => {
    const track = tracks.find((t) => t.id === id);
    if (!track || track.currentStep >= 3) return;

    const nextStep = track.currentStep + 1;

    // Optimistic update biar terasa instan buat admin yang klik...
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, currentStep: nextStep } : t)));

    // ...lalu ditulis ke Supabase, yang otomatis broadcast realtime ke
    // halaman /track/:orderId milik pelanggan dan ke admin lain.
    const { error } = await advanceOrderStep(id, nextStep);
    if (error) {
      // rollback kalau gagal simpan
      setTracks((prev) => prev.map((t) => (t.id === id ? track : t)));
      alert("Gagal update status ke server, coba lagi.");
    }
  };

  // Fungsi Pemicu Cetak Nota Otomatis
  const handlePrint = (order) => {
    setActivePrintOrder(order);
    setTimeout(() => {
      window.print();
    }, 150); 
  };

  const filteredTracks = useMemo(() => {
    return tracks.filter(t => 
      (!showUnpaidOnly || !t.isPaid) &&
      (t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, tracks, showUnpaidOnly]);

  const getTheme = (step) => {
    switch(step) {
      case 1: return { bg: "bg-blue-50/60", border: "border-blue-200", accent: "bg-blue-600", icon: "text-blue-600" };
      case 2: return { bg: "bg-amber-50/60", border: "border-amber-200", accent: "bg-amber-600", icon: "text-amber-600" };
      case 3: return { bg: "bg-green-50/60", border: "border-green-200", accent: "bg-green-600", icon: "text-green-600" };
      default: return { bg: "bg-slate-50/60", border: "border-slate-200", accent: "bg-slate-600", icon: "text-slate-600" };
    }
  };

  return (
    <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen text-slate-900 font-sans relative">
      
      {/* STYLE CSS KHUSUS PRINT (MENYEMBUNYIKAN HALAMAN UTAMA SAAT CETAK STRUK) */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-invoice-area, #print-invoice-area * {
            visibility: visible;
          }
          #print-invoice-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* DASHBOARD UTAMA AREA */}
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter italic text-slate-800">LIVE TRACKING</h1>
            <p className="text-slate-500 font-medium text-base">
              Memantau <span className="font-bold text-blue-600">{tracks.length} Pesanan Aktif</span> di workshop laundry.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Tooltip content="Cari pesanan berdasarkan ID atau nama pelanggan">
                <div className="relative w-full md:w-80">
                  <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama atau nomor nota..."
                    className="pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 shadow-sm outline-none w-full transition-all bg-white text-base"
                  />
                </div>
              </Tooltip>
              <Switch
                checked={showUnpaidOnly}
                onCheckedChange={setShowUnpaidOnly}
                label="Tampilkan belum bayar"
              />
            </div>
            <Separator className="mt-5" />
          </div>
        </div>

        {/* LIST TRACKING */}
        <div className="space-y-6">
          {loadError && (
            <div className="text-center py-6 bg-rose-50 rounded-3xl border border-rose-100">
              <p className="text-rose-600 font-bold text-base">{loadError}</p>
            </div>
          )}
          {isLoading ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400 font-medium">Memuat data order...</p>
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400 font-medium">Nota atau nama pelanggan tidak ditemukan.</p>
            </div>
          ) : (
            filteredTracks.map((t) => {
              const theme = getTheme(t.currentStep);
              return (
                <div key={t.id} className={`rounded-3xl border-2 ${theme.border} ${theme.bg} p-6 md:p-8 shadow-sm transition-all hover:shadow-md`}>
                  
                  {/* TOP SECTION: INFO UTAMA */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-3xl ${theme.icon}`}>
                        {t.currentStep === 0 && <MdLayers />}
                        {t.currentStep === 1 && <MdLocalLaundryService className="animate-spin" style={{ animationDuration: '4s' }} />}
                        {t.currentStep === 2 && <MdIron />}
                        {t.currentStep === 3 && <HiCheckCircle />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                            {t.id}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                            {t.weight} • {t.service}
                          </span>
                          <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${t.isPaid ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                            {t.isPaid ? 'Lunas' : 'Belum Bayar'}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black mt-1.5 text-slate-800 uppercase tracking-tight">{t.user}</h3>
                      </div>
                    </div>
                    
                    <div className="md:text-right bg-white/80 md:bg-transparent p-3 md:p-0 rounded-xl w-full md:w-auto border md:border-none border-slate-200/60">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update Terakhir</p>
                      <p className={`text-xl font-black ${theme.icon}`}>{t.status}</p>
                    </div>
                  </div>

                  {/* MIDDLE SECTION: PROGRESS STEPPER */}
                  <div className="grid grid-cols-4 gap-3 relative mb-8">
                    {steps.map((step, idx) => {
                      const isDone = t.currentStep >= idx;
                      const isCurrent = t.currentStep === idx;
                      return (
                        <div key={idx} className="space-y-3">
                          <div className={`h-3 rounded-full transition-all duration-500 ${
                            isDone ? steps[idx].color : "bg-white border border-slate-200"
                          } ${isCurrent ? "ring-4 ring-white shadow-sm animate-pulse" : ""}`} />
                          
                          <p className={`text-[11px] font-black uppercase text-center ${
                            isDone ? steps[idx].text : "text-slate-300"
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* BOTTOM SECTION: CATATAN & ACTIONS */}
                  <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between border-t border-slate-200/60 pt-5 mt-4">
                    
                    <div className="bg-white/90 p-3 px-4 rounded-xl border border-slate-200/80 flex justify-between items-center flex-1 max-w-2xl">
                      <p className="text-sm font-semibold italic text-slate-600">"{t.detail}"</p>
                      <div className="flex items-center gap-1.5 text-slate-400 ml-4 shrink-0">
                        <HiClock className="text-base" />
                        <span className="text-[10px] font-bold uppercase tracking-tight bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          {t.eta === "Selesai" ? "Siap" : `Est. ${t.eta}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 justify-end">
                      {/* BUTTON CETAK SEKARANG */}
                      <button 
                        onClick={() => handlePrint(t)}
                        title="Cetak Nota"
                        className="p-2.5 rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 active:scale-95 transition-all text-base cursor-pointer"
                      >
                        <HiPrinter size={18} />
                      </button>
                      
                      <button 
                        onClick={() => window.open(`https://wa.me/?text=Halo%20${t.user},%20laundry%20kamu%20dengan%20nomor%20nota%20${t.id}%20saat%20ini%20berada%20di%20status:%20*${t.status}*.`)}
                        className="flex items-center gap-1.5 p-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm active:scale-95 transition-all"
                      >
                        <FaWhatsapp size={16} />
                        <span className="hidden sm:inline">Hubungi</span>
                      </button>
                      
                      {t.currentStep < 3 && (
                        <button 
                          onClick={() => handleNextStep(t.id)}
                          className={`flex items-center gap-1.5 p-2.5 px-4 rounded-xl ${theme.accent} hover:opacity-90 text-white font-black text-sm active:scale-95 transition-all shadow-xs`}
                        >
                          <span>Lanjut Tahap</span>
                          <MdArrowForward size={14} />
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

      {/* COMPONENT STRUK THERMAL KASIR (Hanya Muncul Pas Proses Cetak Aktif) */}
      {activePrintOrder && (
        <div id="print-invoice-area" className="hidden print:block bg-white text-black p-4 font-mono text-sm max-w-[80mm] mx-auto">
          <div className="text-center space-y-1 border-b border-dashed border-black pb-3 mb-3">
            <h2 className="text-base font-bold tracking-widest">NETTO LAUNDRY</h2>
            <p className="text-[10px]">Jl. Sudirman No. 123, Pekanbaru</p>
            <p className="text-[10px]">Telp/WA: 0812-3456-7890</p>
          </div>
          
          <div className="space-y-1 border-b border-dashed border-black pb-3 mb-3">
            <div className="flex justify-between"><span>Nota ID:</span><span className="font-bold">{activePrintOrder.id}</span></div>
            <div className="flex justify-between"><span>Pelanggan:</span><span>{activePrintOrder.user}</span></div>
            <div className="flex justify-between"><span>Tanggal:</span><span>{new Date().toLocaleDateString('id-ID')}</span></div>
            <div className="flex justify-between"><span>Status:</span><span className="uppercase font-bold">{activePrintOrder.status}</span></div>
          </div>

          <div className="border-b border-dashed border-black pb-3 mb-3">
            <p className="font-bold mb-1">Rincian Layanan:</p>
            <div className="flex justify-between items-start">
              <div>
                <p>{activePrintOrder.service}</p>
                <p className="text-[10px] text-gray-600">Berat: {activePrintOrder.weight}</p>
              </div>
              <span>Rp {activePrintOrder.price?.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <div className="flex justify-between font-bold text-base">
              <span>TOTAL TOTAL:</span>
              <span>Rp {activePrintOrder.price?.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>Metode Bayar:</span>
              <span className="font-bold">{activePrintOrder.isPaid ? "TUNAI (LUNAS)" : "BELUM LUNAS"}</span>
            </div>
          </div>

          <div className="text-center border-b border-dashed border-black pb-3 mb-3">
            <p className="font-bold mb-1">Scan Untuk Live Tracking:</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(buildTrackingUrl(activePrintOrder.id))}`}
              alt="QR Live Tracking"
              className="w-20 h-20 object-contain mx-auto"
            />
          </div>

          <div className="text-center pt-2 border-t border-dashed border-black text-[9px] space-y-1">
            <p className="font-bold">Terima Kasih Atas Kepercayaan Anda</p>
            <p>Pakaian Bersih, Wangi & Higienis</p>
            <p className="italic">"{activePrintOrder.detail}"</p>
          </div>
        </div>
      )}

    </div>
  );
}