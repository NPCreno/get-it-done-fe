"use client";

import * as React from "react";
import { ChartAreaGradient } from "./shadcn/areaChart";
import Image from "next/image";
import { ChartPieInteractive } from "./shadcn/pieChart";
import MonthlyHeatmap from "./MonthlyHeatmap";
import { subDays, format } from 'date-fns';
import { CardTitle } from "./shadcn/card";
import StreakCounter from "./streakCounter";
import { ITaskCompletionTrendData } from "../interface/ITaskCompletionTrendData";

export default function ChartCard({
  header,
  delay,
  streakCount = 0, // Default to 0 if not provided
  taskCompletionData,
}: {
  header: string;
  delay: string;
  streakCount?: number;
  taskCompletionData?: ITaskCompletionTrendData[];
}) {
  // Generate more realistic heatmap data with weekly patterns
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = subDays(today, i);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Generate more realistic data with weekly patterns
      let count;
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekends
        count = Math.floor(Math.random() * 3); // 0-2 tasks on weekends
      } else {
        count = Math.floor(Math.random() * 8); // 0-7 tasks on weekdays
      }
      
      data.unshift({ // Add to beginning to maintain chronological order
        date: format(date, 'yyyy-MM-dd'),
        count
      });
    }
    
    return data;
  };

  const heatmapData = generateHeatmapData();

  // // Task completion trend data (hardcoded for now)
  // const taskCompletionData = [
  //   { day: "Mon", completed: 8 },
  //   { day: "Tue", completed: 10 },
  //   { day: "Wed", completed: 6 },
  //   { day: "Thu", completed: 9 },
  //   { day: "Fri", completed: 7 },
  //   { day: "Sat", completed: 5 },
  //   { day: "Sun", completed: 4 },
  // ];

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

  const [selectedMonth, setSelectedMonth] = React.useState('june'); // Default to current month
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleMonthChange = (month: string) => {
    setIsLoading(true);
    // Simulate data loading
    setTimeout(() => {
      setSelectedMonth(month);
      setIsLoading(false);
    }, 300);
  };

  const taskDistributionData = {
    data: projectDataByMonth[selectedMonth] || [],
    title: "Task Distribution",
    description: `Completed Tasks by project (${selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)})`
  };


  const renderLoadingState = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const renderNoDataState = () => (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
      <Image
        src={"/svgs/no-data.svg"}
        height={80}
        width={80}
        alt="No data available"
        className="opacity-50 mb-2"
      />
      <p className="text-gray-500 text-sm">No data available</p>
    </div>
  );

  const renderChart = () => {
    if (isLoading) return renderLoadingState();
    
    switch (header) {
      case "Task Completion Trend":
        if (!taskCompletionData || taskCompletionData.length === 0) {
          return renderNoDataState();
        }
        return (
          <div className="w-full h-full">
            <ChartAreaGradient 
              data={taskCompletionData}
              colors={{
                completed: "#53D86A",
              }}
              aria-label={`Task completion trend chart showing ${taskCompletionData.length} days of data`}
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
        return <StreakCounter streakCount={streakCount} header={header} />;
      case "Calendar Heat map":
        return (
          <div className="w-full h-full p-4 bg-white rounded-[10px] shadow-[0px_2px_5.1px_-1px_rgba(0,0,0,0.25)] hover:shadow-[0px_2px_5.1px_-1px_rgba(0,0,0,0.25)] transition-all duration-300 fade-in-left">
            <CardTitle>{header}</CardTitle>
            <MonthlyHeatmap 
              values={heatmapData}
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
      className={`relative flex flex-col gap-[10px] justify-start items-start bg-white rounded-[10px] w-full h-full min-h-[300px]
      hover:shadow-[0px_2px_5.1px_-1px_rgba(0,0,0,0.25)] transition-all duration-300 fade-in-left ${delay}`}
      role="region"
      aria-label={`${header} chart`}
    >
      <div className="w-full h-full bg-background rounded-[10px] overflow-hidden">
        {renderChart()}
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
