import { Link, useNavigate, useParams } from "react-router-dom";
import { HiMail, HiPhone, HiLocationMarker, HiCalendar, HiChevronLeft, HiOutlineBadgeCheck, HiCash, HiShoppingCart, HiSparkles, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { getCustomerById, deleteCustomer } from "../utils/customerStorage";

export default function MemberDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const customer = getCustomerById(id);

  const handleDelete = () => {
    deleteCustomer(id);
    navigate("/members");
  };

  const transactions = customer?.transactions || [
    { id: "TRX-001", date: "2026-04-20", service: "Cuci + Setrika", weight: "3.5 kg", total: 28000, payment: "Transfer", status: "Selesai" },
    { id: "TRX-008", date: "2026-05-02", service: "Cuci Kering", weight: "4.5 kg", total: 31500, payment: "Transfer", status: "Diproses" },
  ];

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] p-6 flex items-center justify-center">
        <div className="max-w-lg rounded-[2rem] bg-white p-8 shadow-xl border border-slate-200 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#10B981] font-bold mb-4">Detail Pelanggan</p>
          <h2 className="text-3xl font-black text-[#0F172A] mb-4">Pelanggan tidak ditemukan</h2>
          <p className="text-sm text-[#64748B] mb-8">Kembali ke daftar pelanggan untuk memilih profil yang tersedia.</p>
          <Link to="/members" className="inline-flex items-center justify-center rounded-3xl bg-[#10B981] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#10B981]/20 hover:bg-[#047857] transition">
            Kembali ke Pelanggan
          </Link>
        </div>
      </div>
    );
  }

  const joinDate = customer.joinDate || customer.memberSince || "-";
  const lastTransaction = customer.lastTransaction || "Belum ada";
  const totalTransactions = customer.totalTransactions ?? customer.orders ?? 0;
  const totalSpent = customer.totalSpent ?? 0;
  const points = customer.points ?? 0;
  const loyaltyValue = Math.round(points * 40);

  return (
    <div className="min-h-screen bg-[#F8FAFB] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-[#64748B]">customers / {customer.name}</p>
            <h1 className="mt-3 text-3xl font-black text-[#0F172A]">Detail Pelanggan</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
              <HiChevronLeft className="text-base" /> Kembali
            </button>
            <Link to={`/members/${id}/edit`} className="inline-flex items-center gap-2 rounded-3xl bg-[#F59E0B] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#D97706] transition">
              <HiOutlinePencil /> Edit
            </Link>
            <button onClick={handleDelete} className="inline-flex items-center gap-2 rounded-3xl bg-[#EF4444] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#DC2626] transition">
              <HiOutlineTrash /> Hapus
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-lg border border-slate-200">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.35fr]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-[#22C55E] to-[#10B981] text-5xl font-black text-white shadow-lg shadow-[#10B981]/20">
                  {customer.avatar}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#047857]">{customer.status}</span>
                    <span className="rounded-full bg-[#E0F2FE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#0369A1]">{customer.activeStatus || "Aktif"}</span>
                    <span className="rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#475569]">{customer.segment || "Regular"}</span>
                  </div>
                  <h2 className="mt-4 text-4xl font-black text-[#0F172A]">{customer.name}</h2>
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#64748B]"><HiMail className="text-[#10B981]" /> {customer.email}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] bg-[#F8FAF8] p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 text-[#0F172A] font-semibold">
                    <HiPhone className="text-xl text-[#10B981]" /> No. Telepon
                  </div>
                  <p className="mt-3 text-lg font-bold">{customer.phone}</p>
                </div>
                <div className="rounded-[1.75rem] bg-[#F8FAF8] p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 text-[#0F172A] font-semibold">
                    <HiLocationMarker className="text-xl text-[#10B981]" /> Alamat
                  </div>
                  <p className="mt-3 text-lg font-bold">{customer.address}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] bg-[#F8FAF8] p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 text-[#0F172A] font-semibold">
                    <HiCalendar className="text-xl text-[#10B981]" /> Bergabung
                  </div>
                  <p className="mt-3 text-lg font-bold">{joinDate}</p>
                </div>
                <div className="rounded-[1.75rem] bg-[#F8FAF8] p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 text-[#0F172A] font-semibold">
                    <HiOutlineBadgeCheck className="text-xl text-[#10B981]" /> Transaksi Terakhir
                  </div>
                  <p className="mt-3 text-lg font-bold">{lastTransaction}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[2rem] bg-[#F8FAF8] p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-[#64748B]">Total Transaksi</p>
                    <p className="mt-3 text-3xl font-black text-[#0F172A]">{totalTransactions}x</p>
                  </div>
                  <HiShoppingCart className="text-3xl text-[#10B981]" />
                </div>
              </div>
              <div className="rounded-[2rem] bg-[#F8FAF8] p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-[#64748B]">Total Belanja</p>
                    <p className="mt-3 text-3xl font-black text-[#0F172A]">Rp {totalSpent.toLocaleString("id-ID")}</p>
                  </div>
                  <HiCash className="text-3xl text-[#10B981]" />
                </div>
              </div>
              <div className="rounded-[2rem] bg-[#F8FAF8] p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-[#64748B]">Poin Loyalitas</p>
                    <p className="mt-3 text-3xl font-black text-[#0F172A]">{points} poin</p>
                  </div>
                  <HiSparkles className="text-3xl text-[#10B981]" />
                </div>
              </div>
              <div className="rounded-[2rem] bg-[#F8FAF8] p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-[#64748B]">Nilai Poin</p>
                    <p className="mt-3 text-3xl font-black text-[#0F172A]">Rp {loyaltyValue.toLocaleString("id-ID")}</p>
                  </div>
                  <HiCash className="text-3xl text-[#10B981]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-lg border border-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A]">Riwayat Transaksi</h2>
              <p className="mt-2 text-sm text-[#64748B]">{transactions.length} transaksi ditemukan</p>
            </div>
            <div className="text-sm font-semibold text-[#10B981]">Total: Rp {transactions.reduce((sum, item) => sum + item.total, 0).toLocaleString("id-ID")}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-[#475569]">
              <thead className="border-b border-slate-200 bg-[#F8FAF8] text-[#475569]">
                <tr>
                  <th className="px-4 py-3 uppercase tracking-[0.24em]">ID</th>
                  <th className="px-4 py-3 uppercase tracking-[0.24em]">Tanggal</th>
                  <th className="px-4 py-3 uppercase tracking-[0.24em]">Layanan</th>
                  <th className="px-4 py-3 uppercase tracking-[0.24em]">Berat</th>
                  <th className="px-4 py-3 uppercase tracking-[0.24em]">Total</th>
                  <th className="px-4 py-3 uppercase tracking-[0.24em]">Pembayaran</th>
                  <th className="px-4 py-3 uppercase tracking-[0.24em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {transactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-[#F8FBFF] transition-colors">
                    <td className="px-4 py-4 font-semibold text-[#0F172A]">{trx.id}</td>
                    <td className="px-4 py-4">{trx.date}</td>
                    <td className="px-4 py-4">{trx.service}</td>
                    <td className="px-4 py-4">{trx.weight}</td>
                    <td className="px-4 py-4 font-semibold text-[#0F172A]">Rp {trx.total.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-4">{trx.payment}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${trx.status === "Selesai" ? "bg-[#D1FAE5] text-[#047857]" : trx.status === "Diproses" ? "bg-[#DBEAFE] text-[#1D4ED8]" : "bg-[#FEF3C7] text-[#B45309]"}`}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
