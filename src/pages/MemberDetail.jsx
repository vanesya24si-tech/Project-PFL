import { Link, useParams } from "react-router-dom";
import customers from "../data/customers.json";

export default function MemberDetail() {
  const { id } = useParams();
  const customer = customers.find((item) => item.id.toString() === id);

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Pelanggan tidak ditemukan</h2>
          <p className="text-[#7F9E97] mb-6">Pastikan Anda memilih pelanggan yang tersedia dari daftar.</p>
          <Link
            to="/members"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-2xl hover:bg-emerald-500 transition-all"
          >
            Kembali ke Pelanggan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F6] p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-3xl w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#7F9E97] mb-2">Detail Pelanggan</p>
            <h1 className="text-3xl font-black text-[#1A2E35]">{customer.name}</h1>
            <p className="text-sm text-slate-500 mt-2">Status: <span className="font-bold text-[#1ABC9C]">{customer.status}</span></p>
          </div>
          <Link
            to="/members"
            className="text-emerald-600 hover:text-emerald-500 font-bold"
          >
            Kembali ke Pelanggan
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-[#E0EEEA] p-6 bg-[#F8F9F8]">
            <p className="text-sm uppercase tracking-[0.35em] text-[#7F9E97] mb-4">Informasi Akun</p>
            <div className="space-y-4 text-[#1A2E35]">
              <div>
                <span className="block text-sm text-[#7F9E97]">Email</span>
                <p className="font-bold">{customer.email}</p>
              </div>
              <div>
                <span className="block text-sm text-[#7F9E97]">No. Telepon</span>
                <p className="font-bold">{customer.phone}</p>
              </div>
              <div>
                <span className="block text-sm text-[#7F9E97]">Alamat</span>
                <p className="font-bold">{customer.address}</p>
              </div>
              <div>
                <span className="block text-sm text-[#7F9E97]">Member Sejak</span>
                <p className="font-bold">{customer.memberSince}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E0EEEA] p-6 bg-white">
            <p className="text-sm uppercase tracking-[0.35em] text-[#7F9E97] mb-4">Riwayat Pelayanan</p>
            <div className="space-y-4 text-[#1A2E35]">
              <div>
                <span className="block text-sm text-[#7F9E97]">Total Order</span>
                <p className="text-3xl font-black text-[#1ABC9C]">{customer.orders}</p>
              </div>
              <div>
                <span className="block text-sm text-[#7F9E97]">Order Terakhir</span>
                <p className="font-bold">{customer.lastOrder}</p>
              </div>
              <div>
                <span className="block text-sm text-[#7F9E97]">Layanan Favorit</span>
                <p className="font-bold">{customer.favoriteService}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
