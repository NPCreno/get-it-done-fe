export default function ChartCard({
  header,
  delay,
}: {
  header: string;
  delay: string;
}) {
  return (
    <div
      className={`p-5 flex flex-col gap-[10px] justify-start items-start bg-white rounded-[10px] w-full h-[210px]
      hover:shadow-[0px_2px_5.1px_-1px_rgba(0,0,0,0.25)] transition-all duration-300 fade-in-left ${delay}`}
    >
      <span className="text-text text-[13px] font-lato">{header}</span>
      <div className="w-full h-full rounded-[10px] bg-background"></div>
    </div>
  );
}
