import { useParams, Link } from "react-router-dom";
import products from "../data/laundryProducts.json";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
          <p className="text-[#7F9E97] mb-6">
            Pastikan Anda memilih layanan laundry yang tersedia dari halaman produk.
          </p>
          <Link
            to="/products"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-2xl hover:bg-emerald-500 transition-all"
          >
            Kembali ke Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F6] p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl w-full">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#7F9E97]">Detail Produk Laundry</p>
              <h1 className="text-3xl font-black text-[#1A2E35]">{product.title}</h1>
            </div>
            <Link
              to="/products"
              className="text-emerald-600 hover:text-emerald-500 text-sm font-bold"
            >
              Kembali ke Produk
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-[#E0EEEA] p-6 bg-[#F8F9F8]">
              <p className="text-[#7F9E97] text-sm uppercase tracking-[0.35em] mb-4">Informasi Produk</p>
              <div className="space-y-3 text-[#1A2E35]">
                <div>
                  <span className="block text-sm text-[#7F9E97]">Kode Produk</span>
                  <p className="font-bold">{product.code}</p>
                </div>
                <div>
                  <span className="block text-sm text-[#7F9E97]">Kategori</span>
                  <p className="font-bold">{product.category}</p>
                </div>
                <div>
                  <span className="block text-sm text-[#7F9E97]">Brand</span>
                  <p className="font-bold">{product.brand}</p>
                </div>
                <div>
                  <span className="block text-sm text-[#7F9E97]">Stok Tersedia</span>
                  <p className="font-bold">{product.stock}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E0EEEA] p-6 bg-white">
              <p className="text-[#7F9E97] text-sm uppercase tracking-[0.35em] mb-4">Harga Layanan</p>
              <div className="text-4xl font-black text-[#17A589] mb-4">
                Rp {product.price.toLocaleString("id-ID")}
              </div>
              <p className="text-[#56606A] leading-relaxed">
                Layanan laundry {product.title} untuk kategori {product.category}. Pilihan terbaik untuk kebutuhan pelanggan yang ingin hasil bersih, wangi, dan tertata rapi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
