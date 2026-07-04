import React, { useState } from "react";
import { HiPlus, HiArrowRight, HiMail, HiCheckCircle, HiDocumentReport, HiClock, HiSparkles, HiX, HiPaperAirplane } from "react-icons/hi";
import { IoLogoWhatsapp } from "react-icons/io";

export default function Notifications() {
  const [activePreview, setActivePreview] = useState(null);
  const [templates, setTemplates] = useState([
    {
      id: "TMP-01",
      title: "Cucian Selesai",
      tag: "Otomatis",
      description: "Dikirim otomatis saat status laundry diubah menjadi 'Selesai' di sistem.",
      meta: "Status Selesai",
      tagColor: "bg-blue-50 text-blue-700 border-blue-200",
      isActive: true,
      messageBody: "Halo *{nama}*, cucian Anda dengan nomor nota *{nota}* sudah selesai dan siap diambil di Netto Laundry. Terima kasih!"
    },
    {
      id: "TMP-02",
      title: "Pengingat Pengambilan",
      tag: "Manual",
      description: "Kirim pesan pengingat ke pelanggan untuk cucian yang sudah mengendap lebih dari 2 hari.",
      meta: "Follow-up",
      tagColor: "bg-amber-50 text-amber-700 border-amber-200",
      isActive: true,
      messageBody: "Halo *{nama}*, jangan lupa untuk mengambil cucian Anda (*{nota}*) yang sudah siap sejak 2 hari lalu ya. Loker: {loker}."
    },
    {
      id: "TMP-03",
      title: "Promo Loyalty Member",
      tag: "Otomatis",
      description: "Notifikasi otomatis berisi kode voucher diskon saat pelanggan mencapai status 'Loyal'.",
      meta: "Tier Up",
      tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      isActive: false,
      messageBody: "Selamat *{nama}*! Anda telah naik ke tingkat member *Loyal*. Gunakan kode voucher *NETTOHEBAT* untuk diskon 15% pada cucian berikutnya!"
    },
  ]);

  const stats = [
    { label: "Template Aktif", value: templates.filter(t => t.isActive).length, icon: <HiMail className="text-xl" />, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { label: "Terkirim Hari Ini", value: 42, icon: <HiCheckCircle className="text-xl" />, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Gagal Terkirim", value: 1, icon: <HiDocumentReport className="text-xl" />, color: "text-rose-600 bg-rose-50 border-rose-100" },
    { label: "Total Riwayat", value: 128, icon: <HiClock className="text-xl" />, color: "text-slate-600 bg-slate-50 border-slate-100" },
  ];

  // Handler untuk mengubah status aktif/nonaktif template
  const toggleTemplateActive = (id, e) => {
    e.stopPropagation(); // Mencegah modal preview ikut terbuka saat menekan toggle
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans text-slate-800 antialiased">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">
              <HiSparkles /> Komunikasi Pelanggan
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">Template <span className="text-blue-600">Notifikasi</span></h1>
            <p className="mt-2 text-sm text-slate-500 max-w-md">Kelola pesan otomatis WhatsApp untuk menjaga hubungan dan loyalitas pelanggan Netto Laundry.</p>
          </div>
          <button onClick={() => alert("Fitur membuat template baru")} className="relative z-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-[0.95] transition-all">
            <HiPlus className="text-lg" /> Buat Template
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="group rounded-3xl bg-white p-6 border border-slate-100 shadow-xs flex items-center gap-4 transition-all hover:shadow-md"> 
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-transform group-hover:scale-105 ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Section */}
        <section className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 p-8 flex items-center justify-between bg-linear-to-r from-white to-slate-50/50">
            <div>
              <h2 className="text-xl font-black text-slate-900">Daftar Template Pesan</h2>
              <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Klik kartu untuk pratinjau isi pesan</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              {templates.length} Total Berkas
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {templates.map((template) => (
              <div 
                key={template.id} 
                onClick={() => setActivePreview(template)}
                className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/80 transition-all group cursor-pointer"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {template.title}
                    </h3>
                    <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${template.tagColor}`}>
                      {template.tag}
                    </span>
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-[10px] font-bold ${template.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {template.isActive ? '● Aktif' : '○ Nonaktif'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 max-w-2xl leading-relaxed font-medium">{template.description}</p>
                  
                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pemicu:</span>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{template.meta}</span>
                    </div>
                  </div>
                </div>
                
                {/* Bagian Kontrol Kanan (Toggle Switch & Arrow) */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0 border-slate-100">
                  {/* Switch Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={template.isActive} 
                      onChange={(e) => toggleTemplateActive(template.id, e)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>

                  <button className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-2xs group-hover:border-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                    <HiArrowRight className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE MODAL: WHATSAPP LIVE PREVIEW SIMULATION */}
        {activePreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-all animate-fadeIn">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden flex flex-col">
              
              {/* Modal Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-lg">Pratinjau Template</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{activePreview.title}</p>
                </div>
                <button 
                  onClick={() => setActivePreview(null)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
                >
                  <HiX className="text-lg" />
                </button>
              </div>

              {/* Modal Body: WhatsApp Wireframe */}
              <div className="p-6 bg-[#E5DDD5] flex-1 min-h-[250px] relative pattern-isometric">
                {/* WhatsApp Chat Bubble */}
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-xs max-w-[85%] relative border border-slate-200/50">
                  {/* Message Title (Sender Name) */}
                  <p className="text-[11px] font-black text-emerald-600 mb-1 flex items-center gap-1">
                    <IoLogoWhatsapp /> NETTO LAUNDRY OFFICIAL
                  </p>
                  {/* Dynamic Custom Text Body */}
                  <p className="text-xs font-medium text-slate-800 whitespace-pre-line leading-relaxed">
                    {activePreview.messageBody
                      .replace("{nama}", "Randi Wijaya")
                      .replace("{nota}", "ORD-088")
                      .replace("{loker}", "B-04")
                    }
                  </p>
                  {/* Timestamp Fake */}
                  <p className="text-[9px] text-right text-slate-400 mt-1 font-bold">20:00 ✓✓</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => alert('Fungsi ubah isi teks template')}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Ubah Teks
                </button>
                <button 
                  onClick={() => alert('Simulasi tes kirim sukses')}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 font-black text-xs text-white hover:bg-emerald-700 shadow-md shadow-emerald-100 flex items-center justify-center gap-1.5 transition-all"
                >
                  <HiPaperAirplane className="rotate-90 text-sm" /> Test Kirim WA
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}