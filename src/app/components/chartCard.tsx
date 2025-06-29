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
import { ITaskDistribution } from "../interface/ITaskDistribution";
import { Database } from 'lucide-react';

interface ChartCardProps {
  header: string;
  delay: string;
  streakCount?: number;
  taskCompletionData?: ITaskCompletionTrendData[];
  taskDistributionData?: ITaskDistribution[];
}

export default function ChartCard({
  header,
  delay,
  streakCount = 0, // Default to 0 if not provided
  taskCompletionData = [],
  taskDistributionData = [],
}: ChartCardProps) {
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

  const [isLoading, setIsLoading] = React.useState(false);
  
  const renderLoadingState = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const renderNoDataState = () => (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-white">
      <Database className="h-16 w-16 text-gray-400 mb-2" />
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
        if (!taskDistributionData || taskDistributionData.length === 0 || taskDistributionData.every(task => task.value === 0)) {
          return renderNoDataState();
        }
        return (
          <div className="w-full h-full">
            <ChartPieInteractive 
              data={taskDistributionData}
              title="Task Distribution"
              description="Completed tasks by project"
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
      hover:shadow-[0px_2px_5.1px_-1px_rgba(0,0,0,0.25)] transition-all duration-300 fade-in-left ${delay} group`}
      role="region"
      aria-label={`${header} chart`}
    >
      <div className="w-full h-full bg-background rounded-[10px] overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary-500"></div>
          </div>
        ) : (
          <div className="h-full transform transition-all duration-300 group-hover:scale-[1.01]">
            {renderChart()}
          </div>
        )}
      </div>
      
      {/* Subtle hover effects */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 bg-primary-100 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
    </div>
  );
}
