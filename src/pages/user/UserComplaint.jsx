import React, { useState, useRef } from "react";
import { useAuth } from "../../utils/AuthContext";
import {
  HiExclamationCircle,
  HiPhotograph,
  HiX,
  HiCheckCircle,
  HiPaperAirplane,
  HiClipboardList,
  HiChevronDown,
} from "react-icons/hi";
import { MdLocalLaundryService } from "react-icons/md";
import toast from "react-hot-toast";

const COMPLAINT_TYPES = [
  "Pakaian Rusak / Sobek",
  "Pakaian Hilang",
  "Warna Pudar / Luntur",
  "Pakaian Tertukar",
  "Hasil Cucian Kurang Bersih",
  "Hasil Setrika Tidak Rapi",
  "Pelayanan Kurang Memuaskan",
  "Keterlambatan Penyelesaian",
  "Lainnya",
];

const MAX_PHOTOS = 4;

export default function UserComplaint() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [type, setType] = useState("");
  const [orderId, setOrderId] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]); // { url: string, file: File }[]
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "Pelanggan";
  const phone = user?.user_metadata?.phone || "";

  /* ─── Photo picker ─── */
  const handlePickPhoto = () => fileInputRef.current?.click();

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remaining = MAX_PHOTOS - photos.length;
    const picked = files.slice(0, remaining);

    const newPhotos = picked.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = "";
  };

  const removePhoto = (idx) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  /* ─── Submit ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type) return toast.error("Pilih jenis komplain terlebih dahulu.");
    if (!description.trim()) return toast.error("Deskripsi komplain tidak boleh kosong.");

    setSubmitting(true);
    try {
      // Build complaint payload — store in localStorage for demo
      // In production, upload photos to Supabase Storage and save record
      const complaint = {
        id: `KMP-${Date.now()}`,
        name,
        phone,
        type,
        orderId: orderId.trim() || "-",
        description: description.trim(),
        photoCount: photos.length,
        status: "Menunggu Ditinjau",
        createdAt: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem("netto_complaints") || "[]");
      localStorage.setItem("netto_complaints", JSON.stringify([complaint, ...existing]));

      await new Promise((r) => setTimeout(r, 1200)); // simulate network
      setSuccess(true);
      toast.success("Komplain berhasil dikirim! Tim kami akan segera meninjau.");
    } catch (err) {
      toast.error("Gagal mengirim komplain. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Success Screen ─── */
  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-5 px-4 py-10">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center shadow-lg shadow-emerald-100 animate-bounce">
          <HiCheckCircle size={32} className="text-emerald-500" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-800">Komplain Terkirim!</h2>
          <p className="text-[12px] text-slate-500 font-medium leading-relaxed max-w-[260px]">
            Tim Netto Laundry akan meninjau komplain Anda dalam 1×24 jam. Terima kasih atas kepercayaan Anda.
          </p>
        </div>
        <div className="bg-white/80 rounded-2xl border border-slate-200 shadow-sm p-4 w-full max-w-xs text-left space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ringkasan Komplain</p>
          <p className="text-sm font-black text-slate-700">{type}</p>
          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
            ⏳ Menunggu Ditinjau
          </span>
        </div>
        <button
          onClick={() => {
            setSuccess(false);
            setType("");
            setOrderId("");
            setDescription("");
            setPhotos([]);
          }}
          className="text-blue-600 font-black text-sm underline underline-offset-4"
        >
          Kirim Komplain Baru
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-4">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-4 text-white relative overflow-hidden shadow-sm">
        <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-white/10 rounded-full blur-xl" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
            <HiExclamationCircle size={26} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-red-100">Layanan Pengaduan</p>
            <h2 className="text-lg font-black leading-tight">Kirim Komplain</h2>
            <p className="text-[11px] text-red-100 font-medium mt-0.5">Kami siap membantu menyelesaikan masalah Anda</p>
          </div>
        </div>
      </div>

      {/* Jenis Komplain */}
      <div className="bg-white/80 rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jenis Komplain <span className="text-red-500">*</span></p>
        <div className="relative">
          <button
            type="button"
            onClick={() => setTypeOpen(!typeOpen)}
            className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-left transition-all hover:border-red-300 focus:border-red-400"
          >
            <span className={`text-sm font-bold ${type ? "text-slate-800" : "text-slate-400"}`}>
              {type || "Pilih jenis komplain..."}
            </span>
            <HiChevronDown className={`text-slate-400 transition-transform ${typeOpen ? "rotate-180" : ""}`} size={18} />
          </button>
          {typeOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              {COMPLAINT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setType(t); setTypeOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-colors ${type === t ? "bg-red-50 text-red-600" : "text-slate-700"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nomor Order */}
      <div className="bg-white/80 rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nomor Order <span className="text-slate-300">(opsional)</span></p>
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-red-400 transition-colors">
          <MdLocalLaundryService className="text-slate-400 shrink-0" size={18} />
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Contoh: ORD-20240104-001"
            className="flex-1 bg-transparent text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none"
          />
        </div>
      </div>

      {/* Deskripsi */}
      <div className="bg-white/80 rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deskripsi Masalah <span className="text-red-500">*</span></p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Ceritakan secara detail masalah yang Anda alami. Semakin detail, semakin cepat kami menyelesaikannya..."
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-300 outline-none focus:border-red-400 transition-colors resize-none leading-relaxed"
        />
        <p className="text-[10px] text-slate-400 font-medium text-right">{description.length} karakter</p>
      </div>

      {/* Upload Foto */}
      <div className="bg-white/80 rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Foto Bukti</p>
          <span className="text-[10px] font-bold text-slate-400">{photos.length}/{MAX_PHOTOS} foto</span>
        </div>

        {/* Preview Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((p, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden aspect-square border border-slate-200 shadow-sm group">
                <img src={p.url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <HiX size={16} className="text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={handlePickPhoto}
            className="w-full border-2 border-dashed border-slate-300 hover:border-red-400 hover:bg-red-50/50 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all"
          >
            <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center">
              <HiPhotograph size={22} className="text-slate-400" />
            </div>
            <p className="text-[12px] font-black text-slate-500">Tap untuk tambah foto</p>
            <p className="text-[10px] text-slate-400 font-medium">JPG, PNG, HEIC • Maks {MAX_PHOTOS} foto</p>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      {/* Info Pengirim */}
      <div className="bg-blue-50/80 rounded-2xl border border-blue-100 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white font-black text-base shrink-0">
          {name[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-black text-slate-800">{name}</p>
          <p className="text-[10px] text-slate-500 font-medium">{phone || user?.email || "—"}</p>
        </div>
        <span className="ml-auto text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Pengirim</span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl py-2.5 font-black text-sm uppercase tracking-widest shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Mengirim...
          </>
        ) : (
          <>
            <HiPaperAirplane size={16} />
            Kirim Komplain
          </>
        )}
      </button>
    </form>
  );
}
