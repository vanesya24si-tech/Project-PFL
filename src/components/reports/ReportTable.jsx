export default function ReportTable({ children }) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/30 border border-laundry-border overflow-hidden">
      {children}
    </div>
  );
}
