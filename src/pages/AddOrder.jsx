import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HiUser, HiArrowLeft, HiSave, HiX, HiQrcode, HiPrinter, HiClipboardCopy, HiArrowSmRight,
  HiClock, HiCash, HiOutlineCube, HiOutlineTag, HiOutlineCollection
} from "react-icons/hi";

// Mengambil data produk/layanan terpusat dari JSON yang sama dengan detail produk
import products from "../data/laundryProducts.json";

export default function AddOrderForm() {
  const navigate = useNavigate();

  // 1. STATE MANAGEMENT
  // State untuk kontrol pendaftaran member CRM baru
  const [isRegisteringMember, setIsRegisteringMember] = useState(false);
  
  // State Data Pelanggan & Atribut CRM Lengkap
  const [crmData, setCrmData] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    customerType: "Pekerja/Karyawan", 
    joinDate: new Date().toISOString().split('T')[0], // Otomatis tanggal hari ini 2026
    points: 10, // Bonus poin pendaftaran awal
    totalTransactions: 1,
    totalSpent: 0,
    segment: "New Customer",
    status: "Aktif"
  });

  // State Detail Order & Timbangan
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  // State Metode Pembayaran: 'nanti' | 'qris' | 'cash'
  const [paymentMethod, setPaymentMethod] = useState("nanti");
  const [cashAmount, setCashAmount] = useState(""); 

  // State Pengontrol Modal Hasil Akhir (Struk & Tracking)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");

  // 2. MEMOIZED LOGIC (Menghindari Re-render Berlebih & Kalkulasi Otomatis)
  // Menemukan data detail produk yang sedang aktif di dropdown
  const currentProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId);
  }, [selectedProductId]);

  // Hitung total harga: Berat * Harga Produk
  const totalPrice = useMemo(() => {
    if (!currentProduct || !weight) return 0;
    return parseFloat(weight) * currentProduct.price;
  }, [currentProduct, weight]);

  // Hitung kembalian uang jika bayar cash
  const changeAmount = useMemo(() => {
    return parseFloat(cashAmount || 0) - totalPrice;
  }, [cashAmount, totalPrice]);

  // URL Mockup Live Tracking untuk discan / dikirim ke WA pelanggan
  const trackingUrl = `nettolaundry.com/track/${generatedOrderId}`;

  // 3. HANDLER SIMPAN DATA
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi tambahan jika pilih cash tapi uangnya kurang
    if (paymentMethod === "cash" && changeAmount < 0) {
      alert("Maaf, uang tunai yang diterima kurang dari total tagihan!");
      return;
    }

    // Generate Order ID Acak
    const randomId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedOrderId(randomId);
    
    // Tampilkan popup invoice & QRIS
    setShowInvoiceModal(true);
  };

  return (
    <div className="w-full min-h-screen bg-transparent p-1 md:p-6 text-[#0F172A] antialiased font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* NAVIGASI KEMBALI */}
        <button 
          type="button" 
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <HiArrowLeft size={16} /> Kembali ke Antrean
        </button>

        {/* HEADER FORM */}
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-3xl font-black tracking-tight text-slate-800 italic uppercase">
            INPUT <span className="text-blue-600 font-black not-italic">NEW ORDER</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 mt-0.5">
            Pencatatan nota laundry masuk terintegrasi dengan modul CRM dan cek inventaris produk.
          </p>
        </div>

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ======================================================== */}
          {/* SEKSI 1: INFORMASI PELANGGAN & SELEKSI CRM MEMBER        */}
          {/* ======================================================== */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-3">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <HiUser className="text-blue-600" size={18} /> Informasi Pelanggan
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Kelola identitas data atau program loyalitas pelanggan.</p>
              </div>

              {/* Toggle Box: Pilihan Daftar Member */}
              <label className="inline-flex items-center gap-2.5 cursor-pointer bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl select-none hover:bg-slate-100/70 transition-all">
                <input 
                  type="checkbox" 
                  checked={isRegisteringMember}
                  onChange={(e) => setIsRegisteringMember(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500/20 cursor-pointer"
                />
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">Daftarkan Member Baru?</p>
                  <p className="text-[9px] text-blue-600 font-bold uppercase">Program CRM Netto</p>
                </div>
              </label>
            </div>

            {/* Input Data Wajib (Biasa / Member) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nama Lengkap Pelanggan *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Masukkan nama..." 
                  value={crmData.customerName}
                  onChange={(e) => setCrmData({...crmData, customerName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nomor HP / WhatsApp *</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="Contoh: 081234567xxx" 
                  value={crmData.phone}
                  onChange={(e) => setCrmData({...crmData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Atribut Ekstra CRM (Hanya muncul jika toggle aktif) */}
            {isRegisteringMember && (
              <div className="p-4 bg-blue-50/20 border border-dashed border-blue-100 rounded-2xl space-y-4 animate-fadeIn">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                  ✨ Formulir Database CRM Pelanggan
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Alamat Email (Opsional)</label>
                    <input 
                      type="email" 
                      placeholder="contoh@email.com" 
                      value={crmData.email}
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

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Alamat Rumah Tinggal</label>
                    <input 
                      type="text" 
                      placeholder="Nama jalan, nomor rumah, wilayah kelurahan..." 
                      value={crmData.address}
                      onChange={(e) => setCrmData({...crmData, address: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                    />
                  </div>
                </div>

                {/* Status Meta Data CRM Otomatis */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center bg-white border border-slate-100 p-2.5 rounded-xl text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <div>Join Date: <span className="text-slate-700 block mt-0.5">{crmData.joinDate}</span></div>
                  <div>Poin Loyalitas: <span className="text-emerald-600 block mt-0.5">+{crmData.points} Poin</span></div>
                  <div>Segmen: <span className="text-blue-600 block mt-0.5">{crmData.segment}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* SEKSI 2: SELEKSI LAYANAN (DROPDOWN) & BERAT              */}
          {/* ======================================================== */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Layanan & Timbangan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-bold text-xs">
              {/* Dropdown Menu */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pilih Paket Laundry</label>
                <select 
                  value={selectedProductId} 
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-4 py-3 text-xs bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                >
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.title} — (Rp {prod.price.toLocaleString("id-ID")}/Kg)
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Berat */}
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Berat Pakaian *</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1" 
                    required 
                    placeholder="0.0" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)} 
                    className="w-full pl-4 pr-12 py-3 text-xs font-black bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">KG</span>
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW: Menampilkan Data Sesuai Gaya ProductDetail */}
            {currentProduct && (
              <div className="p-4 bg-blue-50/30 border border-blue-100/70 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-bold animate-fadeIn">
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

            {/* Input Catatan */}
            <div className="space-y-1.5 font-bold text-xs">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Catatan Khusus Baju</label>
              <input 
                type="text"
                placeholder="Contoh: Pisahkan kaos luntur, saku mohon dicek..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 text-xs bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* SEKSI 3: METODE PEMBAYARAN DI AWAL / DI AKHIR            */}
          {/* ======================================================== */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Metode Pembayaran</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Kalkulasi Tagihan: <span className="font-black text-blue-600">Rp {totalPrice.toLocaleString("id-ID")}</span></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-bold text-xs">
              {/* Opsi 1: Nanti */}
              <div onClick={() => setPaymentMethod("nanti")} className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${paymentMethod === 'nanti' ? 'border-slate-800 bg-slate-900 text-white shadow-xs' : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-50'}`}>
                <HiClock size={20} className={paymentMethod === 'nanti' ? 'text-blue-400' : 'text-slate-400'} />
                <div>
                  <p className="font-black uppercase tracking-wide text-[11px]">Bayar Nanti</p>
                  <p className="text-[10px] opacity-70">COD / Pas Ambil</p>
                </div>
              </div>

              {/* Opsi 2: QRIS */}
              <div onClick={() => setPaymentMethod("qris")} className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${paymentMethod === 'qris' ? 'border-blue-600 bg-blue-600 text-white shadow-xs' : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-50'}`}>
                <HiQrcode size={20} className="text-white" />
                <div>
                  <p className="font-black uppercase tracking-wide text-[11px]">QRIS</p>
                  <p className="text-[10px] opacity-70">Scan E-Wallet</p>
                </div>
              </div>

              {/* Opsi 3: Tunai */}
              <div onClick={() => setPaymentMethod("cash")} className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs' : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-50'}`}>
                <HiCash size={20} className="text-white" />
                <div>
                  <p className="font-black uppercase tracking-wide text-[11px]">Cash / Tunai</p>
                  <p className="text-[10px] opacity-70">Uang Fisik</p>
                </div>
              </div>
            </div>

            {/* Input Nominal Tunai Kasir */}
            {paymentMethod === "cash" && (
              <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-2 animate-fadeIn">
                <label className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">Jumlah Uang Fisik Diterima *</label>
                <div className="relative max-w-xs">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-600">Rp</span>
                  <input 
                    type="number" 
                    required={paymentMethod === 'cash'} 
                    placeholder="0" 
                    value={cashAmount} 
                    onChange={(e) => setCashAmount(e.target.value)} 
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-black bg-white border border-emerald-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/10" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* BUTTON SUBMIT */}
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-5 py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all cursor-pointer uppercase tracking-wider active:scale-95">
            <HiSave size={16} /> Proses Nota & Tampilkan Invoice
          </button>
        </form>
      </div>

      {/* ======================================================== */}
      {/* MODAL INVOICE PINTAR + KODE QRIS + LINK TRACKING         */}
      {/* ======================================================== */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] border border-slate-100 shadow-2xl p-6 text-center space-y-5 relative">
            
            <button 
              onClick={() => { setShowInvoiceModal(false); navigate("/orders"); }} 
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            >
              <HiX size={16} />
            </button>

            {/* Header Ringkasan Tagihan */}
            <div className="space-y-1 pt-2">
              <span className="text-[9px] font-black px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest">
                Layanan: {currentProduct?.title}
              </span>
              <h3 className="text-xl font-black text-slate-800 tracking-tight mt-2">
                IDR {totalPrice.toLocaleString("id-ID")}
              </h3>
              <p className="text-[11px] font-bold text-slate-400">
                Nota: {generatedOrderId} • {crmData.customerName || "Pelanggan"} ({weight} KG)
              </p>
            </div>

            {/* Konten Fleksibel Sesuai Pilihan Pembayaran */}
            {paymentMethod === "nanti" && (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left text-[11px] text-slate-400 font-medium leading-relaxed">
                📌 **Status: Belum Lunas (COD)**. Data antrean berhasil tersimpan, instruksikan kasir untuk menagih biaya pelunasan saat pengambilan pakaian.
              </div>
            )}

            {paymentMethod === "qris" && (
              <div className="space-y-2">
                <div className="bg-white border border-slate-100 p-4 rounded-3xl w-44 h-44 mx-auto flex flex-col items-center justify-center relative shadow-inner">
                  {/* Generate QR Otomatis terikat ke Link Tracking */}
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${trackingUrl}`} alt="QRIS" className="w-32 h-32 object-contain rounded-lg" />
                </div>
                <p className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full w-fit mx-auto uppercase tracking-wider">
                  Scan QRIS Pelanggan untuk Tracking
                </p>
              </div>
            )}

            {paymentMethod === "cash" && (
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-left grid grid-cols-2 gap-y-1.5 text-xs font-bold">
                <span className="text-slate-400">Total Tagihan:</span>
                <span className="text-right text-slate-800">Rp {totalPrice.toLocaleString("id-ID")}</span>
                <span className="text-slate-400">Uang Tunai:</span>
                <span className="text-right text-slate-800">Rp {parseFloat(cashAmount || 0).toLocaleString("id-ID")}</span>
                <div className="col-span-2 border-t border-dashed border-emerald-200 my-1"></div>
                <span className="text-emerald-700 font-black uppercase">Kembalian:</span>
                <span className="text-right text-emerald-700 font-black">Rp {changeAmount.toLocaleString("id-ID")}</span>
              </div>
            )}

            {/* SEKSI TAUTAN LIVE TRACKING */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3.5 text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-wider">Tautan Live Tracking</span>
                <button 
                  type="button" 
                  onClick={() => { navigator.clipboard.writeText(trackingUrl); alert("Link live tracking disalin ke clipboard!"); }} 
                  className="text-slate-400 hover:text-blue-600 flex items-center gap-1 text-[10px] font-black"
                >
                  <HiClipboardCopy size={12} /> SALIN
                </button>
              </div>
              <p className="text-xs font-black text-slate-700 break-all bg-white p-2 rounded-xl border border-slate-100 shadow-2xs underline font-mono select-all">
                {trackingUrl}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button type="button" onClick={() => alert("Perintah cetak struk thermal dikirim ke printer.")} className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black py-3 rounded-2xl uppercase tracking-wide"><HiPrinter size={16} /> Cetak Struk</button>
              <button type="button" onClick={() => { setShowInvoiceModal(false); navigate("/orders"); }} className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black py-3 rounded-2xl uppercase tracking-wide">Selesai <HiArrowSmRight size={16} /></button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}