export default function StatsCard({
  icon,
  header,
  content,
  delay,
}: {
  icon: string;
  header: string;
  content: string;
  delay: string;
}) {
  return (
    <div
      className={`px-6 flex flex-row justify-start items-center gap-8 bg-white rounded-[10px] w-full h-[100px]
      hover:shadow-[0px_2px_5.1px_-1px_rgba(0,0,0,0.25)] transition-all duration-300 fade-in-left ${delay}`}
    >
      <img src={icon} alt={header} />
      <div className="flex flex-col justify-start">
        <span className="text-[#838383] text-base font-bold font-lato">
          {header}
        </span>
        <span className="text-text text-[28px] font-lato">{content}</span>
      </div>
    </div>
  );
}
