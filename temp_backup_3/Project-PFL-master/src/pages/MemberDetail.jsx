import { Link, useNavigate, useParams } from "react-router-dom";
import { HiMail, HiPhone, HiLocationMarker, HiCalendar, HiChevronLeft, HiOutlineBadgeCheck, HiCash, HiShoppingCart, HiSparkles, HiOutlinePencil, HiOutlineTrash, HiUserGroup } from "react-icons/hi";
import { getCustomerById, deleteCustomer } from "../utils/customerStorage";

export default function MemberDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const customer = getCustomerById(id);

  const handleDelete = () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data ${customer?.name}?`)) {
      deleteCustomer(id);
      navigate("/members");
    }
  };

  const transactions = customer?.transactions || [
    { id: "TRX-001", date: "20 Apr 2026", service: "Cuci + Setrika Reguler", details: "3.5 kg", total: 28000, payment: "Transfer BCA", status: "Selesai" },
    { id: "TRX-008", date: "02 Mei 2026", service: "Cuci Kering Ekspres", details: "4.5 kg", total: 31500, payment: "Tunai", status: "Diproses" },
  ];

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] p-6 flex items-center justify-center font-sans">
        <div className="max-w-md rounded-3xl bg-white p-10 shadow-sm border border-slate-100 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold mb-3">Notifikasi</p>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Profil Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">Maaf, data pelanggan yang Anda cari tidak ada atau sudah dihapus.</p>
          <Link to="/members" className="inline-flex items-center justify-center rounded-full bg-sky-600 px-7 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition duration-150 shadow-sm">
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  const joinDate = customer.joinDate || "-";
  const lastTransaction = customer.lastTransaction || "Belum ada order";
  const totalTransactions = customer.totalTransactions || 0;
  const totalSpent = customer.totalSpent || 0;
  const points = customer.points || 0;
  const loyaltyValue = Math.round(points * 40);
  const customerType = customer.customerType || "Reguler";

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 md:p-10 font-sans text-slate-700">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* -- HEADER AREA -- */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <Link to="/members" className="hover:text-sky-600 transition">Pelanggan</Link>
              <span>/</span>
              <span className="text-slate-500 font-medium">{customer.name}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Detail Profil</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm hover:border-slate-300">
              <HiChevronLeft className="text-lg text-slate-400" /> Kembali
            </button>
            <Link to={`/members/${id}/edit`} className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-5 py-2.5 text-sm font-semibold text-sky-700 hover:bg-sky-50 transition shadow-sm hover:border-sky-200">
              <HiOutlinePencil className="text-lg" /> Edit
            </Link>
            <button onClick={handleDelete} className="inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition shadow-sm">
              <HiOutlineTrash className="text-lg" /> Hapus
            </button>
          </div>
        </div>

        {/* -- MAIN CONTENT GRID -- */}
        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(340px,auto)]">
          
          {/* LEFT COLUMN: Profile & Info */}
          <div className="space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                {/* Avatar: Solid color, softer shape */}
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-3xl bg-sky-100 text-4xl font-bold text-sky-700 shadow-inner">
                  {customer.avatar || customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">{customer.segment || "Umum"}</span>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${customer.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {customer.status || "Aktif"}
                    </span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{customer.name}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <HiMail className="text-sky-400" /> {customer.email}
                  </p>
                </div>
              </div>

              {/* Info Grid: Cleaner separation, softer icons */}
              <div className="grid gap-5 mt-10 pt-8 border-t border-slate-100 sm:grid-cols-2">
                {[
                  { icon: HiPhone, label: "No. WhatsApp", value: customer.phone },
                  { icon: HiUserGroup, label: "Tipe Pelanggan", value: customerType },
                  { icon: HiCalendar, label: "Bergabung Sejak", value: joinDate },
                  { icon: HiOutlineBadgeCheck, label: "Order Terakhir", value: lastTransaction },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sky-500">
                      <item.icon className="text-xl" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{item.label}</p>
                      <p className="mt-1 text-base font-semibold text-slate-800">{item.value}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-4 p-2 sm:col-span-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sky-500 hover:border-sky-100 transition">
                    <HiLocationMarker className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Alamat Penjemputan</p>
                    <p className="mt-1 text-base font-semibold text-slate-800 leading-relaxed">{customer.address || "Alamat belum diatur"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Key Stats */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 px-1">Ikhtisar Akun</h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex items-center gap-5">
                <div className="p-4 bg-sky-50 rounded-xl text-sky-600"><HiShoppingCart size={24} /></div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Order</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{totalTransactions}<span className="text-lg font-medium text-slate-400 ml-1.5">kali</span></p>
                </div>
              </div>
              
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex items-center gap-5">
                <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600"><HiCash size={24} /></div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Pengeluaran</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">Rp {totalSpent.toLocaleString("id-ID")}</p>
                </div>
              </div>

              {/* Points Card: Matte Blue, cleaner look */}
              <div className="rounded-2xl bg-sky-700 p-7 shadow-md text-white">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-sky-200">Poin Loyalitas</p>
                  <HiSparkles className="text-2xl text-sky-300" />
                </div>
                <p className="text-4xl font-extrabold">{points} <span className="text-xl font-medium text-sky-200">pts</span></p>
                <div className="mt-4 pt-4 border-t border-sky-600/50 text-sm font-medium text-sky-100">
                  Dapat ditukar senilai <span className="font-bold text-white">Rp {loyaltyValue.toLocaleString("id-ID")}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* -- TRANSACTION HISTORY -- */}
        <div className="rounded-3xl bg-white p-8 md:p-10 shadow-sm border border-slate-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-9 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Riwayat Transaksi</h2>
              <p className="mt-1 text-sm text-slate-500">Menampilkan {transactions.length} aktivitas terbaru</p>
            </div>
            <div className="text-sm font-semibold text-slate-500 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100">
              Total Omset: <span className="font-bold text-slate-800 ml-1">Rp {transactions.reduce((sum, item) => sum + item.total, 0).toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider text-[11px]">ID</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider text-[11px]">Tanggal</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider text-[11px]">Layanan & Detail</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider text-[11px]">Total Bayar</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-5 font-semibold text-slate-800">{trx.id}</td>
                    <td className="px-5 py-5 text-slate-600">{trx.date}</td>
                    <td className="px-5 py-5">
                      <span className="font-semibold text-slate-800 block">{trx.service}</span>
                      <span className="text-xs text-slate-400 font-medium">{trx.details} • {trx.payment}</span>
                    </td>
                    <td className="px-5 py-5 font-bold text-sky-700">Rp {trx.total.toLocaleString("id-ID")}</td>
                    <td className="px-5 py-5">
                      <span className={`inline-flex rounded-full px-3.5 py-1 text-xs font-semibold ${
                        trx.status === "Selesai" ? "bg-emerald-50 text-emerald-700" : 
                        trx.status === "Diproses" ? "bg-sky-50 text-sky-700" : 
                        "bg-amber-50 text-amber-700"
                      }`}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {transactions.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm border border-dashed border-slate-200 rounded-2xl mt-4">
              Belum ada riwayat transaksi untuk pelanggan ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}