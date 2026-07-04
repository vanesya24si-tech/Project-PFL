import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  HiUser, HiArrowLeft, HiSave, HiX, HiQrcode, HiPrinter, HiClipboardCopy, HiArrowSmRight,
  HiClock, HiCash, HiOutlineCube, HiOutlineTag, HiOutlineCollection, HiSearch, HiUserAdd
} from "react-icons/hi";

// Mengambil database customer terpusat (Sesuai mockup daftar pelanggan Anda)
import { loadCustomers, updateCustomer } from "../utils/customerStorage";
import { loadProducts } from "../utils/productStorage";
// Order tersimpan ke Supabase supaya QR/barcode tracking-nya nyambung ke data asli & realtime
import { createOrder, buildTrackingUrl } from "../utils/ordersStorage";

export default function AddOrderForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // Database pelanggan existing (dimuat secara asinkron dari Supabase)
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    let active = true;
    async function fetchCustomers() {
      try {
        const data = await loadCustomers();
        if (active) {
          setCustomers(data || []);
        }
      } catch (err) {
        console.error("Gagal memuat pelanggan di AddOrder:", err);
      }
    }
    fetchCustomers();
    return () => {
      active = false;
    };
  }, []);

  // ==========================================
  // 1. STATE MANAGEMENT CONTROL
  // ==========================================
  const [showCustomerModal, setShowCustomerModal] = useState(false); // Modal cari pelanggan
  const [searchMemberQuery, setSearchMemberQuery] = useState(""); // Input pencarian member
  const [isRegisteringMember, setIsRegisteringMember] = useState(false); // Mode daftar member baru
  const [isExistingCustomer, setIsExistingCustomer] = useState(false); // Status jika pakai data lama

  // Auto-fill member jika dikirim dari Order.jsx via navigate state
  useEffect(() => {
    const preSelected = location.state?.selectedMember;
    if (preSelected) {
      setCrmData({
        id: preSelected.id || "",
        customerName: preSelected.name || "",
        phone: preSelected.phone || "",
        email: preSelected.email || "",
        address: preSelected.address || "",
        customerType: preSelected.customerType || "Pekerja/Karyawan",
        joinDate: preSelected.joinDate || new Date().toISOString().split('T')[0],
        points: preSelected.points || 0,
        segment: preSelected.segment || "Regular",
        status: preSelected.status || "Aktif",
      });
      setIsExistingCustomer(true);
      // Bersihkan state dari history agar tidak re-apply saat back
      window.history.replaceState({}, document.title);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // State Data Utama Pelanggan (CRM)
  const [crmData, setCrmData] = useState({
    id: "",
    customerName: "",
    phone: "",
    email: "",
    address: "",
    customerType: "Pekerja/Karyawan", 
    joinDate: new Date().toISOString().split('T')[0],
    points: 0,
    segment: "New Customer",
    status: "Baru"
  });

  // State Detail Order  // Database Layanan (Produk)
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    let active = true;
    async function fetchProducts() {
      try {
        const data = await loadProducts();
        if (active) {
          setProducts(data || []);
          if (data && data.length > 0) {
            setSelectedProductId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Gagal memuat produk di AddOrder:", err);
      }
    }
    fetchProducts();
    return () => {
      active = false;
    };
  }, []);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  // State Metode Pembayaran
  const [paymentMethod, setPaymentMethod] = useState("nanti");
  const [cashAmount, setCashAmount] = useState(""); 

  // State Popup Struk Akhir
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ==========================================
  // 2. LOGIC FILTERING & MEMOIZED CALCULATION
  // ==========================================
  
  // Filter pencarian pelanggan di dalam Modal (Berdasarkan Nama / No HP)
  const filteredMembers = useMemo(() => {
    return customers.filter((c) => 
      c.name.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
      c.phone.includes(searchMemberQuery)
    );
  }, [customers, searchMemberQuery]);

  const currentProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId);
  }, [selectedProductId]);

  const totalPrice = useMemo(() => {
    if (!currentProduct || !weight) return 0;
    return parseFloat(weight) * currentProduct.price;
  }, [currentProduct, weight]);

  const changeAmount = useMemo(() => {
    return parseFloat(cashAmount || 0) - totalPrice;
  }, [cashAmount, totalPrice]);

  const trackingUrl = generatedOrderId ? buildTrackingUrl(generatedOrderId) : "";

  // ==========================================
  // 3. HANDLER PILIH PELANGGAN EXISTING
  // ==========================================
  const handleSelectCustomer = (customer) => {
    setCrmData({
      id: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address || "Alamat Terdaftar",
      customerType: customer.customerType || "Pekerja/Karyawan",
      joinDate: customer.joinDate || new Date().toISOString().split('T')[0],
      points: customer.points || 25,
      segment: customer.status || "Regular",
      status: customer.status || "Aktif"
    });
    setIsExistingCustomer(true);
    setIsRegisteringMember(false);
    setShowCustomerModal(false); // Tutup modal pencarian
  };

  // Reset pilihan pelanggan jika kasir salah pilih
  const handleResetCustomer = () => {
    setCrmData({
      id: "", customerName: "", phone: "", email: "", address: "",
      customerType: "Pekerja/Karyawan", joinDate: new Date().toISOString().split('T')[0],
      points: 0, segment: "New Customer", status: "Baru"
    });
    setIsExistingCustomer(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === "cash" && changeAmount < 0) {
      alert("Maaf, uang tunai yang diterima kurang dari total tagihan!");
      return;
    }
    if (!crmData.customerName || !weight) {
      alert("Mohon lengkapi data pelanggan dan berat cucian terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    // Simpan order ke Supabase supaya QR tracking-nya nyambung ke data asli
    // dan langsung realtime terlihat di halaman admin /tracking + halaman
    // publik /track/:orderId begitu pelanggan scan barcode/QR.
    const { data: order, error } = await createOrder({
      customerName: crmData.customerName,
      phone: crmData.phone,
      service: currentProduct?.title || "Reguler",
      weight,
      price: totalPrice,
      isPaid: paymentMethod !== "nanti",
      detail: `Order baru dari kasir. Menunggu diproses (${weight} Kg).`,
    });

    setIsSubmitting(false);

    if (error || !order) {
      setSubmitError(
        "Gagal menyimpan order ke server. Cek koneksi/konfigurasi Supabase, lalu coba lagi."
      );
      return;
    }

    // Jika pelanggan existing → update poin & total transaksi di Supabase
    if (isExistingCustomer && crmData.id) {
      try {
        const pointsEarned = Math.floor(totalPrice / 1000); // 1 poin per Rp 1.000
        await updateCustomer(crmData.id, {
          points: (crmData.points || 0) + pointsEarned,
          totalTransactions: (crmData.totalTransactions || 0) + 1,
          totalSpent: (crmData.totalSpent || 0) + totalPrice,
          lastTransaction: new Date().toISOString().split('T')[0],
        });
      } catch (updateErr) {
        console.warn("Poin tidak berhasil diupdate:", updateErr);
      }
    }

    setGeneratedOrderId(order.id);
    setShowInvoiceModal(true);
  };

  return (
    <div className="w-full min-h-screen bg-transparent p-1 md:p-6 text-[#0F172A] antialiased font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* NAVIGASI KEMBALI */}
        <button 
          type="button" 
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <HiArrowLeft size={16} /> Kembali ke Antrean
        </button>

        {/* HEADER FORM */}
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-4xl font-black tracking-tight text-slate-800 italic uppercase">
            INPUT <span className="text-blue-600 font-black not-italic">NEW ORDER</span>
          </h1>
          <p className="text-sm font-bold text-slate-400 mt-0.5">
            Pencatatan nota masuk pintar terintegrasi otomatis dengan data member CRM terdaftar.
          </p>
        </div>

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ======================================================== */}
          {/* SEKSI 1: PILIH / DAFTAR PELANGGAN                        */}
          {/* ======================================================== */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <HiUser className="text-blue-600" size={18} /> Profil Pelanggan Nota
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Pilih member lama dari database atau input data baru.</p>
              </div>

              {/* Tombol Cari Member Existing (Sesuai Alur Cerdas Anda) */}
              {!isExistingCustomer && (
                <button
                  type="button"
                  onClick={() => { setSearchMemberQuery(""); setShowCustomerModal(true); }}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-4 py-2 text-sm font-black uppercase text-blue-600 hover:bg-blue-100 transition-all cursor-pointer"
                >
                  <HiSearch size={14} /> Cari Member Terdaftar
                </button>
              )}
            </div>

            {/* JIKA PELANGGAN EXISTING BERHASIL DIPILIH (DATA DIKUNCI / TIDAK PERLU INPUT LAGI) */}
            {isExistingCustomer ? (
              <div className="p-4 bg-emerald-50/40 border border-emerald-200/60 rounded-2xl flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <HiUser size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-base text-slate-800">{crmData.customerName}</p>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-900 text-white tracking-wider font-mono">
                        {crmData.segment}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 font-bold mt-0.5">ID: {crmData.id} • Telp: {crmData.phone}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetCustomer}
                  className="text-sm font-black text-red-500 hover:underline tracking-tight uppercase"
                >
                  Ganti Pelanggan
                </button>
              </div>
            ) : (
              /* JIKA PELANGGAN BARU ATAU MANUAL INPUT */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-bold">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nama Lengkap Pelanggan *</label>
                    <input 
                      type="text" required placeholder="Masukkan nama pelanggan baru..." 
                      value={crmData.customerName}
                      onChange={(e) => setCrmData({...crmData, customerName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nomor HP / WhatsApp *</label>
                    <input 
                      type="tel" required placeholder="Contoh: 081234567xxx" 
                      value={crmData.phone}
                      onChange={(e) => setCrmData({...crmData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Opsi tambahan daftarkan member crm baru */}
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" id="reg-member" checked={isRegisteringMember}
                    onChange={(e) => setIsRegisteringMember(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <label htmlFor="reg-member" className="text-[11px] font-black text-slate-600 uppercase tracking-tight cursor-pointer select-none">
                    Sekaligus daftarkan sebagai member CRM baru Netto Laundry?
                  </label>
                </div>

                {isRegisteringMember && (
                  <div className="p-4 bg-blue-50/20 border border-dashed border-blue-100 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-bold animate-fadeIn">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Alamat Email (Opsional)</label>
                      <input 
                        type="email" placeholder="contoh@email.com" value={crmData.email}
                        onChange={(e) => setCrmData({...crmData, email: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Jenis / Profesi Pelanggan</label>
                      <select 
                        value={crmData.customerType}
                        onChange={(e) => setCrmData({...crmData, customerType: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                      >
                        <option value="Pelajar/Mahasiswa">Pelajar / Mahasiswa</option>
                        <option value="Pekerja/Karyawan">Pekerja / Karyawan</option>
                        <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* SEKSI 2: SELEKSI LAYANAN & BERAT KILOAN                  */}
          {/* ======================================================== */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Layanan & Timbangan (Kiloan)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-bold text-sm">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pilih Jenis Cucian / Paket</label>
                <select 
                  value={selectedProductId} 
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                >
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.title} — (Rp {prod.price.toLocaleString("id-ID")}/Kg)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Berat Cucian (Kiloan) *</label>
                <div className="relative">
                  <input 
                    type="number" step="0.1" required placeholder="0.0" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)} 
                    className="w-full pl-4 pr-12 py-3 text-sm font-black bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">KG</span>
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW PRODUK */}
            {currentProduct && (
              <div className="p-4 bg-blue-50/30 border border-blue-100/70 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-bold">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1"><HiOutlineTag/> Kode</span>
                  <p className="font-mono font-black text-blue-600">{currentProduct.code}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1"><HiOutlineCollection/> Kategori</span>
                  <p className="text-slate-700 uppercase tracking-wide truncate">{currentProduct.category}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1"><HiOutlineCube/> Sisa Stok</span>
                  <p className={`font-black ${currentProduct.stock < 5 ? "text-red-600" : "text-emerald-600"}`}>{currentProduct.stock} Unit</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Harga Tarif</span>
                  <p className="text-slate-800 font-black">Rp {currentProduct.price.toLocaleString("id-ID")}/Kg</p>
                </div>
              </div>
            )}

            <div className="space-y-1.5 font-bold text-sm">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Catatan Khusus Cucian</label>
              <input 
                type="text" placeholder="Contoh: Jas hitam jangan dicampur luntur, saku kemeja kanan bolong..."
                value={notes} onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* SEKSI 3: METODE PEMBAYARAN                               */}
          {/* ======================================================== */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Metode Pembayaran</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Kalkulasi Tagihan: <span className="font-black text-blue-600">Rp {totalPrice.toLocaleString("id-ID")}</span></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-bold text-sm">
              <div onClick={() => setPaymentMethod("nanti")} className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${paymentMethod === 'nanti' ? 'border-slate-800 bg-slate-900 text-white shadow-xs' : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-50'}`}>
                <HiClock size={20} className={paymentMethod === 'nanti' ? 'text-blue-400' : 'text-slate-400'} />
                <div>
                  <p className="font-black uppercase tracking-wide text-[11px]">Bayar Nanti</p>
                  <p className="text-[10px] opacity-70">COD / Pas Ambil</p>
                </div>
              </div>
              <div onClick={() => setPaymentMethod("qris")} className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${paymentMethod === 'qris' ? 'border-blue-600 bg-blue-600 text-white shadow-xs' : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-50'}`}>
                <HiQrcode size={20} className="text-white" />
                <div>
                  <p className="font-black uppercase tracking-wide text-[11px]">QRIS</p>
                  <p className="text-[10px] opacity-70">Scan E-Wallet</p>
                </div>
              </div>
              <div onClick={() => setPaymentMethod("cash")} className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs' : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-50'}`}>
                <HiCash size={20} className="text-white" />
                <div>
                  <p className="font-black uppercase tracking-wide text-[11px]">Cash / Tunai</p>
                  <p className="text-[10px] opacity-70">Uang Fisik</p>
                </div>
              </div>
            </div>

            {paymentMethod === "cash" && (
              <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-2">
                <label className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">Jumlah Uang Fisik Diterima *</label>
                <div className="relative max-w-xs">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-emerald-600">Rp</span>
                  <input 
                    type="number" required={paymentMethod === 'cash'} placeholder="0" value={cashAmount} 
                    onChange={(e) => setCashAmount(e.target.value)} 
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-black bg-white border border-emerald-200 rounded-xl text-slate-800 focus:outline-none" 
                  />
                </div>
              </div>
            )}
          </div>

          {submitError && (
            <p className="text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-black px-5 py-4 rounded-2xl shadow-lg transition-all cursor-pointer uppercase tracking-wider active:scale-95"
          >
            <HiSave size={16} /> {isSubmitting ? "Menyimpan Order..." : "Proses Nota & Tampilkan Invoice"}
          </button>
        </form>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: CARI PELANGGAN EXISTING (Sesuai Mockup 2)        */}
      {/* ======================================================== */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] border border-slate-100 shadow-2xl p-6 space-y-5 relative flex flex-col max-h-[85vh]">
            
            <button 
              onClick={() => setShowCustomerModal(false)} 
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            >
              <HiX size={16} />
            </button>

            {/* Title */}
            <div className="text-left">
              <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Pilih Pelanggan</h3>
              <p className="text-[11px] text-slate-400 font-medium">Cari member terdaftar atau buat order pelanggan baru.</p>
            </div>

            {/* Input Search Input Bar */}
            <div className="relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 text-lg" />
              <input 
                type="text"
                placeholder="Masukkan nama member atau nomor HP..."
                value={searchMemberQuery}
                onChange={(e) => setSearchMemberQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm font-bold text-slate-800 bg-white border-2 border-blue-500 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Hasil Pencarian List */}
            <div className="text-left space-y-1.5 overflow-y-auto flex-1 pr-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Hasil Pencarian Member ({filteredMembers.length})</p>
              
              {filteredMembers.length === 0 ? (
                <p className="text-sm font-bold text-slate-400 py-6 text-center">Member tidak ditemukan dalam database.</p>
              ) : (
                filteredMembers.map((customer) => (
                  <div 
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer)}
                    className="w-full p-3 bg-slate-50/60 border border-slate-100 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-blue-50/50 hover:border-blue-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <HiUser size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{customer.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{customer.phone} • {customer.id}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 tracking-wide">
                      {customer.status}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Button Close/Manual Input */}
            <button
              type="button"
              onClick={() => { handleResetCustomer(); setShowCustomerModal(false); }}
              className="w-full bg-[#111827] text-white py-3 rounded-2xl text-sm font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <HiUserAdd size={16} /> Bukan Member? Isi Detail Manual
            </button>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: INVOICE PINTAR + QR TRACKING                    */}
      {/* ======================================================== */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 text-center space-y-4 relative overflow-y-auto max-h-[90vh] shadow-2xl">
            <button onClick={() => { setShowInvoiceModal(false); navigate("/orders"); }} className="absolute right-5 top-5 text-slate-400 hover:text-slate-700"><HiX size={16} /></button>

            <div className="space-y-1 pt-2">
              <span className="text-[9px] font-black px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase">Layanan: {currentProduct?.title}</span>
              <h3 className="text-2xl font-black text-slate-800 mt-2">IDR {totalPrice.toLocaleString("id-ID")}</h3>
              <p className="text-[11px] font-bold text-slate-400">Nota: {generatedOrderId} • {crmData.customerName} ({weight} KG)</p>
            </div>

            {paymentMethod === "cash" && (
              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-left grid grid-cols-2 gap-y-1 text-sm font-bold">
                <span className="text-slate-400">Total Tagihan:</span><span className="text-right text-slate-800">Rp {totalPrice.toLocaleString("id-ID")}</span>
                <span className="text-slate-400">Uang Tunai:</span><span className="text-right text-slate-800">Rp {parseFloat(cashAmount || 0).toLocaleString("id-ID")}</span>
                <div className="col-span-2 border-t border-dashed border-emerald-200 my-1"></div>
                <span className="text-emerald-700 font-black uppercase">Kembalian:</span><span className="text-right text-emerald-700 font-black">Rp {changeAmount.toLocaleString("id-ID")}</span>
              </div>
            )}

            {/* QR Code Live Tracking Pelanggan */}
            <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-4 space-y-3">
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-wider">QR Code Live Tracking Pelanggan</p>
              <div className="bg-white p-3 rounded-2xl w-32 h-32 mx-auto flex items-center justify-center border border-slate-100">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackingUrl)}`} alt="Customer Tracking QR" className="w-26 h-26 object-contain" />
              </div>
              <p className="text-[10px] font-mono text-slate-500 truncate bg-white p-2 border rounded-xl font-bold">{trackingUrl}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button type="button" onClick={() => alert("Cetak struk sukses.")} className="border bg-white text-slate-700 text-sm font-black py-3 rounded-2xl uppercase"><HiPrinter size={16} /> Cetak Struk</button>
              <button type="button" onClick={() => { setShowInvoiceModal(false); navigate("/orders"); }} className="bg-slate-900 text-white text-sm font-black py-3 rounded-2xl uppercase">Selesai <HiArrowSmRight size={16} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}