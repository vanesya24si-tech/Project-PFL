import IconCircle from "./IconCircle";

export default function InsightCard({ title, description, highlight }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-laundry-border flex flex-col md:flex-row items-center gap-8 shadow-sm">
      <IconCircle>💡</IconCircle>
      <div>
        <h4 className="text-2xl font-bold text-navy-deep">{title}</h4>
        <p className="text-slate-600 mt-2 leading-relaxed">
          {description.split(highlight).map((part, index, arr) => (
            <span key={index}>
              {part}
              {index < arr.length - 1 && (
                <span className="font-bold text-aqua-bright">{highlight}</span>
              )}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
