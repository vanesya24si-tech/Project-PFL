import { useParams, Link } from "react-router-dom";
import { HiArrowLeft, HiOutlineCube, HiOutlineTag, HiOutlineBookmark, HiOutlineCollection } from "react-icons/hi";
import products from "../data/laundryProducts.json";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center font-sans antialiased">
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4 border border-slate-200/40 text-slate-400">
            <HiOutlineCube size={24} />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-1">Produk tidak ditemukan</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Pastikan Anda memilih layanan atau produk laundry yang valid dari daftar inventaris utama.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-colors w-full"
          >
            Kembali ke Daftar Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 flex items-center justify-center font-sans antialiased text-slate-900">
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6 md:p-8 max-w-3xl w-full space-y-6">
        
        {/* TOP BAR / NAVIGATION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Master Data / Detail Produk</p>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">{product.title}</h1>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <HiArrowLeft size={16} /> Kembali
          </Link>
        </div>

        {/* DETAILS GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* TECHNICAL SPECIFICATIONS CARDS */}
          <div className="md:col-span-3 rounded-xl border border-slate-200/60 bg-slate-50/50 p-5 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/60 pb-2">
              Spesifikasi & Atribut
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <HiOutlineTag size={12} /> Kode Produk
                </span>
                <p className="text-xs font-bold text-slate-800">{product.code}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <HiOutlineCollection size={12} /> Kategori
                </span>
                <p className="text-xs font-bold text-slate-800">{product.category}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <HiOutlineBookmark size={12} /> Brand / Manufaktur
                </span>
                <p className="text-xs font-bold text-slate-800">{product.brand}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <HiOutlineCube size={12} /> Stok Inventaris
                </span>
                <p className={`text-xs font-bold ${product.stock < 5 ? "text-amber-600" : "text-slate-800"}`}>
                  {product.stock} Unit
                </p>
              </div>
            </div>
          </div>

          {/* PRICING & VALUE PROP CARD */}
          <div className="md:col-span-2 rounded-xl border border-slate-200/60 p-5 flex flex-col justify-between bg-white shadow-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Tarif Retail / Harga Layanan
              </p>
              <div className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                Rp {product.price.toLocaleString("id-ID")}
              </div>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed mt-4 pt-4 border-t border-slate-100">
              Layanan profesional <span className="font-semibold text-slate-800">{product.title}</span> diformulasikan khusus untuk pemrosesan segmen {product.category}. Menjamin hasil akhir yang higienis, rapi, dan siap didistribusikan ke pelanggan.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}