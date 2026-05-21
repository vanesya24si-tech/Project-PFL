import { HiPlus, HiArrowRight, HiMail, HiCheckCircle, HiDocumentReport, HiClock } from "react-icons/hi";

export default function Notifications() {
  const stats = [
    { label: "Template Aktif", value: 3, icon: <HiMail className="text-xl" />, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Terkirim Hari Ini", value: 4, icon: <HiCheckCircle className="text-xl" />, color: "text-teal-600 bg-teal-50 border-teal-100" },
    { label: "Gagal Terkirim", value: 1, icon: <HiDocumentReport className="text-xl" />, color: "text-rose-600 bg-rose-50 border-rose-100" },
    { label: "Total Riwayat", value: 5, icon: <HiClock className="text-xl" />, color: "text-amber-600 bg-amber-50 border-amber-100" },
  ];

  const templates = [
    {
      title: "Cucian Selesai",
      tag: "Otomatis",
      description: "Dikirim otomatis saat status laundry berubah menjadi selesai.",
      meta: "Status Selesai",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      title: "Pengingat Pengambilan",
      tag: "Manual",
      description: "Kirim pengingat agar pelanggan segera mengambil cucian yang sudah selesai.",
      meta: "Pengingat",
      tagColor: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
      title: "Promo Membership",
      tag: "Otomatis",
      description: "Notifikasi promo khusus member loyal dengan voucher diskon menarik.",
      meta: "Promo Loyalitas",
      tagColor: "bg-purple-50 text-purple-700 border-purple-200"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8 font-sans text-slate-800 antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Dashboard</span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Template Notifikasi</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola pesan otomatis dan pantau performa pengiriman ke pelanggan.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.98] transition-all">
            <HiPlus className="text-lg" /> Buat Template Baru
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-6 border border-slate-100 shadow-sm flex items-center gap-4"> 
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Templates List Section */}
        <section className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-6 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">Daftar Template Aktif</h2>
            <p className="text-sm text-slate-500 mt-0.5">Pilih atau sesuaikan template di bawah ini untuk berinteraksi dengan pelanggan.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {templates.map((template) => (
              <div 
                key={template.title} 
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors group cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {template.title}
                    </h3>
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${template.tagColor}`}>
                      {template.tag}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">{template.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <span>Pemicu:</span>
                    <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{template.meta}</span>
                  </div>
                </div>
                
                <div className="flex justify-end sm:block">
                  <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                    <HiArrowRight className="text-lg group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}