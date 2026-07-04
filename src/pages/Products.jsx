import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiSearch, HiTag, HiCube, HiCash, HiChevronRight, HiPlus, HiPencil, HiTrash, HiCheck, HiX } from "react-icons/hi";
import { createProduct, deleteProduct, loadProducts, updateProduct } from "../utils/productStorage";

const emptyForm = {
  title: "",
  code: "",
  category: "",
  brand: "",
  price: "",
  stock: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      setLoading(true);
      const data = await loadProducts();
      if (active) {
        setProducts(data || []);
        setLoading(false);
      }
    };
    fetchProducts();
    return () => { active = false; };
  }, []);

  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingProductId(null);
    setIsFormOpen(false);
  };

  const openAddForm = () => {
    setEditingProductId(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    setEditingProductId(item.id);
    setFormData({
      title: item.title,
      code: item.code,
      category: item.category,
      brand: item.brand || "",
      price: item.price,
      stock: item.stock,
    });
    setIsFormOpen(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? value : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title || !formData.code || !formData.category) {
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
    };

    setLoading(true);
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, payload);
      } else {
        await createProduct(payload);
      }
      const refreshed = await loadProducts();
      setProducts(refreshed || []);
      resetForm();
    } catch (err) {
      console.error("Gagal menyimpan produk", err);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus produk ini dari daftar?")) {
      setLoading(true);
      try {
        await deleteProduct(id);
        const refreshed = await loadProducts();
        setProducts(refreshed || []);
      } catch (err) {
        console.error("Gagal menghapus produk", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-6 font-sans text-[#0F172A]">
      <div className="max-w-6xl mx-auto space-y-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-blue-50">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-blue-600 mb-3">
              <HiTag className="text-lg" /> Inventaris Layanan
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Katalog Produk <span className="text-blue-600">& Jasa</span></h1>
            <p className="text-slate-500 text-base mt-2">
              Kelola harga, stok, dan data layanan laundry Anda langsung dari halaman ini.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="w-full md:w-[320px] relative">
              <HiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-slate-300" />
              <input
                type="text"
                placeholder="Cari layanan, kode, atau kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-base font-medium outline-none transition-all focus:border-blue-100 focus:bg-white focus:ring-4 focus:ring-blue-50/50"
              />
            </div>
            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-base font-black uppercase tracking-wider text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
            >
              <HiPlus className="text-lg" /> Tambah Produk
            </button>
          </div>
        </div>

        {isFormOpen && (
          <div className="bg-white rounded-[2.5rem] border border-blue-100 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Form Produk</p>
                <h2 className="text-2xl font-black text-slate-900">{editingProductId ? "Edit Produk" : "Tambah Produk Baru"}</h2>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-base font-semibold text-slate-600 transition-all hover:bg-slate-50"
              >
                <HiX size={16} /> Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2 text-sm font-semibold text-slate-600">
                <span>Nama Produk</span>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-slate-600">
                <span>Kode Produk</span>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-slate-600">
                <span>Kategori</span>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-slate-600">
                <span>Brand</span>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-slate-600">
                <span>Harga</span>
                <input
                  type="number"
                  name="price"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-slate-600">
                <span>Stok</span>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </label>

              <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-base font-black uppercase tracking-wider text-white transition-all hover:bg-blue-700"
                >
                  <HiCheck size={16} /> Simpan Produk
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-base font-black uppercase tracking-wider text-slate-600 transition-all hover:bg-slate-50"
                >
                  <HiX size={16} /> Batal
                </button>
              </div>
            </form>
          </div>
        )}

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
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-slate-400 mt-4 font-bold text-base">Memuat data layanan...</p>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                      <HiTag className="mx-auto text-5xl text-slate-200 mb-3" />
                      <h3 className="text-xl font-black text-slate-800">Tidak ada produk ditemukan</h3>
                      <p className="text-slate-400">Coba ubah kata kunci pencarian atau tambah produk baru.</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-all group">
                      <td className="px-8 py-5">
                        <Link to={`/products/${item.id}`} className="flex flex-col">
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
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1 text-slate-900 font-black text-base">
                          <span className="text-blue-600 text-[10px] font-bold">Rp</span>
                          {item.price.toLocaleString("id-ID")}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center md:text-left">
                        <span className={`text-base font-bold ${item.stock < 10 ? "text-red-500" : "text-slate-700"}`}>
                          {item.stock} <span className="text-[10px] text-slate-400 font-medium">tersedia</span>
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(item)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 text-amber-600 transition-all hover:bg-amber-600 hover:text-white shadow-sm"
                          >
                            <HiPencil className="text-xl" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 text-rose-600 transition-all hover:bg-rose-600 hover:text-white shadow-sm"
                          >
                            <HiTrash className="text-xl" />
                          </button>
                          <Link
                            to={`/products/${item.id}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 text-blue-600 transition-all hover:bg-blue-600 hover:text-white shadow-sm"
                          >
                            <HiChevronRight className="text-xl" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-blue-600 p-6 rounded-3xl text-white overflow-hidden relative">
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <HiCash className="text-3xl" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-100 uppercase tracking-widest">Update Terakhir</p>
              <p className="text-base font-medium">Semua data layanan sudah terpusat dan tersinkronisasi di server (Supabase).</p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}