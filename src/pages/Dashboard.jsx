import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, ComposedChart, Bar, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { 
  MdDashboard, MdPeople, MdShoppingCart, MdBarChart, 
  MdSettings, MdMenu, MdChevronLeft, MdAttachMoney, 
  MdOutlineInventory2, MdLocalLaundryService, MdAccessTime, MdLocalShipping 
} from "react-icons/md";

// ─── DESIGN TOKENS ──────────────────────────────────────────
const COLORS = {
  primary: "#17A589",
  primaryDark: "#0D7A68",
  primaryLight: "#E8F8F5",
  text: "#1A2E35",
  textMuted: "#7F9E97",
  border: "#E0EEEA",
  white: "#FFFFFF",
  bg: "#F0F4F3",
  success: "#2ECC71",
  danger: "#E74C3C",
};

// ─── DATA DUMMY ─────────────────────────────────────────────
const chartData = [
  { name: "Jan", weight: 800, revenue: 16000000 },
  { name: "Feb", weight: 950, revenue: 19000000 },
  { name: "Mar", weight: 1100, revenue: 22000000 },
  { name: "Apr", weight: 1300, revenue: 26000000 },
  { name: "May", weight: 1550, revenue: 31000000 },
  { name: "Jun", weight: 1900, revenue: 38000000 },
];

const topServices = [
  { id: 1, name: "Wash & Fold", count: 350, price: "Rp 12.000/kg", pct: 90 },
  { id: 2, name: "Dry Cleaning", count: 120, price: "Rp 75.000/pc", pct: 70 },
  { id: 3, name: "Express Wash", count: 180, price: "Rp 20.000/kg", pct: 60 },
];

// ─── REUSABLE COMPONENTS ────────────────────────────────────
function KpiCard({ icon: Icon, value, label, delta }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E0EEEA] flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-sm">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#E8F8F5] text-[#17A589]">
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <p className="text-xl font-bold text-[#1A2E35]">{value}</p>
        <p className="text-[13px] text-[#7F9E97] font-medium">{label}</p>
      </div>
      {delta && (
        <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${delta > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
          {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}%
        </span>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E0EEEA] rounded-lg p-3 shadow-md text-[12px]">
      <p className="text-[#7F9E97] mb-1 font-bold">{label}</p>
      <p className="text-[#17A589] font-black">{prefix}{payload[0].value.toLocaleString("id-ID")}</p>
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────
export default function NettoLaundryDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F4F3] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1A2E35] tracking-tight">Netto Laundry Overview</h1>
            <p className="text-[#7F9E97] text-sm">Monitor performa laundry Anda dalam satu dashboard hijau.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-[#E0EEEA] text-[#17A589] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#E8F8F5] transition-all">
              Riwayat Pesanan
            </button>
            <button className="bg-[#17A589] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#0D7A68] shadow-lg shadow-[#17A589]/20 transition-all">
              + Pesanan Baru
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={MdAccessTime} value="1,050" label="Total Pesanan" delta={8} />
          <KpiCard icon={MdLocalLaundryService} value="985" label="Selesai" delta={12} />
          <KpiCard icon={MdLocalShipping} value="65" label="Proses Antar" delta={-3} />
          <KpiCard icon={MdAttachMoney} value="Rp 130.1M" label="Total Revenue" delta={18} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0EEEA]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#1A2E35]">Tren Pendapatan</h3>
              <span className="text-[10px] bg-[#E8F8F5] text-[#17A589] px-2 py-1 rounded font-bold uppercase">Jan - Jun 2026</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#17A589" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#17A589" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F4F3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#7F9E97', fontSize: 12}} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip prefix="Rp " />} />
                <Area type="monotone" dataKey="revenue" stroke="#17A589" strokeWidth={3} fill="url(#colorGreen)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Volume Trend */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0EEEA]">
            <h3 className="font-bold text-[#1A2E35] mb-6">Volume Laundry (Kg)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F4F3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#7F9E97', fontSize: 12}} />
                <Tooltip cursor={{fill: '#E8F8F5'}} content={<CustomTooltip />} />
                <Bar dataKey="weight" fill="#A3DDD0" radius={[4, 4, 0, 0]} barSize={30} />
                <Line type="monotone" dataKey="weight" stroke="#17A589" strokeWidth={3} dot={{ r: 5, fill: "#fff", stroke: "#17A589", strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insight Alert (Tema Hijau) */}
        <div className="bg-[#E8F8F5] border border-[#A3DDD0] rounded-2xl p-5 flex items-start gap-4">
           <div className="text-[#17A589]"><MdBarChart size={24} /></div>
           <div>
             <p className="text-[#0D7A68] font-bold text-sm">Laundry Insight Hari Ini</p>
             <p className="text-[#17A589] text-xs mt-1">Layanan <b>Wash & Fold</b> meningkat 20%. Pastikan stok deterjen aman dan mesin cuci nomor 3 segera diperbaiki.</p>
           </div>
        </div>

      </div>
    </div>
  );
}