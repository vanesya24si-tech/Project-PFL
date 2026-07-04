import { HiFilter } from "react-icons/hi";

export default function PeriodSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none bg-white border border-laundry-border pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-navy-deep focus:outline-none focus:ring-4 focus:ring-laundry-100 transition-all cursor-pointer"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <HiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}
