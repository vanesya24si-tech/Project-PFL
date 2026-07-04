import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex relative items-center justify-center min-h-[80vh] px-6 overflow-hidden">
      
      {/* Efek Glow Latar Belakang */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#879b54]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative text-center max-w-md z-10 flex flex-col items-center">
        
        {/* Tipografi 404 Dual-Layer */}
        <div className="relative mb-2">
          <h1 className="text-[7rem] sm:text-[9rem] font-black text-[#879b54]/10 leading-none tracking-tighter select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl font-extrabold text-[#2c3619]">
            404
          </div>
        </div>

        {/* Judul & Deskripsi */}
        <h2 className="text-2xl font-bold text-[#2c3619] tracking-tight">
          Oops! Salah Alamat
        </h2>
        
        <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed">
          Halaman yang Anda cari mungkin telah dihapus, dipindahkan, atau memang belum tersedia di sistem kami.
        </p>

        {/* Tombol Kembali */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 mt-8 bg-[#879b54] hover:bg-[#738645] text-white font-medium px-6 py-3 rounded-xl shadow-sm shadow-[#879b54]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#879b54] transition-all duration-200 active:scale-[0.98]"
        >
          <FiHome className="text-lg" />
          Kembali ke Dashboard
        </Link>
        
      </div>
    </div>
  );
}