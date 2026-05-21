export default function ProgressBar({ value, max }) {
  const width = Math.min(100, Math.round((value / max) * 100));

  return (
    <span className="w-12 h-2 bg-[#E0EEEA] rounded-full overflow-hidden">
      <span className="bg-[#17A589] h-full rounded-full" style={{ width: `${width}%` }} />
    </span>
  );
}
