"use client";

import { ChartAreaGradient } from "./shadcn/areaChart";
import Image from "next/image";

export default function ChartCard({
  header,
  delay,
}: {
  header: string;
  delay: string;
}) {
  // Task completion trend data (hardcoded for now)
  const taskData = [
    { day: "Mon", completed: 8, pending: 5 },
    { day: "Tue", completed: 10, pending: 7 },
    { day: "Wed", completed: 6, pending: 3 },
    { day: "Thu", completed: 9, pending: 8 },
    { day: "Fri", completed: 7, pending: 6 },
    { day: "Sat", completed: 5, pending: 4 },
    { day: "Sun", completed: 4, pending: 2 },
  ];

  const renderChart = () => {
    switch (header) {
      case "Task Completion Trend":
        return (
          <div className="w-full h-full">
            <ChartAreaGradient 
              data={taskData}
              colors={{
                completed: "#53D86A",
                pending: "#FED580"
              }}
            />
          </div>
        );
      default:
        return (
          <div
      className={`p-5 flex flex-col gap-[10px] justify-start items-start bg-white rounded-[10px] w-full h-full
      hover:shadow-[0px_2px_5.1px_-1px_rgba(0,0,0,0.25)] transition-all duration-300 fade-in-left ${delay}`}
    >
      <span className="text-text text-[13px] font-lato">{header}</span>
      <div className="w-full h-full rounded-[10px] bg-background flex items-center justify-center flex-col">
        <Image
        src={"/svgs/under-development.svg"}
        height={100}
        width={100}
        alt="Coming soon"
        className="opacity-20"
        />
        Coming soon
        </div>
    </div>
        );
    }
  };

  return (
    <div
    className={`flex flex-col gap-[10px] justify-start items-start bg-white rounded-[10px] w-full h-full
    hover:shadow-[0px_2px_5.1px_-1px_rgba(0,0,0,0.25)] transition-all duration-300 fade-in-left ${delay}`}
  >
    <div className="w-full h-full bg-background">
      {renderChart()}
    </div>
  </div>
  );
}
