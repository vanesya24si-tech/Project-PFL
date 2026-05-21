import { useState } from "react";
import { HiCash, HiShoppingBag, HiTrendingUp } from "react-icons/hi";
import ReportPageWrapper from "../components/reports/ReportPageWrapper";
import ReportPageHeader from "../components/reports/ReportPageHeader";
import PeriodSelect from "../components/reports/PeriodSelect";
import ExportButton from "../components/reports/ExportButton";
import StatsGrid from "../components/reports/StatsGrid";
import StatCard from "../components/reports/StatCard";
import ReportTable from "../components/reports/ReportTable";
import ReportTableHeader from "../components/reports/ReportTableHeader";
import ReportTableRow from "../components/reports/ReportTableRow";
import ReportTableFooter from "../components/reports/ReportTableFooter";
import InsightCard from "../components/reports/InsightCard";

const stats = [
  { label: "Total Pendapatan", value: "Rp 8.450.000", icon: <HiCash />, trend: "+12.5%", trendColor: "text-emerald-500" },
  { label: "Order Selesai", value: "142", icon: <HiShoppingBag />, trend: "+8%", trendColor: "text-sky-500" },
  { label: "Member Baru", value: "24", icon: <HiTrendingUp />, trend: "+18%", trendColor: "text-cyan-500" },
];

const reportData = [
  { id: 1, date: "01 Mei 2026", orders: 12, revenue: "Rp 450.000", favorite: "Cuci Komplit" },
  { id: 2, date: "02 Mei 2026", orders: 15, revenue: "Rp 620.000", favorite: "Express" },
  { id: 3, date: "03 Mei 2026", orders: 10, revenue: "Rp 380.000", favorite: "Cuci Komplit" },
  { id: 4, date: "04 Mei 2026", orders: 22, revenue: "Rp 940.000", favorite: "Setrika" },
  { id: 5, date: "05 Mei 2026", orders: 18, revenue: "Rp 710.000", favorite: "Cuci Komplit" },
];

const periodOptions = ["Hari Ini", "Minggu Ini", "Bulan Ini", "Tahun Ini"];

export default function Reports() {
  const [period, setPeriod] = useState("Bulan Ini");

  return (
    <ReportPageWrapper>
        
      <ReportPageHeader
        title="Laporan Analitik"
        subtitle="Pantau performa bisnis Netto Laundry Anda"
        actions={
          <>
            <PeriodSelect
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              options={periodOptions}
            />
            <ExportButton onClick={() => {}} label="Export PDF" />
          </>
        }
      />

      <StatsGrid>
        {stats.map((item) => (
          <StatCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
            trend={item.trend}
            trendColor={item.trendColor}
          />
        ))}
      </StatsGrid>

      <ReportTable>
        <div className="p-7 border-b border-[#F0F4F3] flex justify-between items-center">
          <h3 className="font-bold text-[#1A2E35] text-lg">Ringkasan Harian</h3>
          <span className="text-xs font-bold text-[#17A589] bg-[#E8F8F5] px-3 py-1 rounded-full uppercase tracking-wider">
            Mei 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <ReportTableHeader />
            <tbody className="divide-y divide-[#F0F4F3]">
              {reportData.map((row) => (
                <ReportTableRow key={row.id} row={row} />
              ))}
            </tbody>
            <ReportTableFooter total="Rp 3.100.000" />
          </table>
        </div>
      </ReportTable>

      <InsightCard
        title="Insight Bisnis Minggu Ini"
        description="Layanan Cuci Komplit mengalami kenaikan permintaan sebesar 20%. Pertimbangkan untuk menambah stok deterjen dan pewangi di gudang untuk mengantisipasi lonjakan di akhir pekan."
        highlight="Cuci Komplit"
      />

    </ReportPageWrapper>
  );
}