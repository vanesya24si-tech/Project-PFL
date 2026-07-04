export default function ReportPageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-fresh to-laundry-bg p-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">{children}</div>
    </div>
  );
}
