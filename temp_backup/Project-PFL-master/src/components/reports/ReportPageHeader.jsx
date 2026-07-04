import { HiDocumentReport } from "react-icons/hi";

export default function ReportPageHeader({ title, subtitle, actions }) {
  return (
    <div className="bg-white border border-laundry-border rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-navy-deep flex items-center gap-2">
          <HiDocumentReport className="text-aqua-bright" />
          {title}
        </h1>
        <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
      </div>
      <div className="flex gap-3">{actions}</div>
    </div>
  );
}
