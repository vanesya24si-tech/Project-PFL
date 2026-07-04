import { HiDownload } from "react-icons/hi";

export default function ExportButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-aqua-bright to-cyan-dark px-5 py-2.5 text-white font-bold shadow-lg shadow-aqua-bright/20 transition-all duration-300 active:scale-95 hover:shadow-xl"
    >
      <HiDownload />
      {label}
    </button>
  );
}
