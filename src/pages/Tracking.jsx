import React, { useState, useMemo } from "react";
import { HiLocationMarker, HiClock, HiCheckCircle, HiChevronRight, HiSearch } from "react-icons/hi";
import { MdLocalLaundryService, MdIron, MdLayers } from "react-icons/md";

export default function Tracking() {
  const [searchQuery, setSearchQuery] = useState("");

  const tracks = [
    { 
      id: "ORD-001", 
      user: "Andi Saputra", 
      status: "Pencucian", 
      detail: "Baju sedang diproses di dalam mesin cuci nomor 04",
      currentStep: 1, // 0: Antre, 1: Cuci, 2: Setrika, 3: Ready
      eta: "14:30",
      icon: <MdLocalLaundryService />
    },
    { 
      id: "ORD-003", 
      user: "Budi Santoso", 
      status: "Finishing", 
      detail: "Proses setrika uap bertekanan tinggi dan pelipatan",
      currentStep: 2,
      eta: "17:00",
      icon: <MdIron />
    },
    { 
      id: "ORD-005", 
      user: "Rina Maria", 
      status: "Siap Diambil", 
      detail: "Cucian sudah dikemas rapi di loker penyimpanan A-12",
      currentStep: 3,
      eta: "Selesai",
      icon: <HiCheckCircle />
    },
  ];

  const steps = ["Antre", "Cuci", "Setrika", "Ready"];

  const filteredTracks = useMemo(() => {
    return tracks.filter(t => 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-900 antialiased">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
              <HiLocationMarker className="text-emerald-600" size={26} /> Alur Kerja & Live Tracking
            </h1>
            <p className="text-sm text-slate-500 mt-1">Pantau posisi pengerjaan pakaian pelanggan di area workshop secara real-time.</p>
          </div>
          
          {/* Search Input Bar */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 w-full sm:w-64 shadow-sm">
            <HiSearch size={18} className="text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID Nota / Nama..."
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Stats Grid Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Dalam Antrean", val: 5, color: "bg-slate-400" },
            { label: "Sedang Dicuci", val: 3, color: "bg-blue-500" },
            { label: "Tahap Finishing", val: 4, color: "bg-amber-500" },
            { label: "Siap Diambil", val: 12, color: "bg-emerald-500" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-xl font-bold text-slate-900 tracking-tight">{item.val} Order</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tracking Workspace Cards */}
        <div className="space-y-4">
          {filteredTracks.map((t) => (
            <div key={t.id} className="group bg-white rounded-xl border border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow-md transition-all p-5 md:p-6 relative">
              
              {/* Card Meta Top Layout */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl shrink-0 ${
                    t.currentStep === 3 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {t.currentStep === 1 && <MdLocalLaundryService />}
                    {t.currentStep === 2 && <MdIron />}
                    {t.currentStep === 3 && <HiCheckCircle />}
                    {t.currentStep === 0 && <MdLayers />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded tracking-wide">
                        {t.id}
                      </span>
                      <span className="text-slate-400 text-xs flex items-center gap-1 font-medium">
                        <HiClock size={14} /> Est. Selesai: {t.eta}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{t.user}</h3>
                  </div>
                </div>

                <div>
                  <span className={`inline-flex text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${
                    t.currentStep === 3 ? "bg-emerald-50 text-emerald-700 border-emerald-200/40" : "bg-slate-50 text-slate-600 border-slate-200/60"
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>

              {/* Status Stepper Progression */}
              <div className="space-y-4">
                <p className="text-xs text-slate-500 italic bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg">
                  Keterangan: {t.detail}
                </p>
                
                {/* Visual Segmented Stepper */}
                <div className="grid grid-cols-4 gap-2 relative pt-2">
                  {steps.map((step, idx) => {
                    const isCompleted = t.currentStep >= idx;
                    const isCurrent = t.currentStep === idx;
                    
                    return (
                      <div key={step} className="space-y-2">
                        {/* Segment Line Bar */}
                        <div className={`h-1.5 rounded-full transition-colors duration-500 ${
                          isCurrent ? "bg-amber-500" : isCompleted ? "bg-emerald-600" : "bg-slate-100"
                        }`} />
                        
                        {/* Text Label */}
                        <div className="flex items-center justify-between px-0.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wide ${
                            isCurrent ? "text-amber-600" : isCompleted ? "text-slate-800" : "text-slate-400"
                          }`}>
                            {step}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button Trigger */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                <button className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                  Detail Ringkasan Order <HiChevronRight size={16} />
                </button>
              </div>

            </div>
          ))}

          {filteredTracks.length === 0 && (
            <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-xl">
              <p className="text-xs text-slate-400 font-medium">Tidak ada antrean pengerjaan aktif yang cocok dengan kriteria pencarian.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}