import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";

export default function ErrorPage({
  code = "404",
  description = "Waduh! Halaman yang kamu cari sepertinya sedang 'dicuci' atau tidak dapat ditemukan.",
  image,
}) {
  const getTitle = () => {
    switch (String(code)) {
      case "404": return "Halaman Hilang";
      case "400": return "Permintaan Salah";
      case "401": return "Akses Ditolak";
      case "403": return "Terlarang";
      case "500": return "Gangguan Sistem";
      default: return "Terjadi Kesalahan";
    }
  };

  return (
    <div className="flex relative items-center justify-center min-h-[80vh] px-6 overflow-hidden bg-slate-50">

      {/* Background Soft Glow - Rose Theme */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-rose-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative text-center max-w-md z-10 flex flex-col items-center">

        {/* ERROR VISUAL (CODE) */}
        {image ? (
          <img
            src={image}
            alt={`error-${code}`}
            className="w-48 sm:w-56 object-contain mb-8 drop-shadow-2xl"
          />
        ) : (
          <div className="relative mb-6">
            {/* Background Big Number */}
            <h1 className="text-[7rem] sm:text-[10rem] font-black text-rose-600/5 leading-none select-none">
              {code}
            </h1>
            {/* Foreground Number */}
            <div className="absolute inset-0 flex items-center justify-center text-5xl sm:text-7xl font-black text-rose-600 drop-shadow-sm">
              {code}
            </div>
            {/* Laundry Icon Accent */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl animate-bounce">
              🧺
            </div>
          </div>
        )}

        {/* TITLE */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">
          {getTitle()}
        </h2>

        {/* DESCRIPTION */}
        <p className="text-slate-500 mt-4 text-sm sm:text-base leading-relaxed font-medium">
          {description}
        </p>

        {/* BUTTON ACTION */}
        <Link
          to="/"
          className="group inline-flex items-center gap-3 mt-10 bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl shadow-xl shadow-rose-200 transition-all active:scale-95 font-bold"
        >
          <HiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
          Kembali ke Dashboard
        </Link>

        {/* FOOTER DECORATION */}
        <p className="mt-12 text-slate-300 text-[10px] uppercase tracking-widest font-bold">
          Netto Laundry System
        </p>

      </div>
    </div>
  );
}