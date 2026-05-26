import { useParams, Link } from "react-router-dom";
import { 
  HiArrowLeft, 
  HiOutlineCube, 
  HiOutlineTag, 
  HiOutlineBookmark, 
  HiOutlineCollection, 
  HiShieldCheck,
  HiLightningBolt,
  HiInformationCircle
} from "react-icons/hi";
import products from "../data/laundryProducts.json";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-transparent p-6 flex items-center justify-center font-sans antialiased text-[#0F172A]">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 text-slate-400">
            <HiOutlineCube size={32} />
          </div>
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Produk Tidak Ditemukan</h2>
          <p className="text-xs text-slate-400 mb-8 font-medium leading-relaxed">
            Data layanan atau produk inventaris yang Anda cari mungkin telah dihapus atau dipindahkan ke kategori lain.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center text-xs font-black bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl shadow-md shadow-blue-100 transition-all active:scale-95 w-full uppercase tracking-wider"
          >
            Kembali ke Inventaris
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-transparent p-1 md:p-6 text-[#0F172A] antialiased font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* BACK BUTTON */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <HiArrowLeft size={16} /> Kembali ke Inventaris
        </Link>

        {/* MAIN DETAIL CARD */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xs p-6 md:p-8 relative overflow-hidden">
          
          {/* TOP BAR / TITLE */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-100 rounded-md text-[9px] font-black uppercase tracking-widest text-blue-600">
                <HiShieldCheck size={14} /> Terverifikasi Sistem
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800 uppercase italic">
                {product.title}
              </h1>
            </div>
            
            <div className="text-right sm:text-right shrink-0">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">KODE PRODUK</span>
              <span className="inline-block mt-1 font-black text-xs text-blue-600 bg-blue-50/50 px-3 py-1 rounded-xl border border-blue-100/60 font-mono">
                {product.code}
              </span>
            </div>
          </div>

          {/* DETAILS GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT: TECHNICAL SPECIFICATIONS */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-50 bg-slate-50/40 p-6 space-y-5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <HiInformationCircle size={16} className="text-slate-400" />
                Spesifikasi & Informasi Detail
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs font-bold">
                <div className="bg-white p-4 rounded-2xl border border-slate-100/80 shadow-2xs space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <HiOutlineCollection className="text-blue-500" /> Kategori Layanan
                  </span>
                  <p className="font-black text-slate-700 uppercase tracking-wide">{product.category}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-100/80 shadow-2xs space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <HiOutlineBookmark className="text-blue-500" /> Manufaktur / Brand
                  </span>
                  <p className="font-black text-slate-700">{product.brand || "Netto Laundry Internal"}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-100/80 shadow-2xs space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <HiOutlineCube className="text-blue-500" /> Status Manajemen Stok
                  </span>
                  <div className="flex items-center justify-between pt-0.5">
                    <p className={`font-black ${product.stock < 5 ? "text-red-600" : "text-emerald-600"}`}>
                      {product.stock} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unit Tersedia</span>
                    </p>
                    {product.stock < 5 && (
                      <span className="text-[9px] font-black px-2 py-0.5 bg-red-50 border border-red-100 text-red-600 rounded-md uppercase tracking-wide animate-pulse">
                        Stok Menipis
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: PRICING & DESCRIPTION */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-5">
              
              {/* PRICE CARD */}
              <div className="rounded-3xl bg-blue-600 p-6 text-white shadow-md shadow-blue-100 relative overflow-hidden">
                <div className="relative z-10 space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-blue-200">
                    Nilai Tarif / Harga Jual
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-blue-200">Rp</span>
                    <span className="text-3xl font-black tracking-tight font-mono">
                      {product.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] font-bold text-blue-200 ml-1">/ Satuan</span>
                  </div>
                  <div className="pt-3">
                    <div className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl backdrop-blur-xs text-[9px] font-black uppercase tracking-wider">
                      <HiLightningBolt className="text-yellow-300" /> Pengerjaan Terjamin Standar Netto
                    </div>
                  </div>
                </div>
                {/* Decorative Pattern Accent */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl" />
              </div>

              {/* SERVICE DESCRIPTION */}
              <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-3xl flex-1 flex flex-col justify-center">
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1.5">Deskripsi Operasional</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
                  "Proses penanganan aset inventaris dan pencucian profesional menggunakan deterjen ramah lingkungan. Khusus kategori <span className="font-black text-blue-600 not-italic uppercase tracking-wide">{product.category}</span>, tim wajib memastikan serat kain terjaga utuh dan proteksi warna tetap berkilau."
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}