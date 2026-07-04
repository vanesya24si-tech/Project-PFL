export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50/90 backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        
        {/* Efek Glow di Belakang Logo (Animasi Pulse Rose) */}
        <div className="absolute top-0 w-24 h-24 bg-rose-500/20 rounded-full blur-3xl animate-pulse"></div>

        {/* Logo Netto Laundry */}
        <div className="relative z-10 mb-8 flex flex-col items-center">
          <img
            src="/img/logo2.png" // Pastikan path logo sudah benar
            alt="Netto Laundry"
            className="w-32 h-32 object-contain drop-shadow-md animate-bounce [animation-duration:2s]"
          />
        </div>

        {/* Spinner Modern (Lapis Ganda) */}
        <div className="relative w-12 h-12 mb-6">
          {/* Ring luar (Track pudar) */}
          <div className="absolute inset-0 border-[4px] border-rose-100 rounded-full"></div>
          {/* Ring aktif (Berputar) */}
          <div className="absolute inset-0 border-[4px] border-rose-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Teks Loading Berbasis Tema Laundry */}
        <div className="text-center">
          <h2 className="text-rose-900 font-bold tracking-tight text-2xl mb-1">
            Menyiapkan Cucian Bersih...
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-base text-slate-500 font-medium animate-pulse">
              Sedang memproses data dashboard
            </span>
            {/* Animasi titik-titik */}
            <span className="flex gap-1">
              <span className="w-1 h-1 bg-rose-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
              <span className="w-1 h-1 bg-rose-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1 h-1 bg-rose-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
            </span>
          </div>
        </div> 
      </div>
    </div>
  );
}