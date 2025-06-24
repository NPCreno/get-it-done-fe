"use client";

import * as React from "react";
import { ChartAreaGradient } from "./shadcn/areaChart";
import Image from "next/image";
import { ChartPieInteractive } from "./shadcn/pieChart";
import MonthlyHeatmap from "./MonthlyHeatmap";
import { subDays, format } from 'date-fns';
import { CardTitle } from "./shadcn/card";
import { renderStreakCounter } from "./streakCounter";

export default function ChartCard({
  header,
  delay,
  streakCount = 0, // Default to 0 if not provided
}: {
  header: string;
  delay: string;
  streakCount?: number;
}) {
  // Generate sample heatmap data for the last 30 days
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = subDays(today, i);
      data.push({
        date: format(date, 'yyyy-MM-dd'),
        count: Math.floor(Math.random() * 5) // 0-4 tasks per day
      });
    }
    
    return data;
  };

  const heatmapData = generateHeatmapData();

  // Task completion trend data (hardcoded for now)
  const taskCompletionData = [
    { day: "Mon", completed: 8, pending: 5 },
    { day: "Tue", completed: 10, pending: 7 },
    { day: "Wed", completed: 6, pending: 3 },
    { day: "Thu", completed: 9, pending: 8 },
    { day: "Fri", completed: 7, pending: 6 },
    { day: "Sat", completed: 5, pending: 4 },
    { day: "Sun", completed: 4, pending: 2 },
  ];

  // Sample project data by month with enhanced contrast pastel colors
  const projectDataByMonth: Record<string, Array<{ title: string; value: number; fill: string }>> = {
    january: [
      { title: "Project Alpha", value: 20, fill: "#8CD9C2" }, // Darker mint green
      { title: "Project Beta", value: 30, fill: "#A5B3E6" },  // Darker periwinkle
      { title: "Project Gamma", value: 15, fill: "#FFC6A5" }, // Darker peach
      { title: "Project Delta", value: 35, fill: "#C6E0A5" }  // Darker tea green
    ],
    february: [
      { title: "Project Alpha", value: 25, fill: "#FF9E9A" }, // Darker melon
      { title: "Project Beta", value: 35, fill: "#8CD9C2" },  // Darker mint green
      { title: "Project Gamma", value: 20, fill: "#A5B3E6" }, // Darker periwinkle
      { title: "Project Delta", value: 40, fill: "#FFC6A5" }  // Darker peach
    ],
    march: [
      { title: "Project Alpha", value: 30, fill: "#C6E0A5" }, // Darker tea green
      { title: "Project Beta", value: 25, fill: "#FF9E9A" },  // Darker melon
      { title: "Project Gamma", value: 25, fill: "#8CD9C2" }, // Darker mint green
      { title: "Project Delta", value: 20, fill: "#A5B3E6" }  // Darker periwinkle
    ],
    april: [
      { title: "Project Alpha", value: 15, fill: "#FFC6A5" }, // Darker peach
      { title: "Project Beta", value: 40, fill: "#C6E0A5" },  // Darker tea green
      { title: "Project Gamma", value: 30, fill: "#FF9E9A" }, // Darker melon
      { title: "Project Delta", value: 25, fill: "#8CD9C2" }  // Darker mint green
    ],
    may: [
      { title: "Project Alpha", value: 20, fill: "#A5B3E6" }, // Darker periwinkle
      { title: "Project Beta", value: 25, fill: "#FFC6A5" },  // Darker peach
      { title: "Project Gamma", value: 35, fill: "#C6E0A5" }, // Darker tea green
      { title: "Project Delta", value: 30, fill: "#FF9E9A" }  // Darker melon
    ],
    june: [
      { title: "Project Alpha", value: 20, fill: "#8CD9C2" }, // Darker mint green
      { title: "Project Beta", value: 25, fill: "#A5B3E6" },  // Darker periwinkle
      { title: "Project Gamma", value: 35, fill: "#FFC6A5" }, // Darker peach
      { title: "Project Delta", value: 30, fill: "#C6E0A5" }  // Darker tea green
    ]
  };

  const [selectedMonth, setSelectedMonth] = React.useState('january');
  
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const taskDistributionData = {
    data: projectDataByMonth[selectedMonth] || [],
    title: "Task Distribution",
    description: `Completed Tasks by project (${selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)})`
  };


  const renderChart = () => {
    switch (header) {
      case "Task Completion Trend":
        return (
          <div className="w-full h-full">
            <ChartAreaGradient 
              data={taskCompletionData}
              colors={{
                completed: "#53D86A",
                pending: "#FED580"
              }}
            />
          </div>
        );
      case "Task Distribution by project":
        return (
          <div className="w-full h-full">
            <ChartPieInteractive 
              data={taskDistributionData.data}
              title={taskDistributionData.title}
              description={taskDistributionData.description}
              selectedMonth={selectedMonth}
              onMonthChange={handleMonthChange}
            />
          </div>
        );
      case "Productivity Streak":
        return renderStreakCounter(streakCount, header);
      case "Calendar Heat map":
        return (
          <div className="w-full h-full p-4 bg-white rounded-[10px] shadow-[0px_2px_5.1px_-1px_rgba(0,0,0,0.25)] hover:shadow-[0px_2px_5.1px_-1px_rgba(0,0,0,0.25)] transition-all duration-300 fade-in-left">
            <CardTitle>{header}</CardTitle>
            <MonthlyHeatmap 
              values={heatmapData}
              onDateClick={(date) => {
                // Handle date click if needed
                console.log('Date clicked:', date);
              }}
              className="h-full"
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
