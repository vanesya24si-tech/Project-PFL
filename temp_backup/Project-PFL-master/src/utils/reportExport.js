import * as XLSX from "xlsx";

const ensureHtml2Pdf = async () => {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.html2pdf) {
    return true;
  }

  try {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error("Gagal memuat html2pdf:", error);
    return false;
  }

  return Boolean(window.html2pdf);
};

export async function exportReportToPdf(element, filename) {
  if (!element) {
    throw new Error("Elemen laporan tidak ditemukan.");
  }

  const ready = await ensureHtml2Pdf();
  if (!ready) {
    throw new Error("Library PDF tidak tersedia.");
  }

  const opt = {
    margin: [0.3, 0.3, 0.3, 0.3],
    filename,
    image: { type: "jpeg", quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  await window.html2pdf().set(opt).from(element).save();
}

export function exportReportToExcel({ summary, details, filename, period }) {
  const workbook = XLSX.utils.book_new();

  const summaryRows = [
    ["Periode", period],
    [],
    ["Label", "Nilai", "Trend"],
    ...summary.map((item) => [item.label, item.value, item.trend]),
  ];

  const detailRows = details.map((row) => ({
    Tanggal: row.date,
    "Total Order": row.orders,
    Pendapatan: row.revenue,
    "Kategori Terlaris": row.favorite,
    Trend: row.status,
  }));

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
  const detailSheet = XLSX.utils.json_to_sheet(detailRows);

  XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");
  XLSX.utils.book_append_sheet(workbook, detailSheet, "Transaksi");

  const out = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([out], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
