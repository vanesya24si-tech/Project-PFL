import { useState } from "react";
import { Link } from "react-router-dom";
import { HiSearch, HiTag, HiCube, HiCash, HiChevronRight } from "react-icons/hi";
import products from "../data/laundryProducts.json";

export default function Products() {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-6 font-sans text-[#0F172A]">
      <div className="max-w-6xl mx-auto space-y-7">
        
        {/* HEADER & SEARCH SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-blue-50">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
              <HiTag className="text-base" /> Inventaris Layanan
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Katalog Produk <span className="text-blue-600">& Jasa</span></h1>
            <p className="text-slate-500 text-sm mt-2">
              Kelola harga dan stok layanan laundry Anda dalam satu tabel terpusat.
            </p>
          </div>
          <div className="w-full md:w-[400px] relative">
            <HiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-slate-300" />
            <input
              type="text"
              placeholder="Cari layanan, kode, atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-medium outline-none transition-all focus:border-blue-100 focus:bg-white focus:ring-4 focus:ring-blue-50/50"
            />
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em]">Layanan / Produk</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em]">Kode</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em]">Kategori</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em]">Harga Satuan</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em]">Stok/Unit</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-8 py-5">
                      <Link
                        to={`/products/${item.id}`}
                        className="flex flex-col"
                      >
                        <span className="text-slate-900 font-bold group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Lihat detail layanan</span>
                      </Link>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-1 bg-slate-100 rounded-md text-[11px] font-mono font-bold text-slate-500 uppercase">
                        {item.code}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1 text-slate-900 font-black text-sm">
                        <span className="text-blue-600 text-[10px] font-bold">Rp</span>
                        {item.price.toLocaleString("id-ID")}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center md:text-left">
                      <span className={`text-sm font-bold ${item.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                        {item.stock} <span className="text-[10px] text-slate-400 font-medium">tersedia</span>
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <Link 
                        to={`/products/${item.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 text-blue-600 transition-all hover:bg-blue-600 hover:text-white shadow-sm"
                       >
                        <HiChevronRight className="text-lg" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 bg-white">
              <div className="bg-blue-50 p-6 rounded-full mb-4">
                <HiCube className="text-5xl text-blue-200" />
              </div>
              <p className="text-slate-900 font-black text-lg">Produk Tidak Ditemukan</p>
              <p className="text-slate-400 text-sm mt-1 text-center max-w-[250px]">
                Maaf, kami tidak menemukan layanan dengan kata kunci "{search}".
              </p>
              <button 
                onClick={() => setSearch("")}
                className="mt-6 text-blue-600 font-bold text-sm hover:underline"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>

        {/* FOOTER INFO */}
        <div className="flex items-center gap-4 bg-blue-600 p-6 rounded-3xl text-white overflow-hidden relative">
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <HiCash className="text-2xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-100 uppercase tracking-widest">Update Terakhir</p>
              <p className="text-sm font-medium">Semua harga sudah termasuk pajak 11% sesuai regulasi terbaru.</p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}