import { useState } from "react";
import { Link } from "react-router-dom";
import products from "../data/laundryProducts.json";

export default function Products() {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F7F6] p-6 font-sans text-[#1A2E35]">
      <div className="max-w-6xl mx-auto space-y-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-[#E0EEEA]">
          <div>
            <h1 className="text-2xl font-black">Daftar Produk Laundry</h1>
            <p className="text-[#7F9E97] text-sm mt-1">
              Pilih layanan laundry dan klik nama produk untuk lihat detail.
            </p>
          </div>
          <div className="w-full md:w-[420px]">
            <input
              type="text"
              placeholder="Cari nama layanan, kode, atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#D5DBDB] focus:outline-none focus:ring-4 focus:ring-[#E8F8F5] focus:border-[#17A589] shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-[#E0EEEA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F0F4F3]/50 border-b border-[#E0EEEA]">
                  <th className="px-6 py-5 text-xs font-bold text-[#7F9E97] uppercase tracking-wider">Produk</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#7F9E97] uppercase tracking-wider">Kode</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#7F9E97] uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#7F9E97] uppercase tracking-wider">Harga</th>
                  <th className="px-6 py-5 text-xs font-bold text-[#7F9E97] uppercase tracking-wider">Stok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F3]">
                {filteredProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-[#E8F8F5]/40 transition-colors">
                    <td className="px-6 py-5">
                      <Link
                        to={`/products/${item.id}`}
                        className="text-emerald-600 hover:text-emerald-500 font-bold"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-[#7F9E97]">{item.code}</td>
                    <td className="px-6 py-5">{item.category}</td>
                    <td className="px-6 py-5">Rp {item.price.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-5">{item.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-white">
              <p className="text-[#1A2E35] font-bold">Tidak ada produk yang ditemukan.</p>
              <p className="text-[#7F9E97] mt-2">Coba kata kunci lain.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
