"use client";

import * as React from "react";
import { ChartAreaGradient } from "./shadcn/areaChart";
import Image from "next/image";
import { ChartPieInteractive } from "./shadcn/pieChart";
import { DotLottie } from '@lottiefiles/dotlottie-web';

export default function ChartCard({
  header,
  delay,
  streakCount = 0, // Default to 0 if not provided
}: {
  header: string;
  delay: string;
  streakCount?: number;
}) {
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

  // Initialize Lottie animation when component mounts (for 8+ day streaks)
  React.useEffect(() => {
    if (streakCount > 7) {
      const canvas = document.querySelector('#fire-animation-canvas') as HTMLCanvasElement | null;
      if (canvas) {
        const dotLottie = new DotLottie({
          autoplay: true,
          loop: true,
          canvas: canvas,
          src: "https://lottie.host/b903d801-3895-4a94-9340-c59c8e989e28/1fi7YdANEj.lottie",
        });
        
        return () => {
          // Cleanup Lottie animation on unmount
          dotLottie.destroy();
        };
      }
    }
  }, [streakCount]);

  // Render the fire icon with streak counter
  const renderStreakCounter = () => {
    const isInactive = streakCount === 0;
    const isActive = streakCount > 0 && streakCount < 6;
    const isOnFire = streakCount > 5 && streakCount < 8;
    const isOnFirePlus = streakCount > 7;

    // Different messages based on streak count
    let streakMessage = "Start your streak today!";
    let progressMessage = "Complete a task to begin";
    let progressWidth = 0;
    
    if (isActive) {
      streakMessage = ` ${streakCount}-Day Streak!`;
      progressMessage = `Complete a task to continue your streak`;
      // Calculate progress as a fraction of 7 days
      progressWidth = Math.min(100, Math.floor((streakCount / 7) * 100));
    } else if (isOnFire) {
      streakMessage = ` ${streakCount}-Day Streak!`;
      progressMessage = `You're on fire! Keep it up!`;
      // Only show full width at 7 days
      progressWidth = streakCount === 7 ? 100 : Math.floor((6 / 7) * 100);
    } else if (isOnFirePlus) {
      streakMessage = ` ${streakCount}-Day Streak!`;
      progressMessage = `Amazing streak! Keep it going!`;
      progressWidth = 100;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center bg-white rounded-[10px] shadow-[0px_2px_5.1px_-1px_rgba(0,0,0,0.25)]">
        <div className="relative mb-4">
          {isOnFirePlus ? (
            <div id="fire-animation-container" className="relative w-16 h-16">
              <canvas id="fire-animation-canvas" className="w-full h-full" />
              <div className="absolute -bottom-2 -right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10">
                {streakCount}
              </div>
            </div>
          ) : (
            <>
              <style jsx>{`
                @keyframes flicker {
                  0%, 100% {
                    filter: drop-shadow(0 0 4px rgba(255, 92, 92, 0.5));
                    transform: scale(1);
                  }
                  50% {
                    filter: drop-shadow(0 0 8px rgba(255, 165, 0, 0.7));
                    transform: scale(1.05);
                  }
                }
                .fire-animation {
                  animation: ${isOnFire ? 'flicker 1.5s infinite alternate' : 'none'};
                  transform-origin: center;
                }
              `}</style>
              <div className="fire-animation">
                {isInactive ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 448 512"
                className="w-16 h-16 text-gray-300"
              >
                <path 
                  fill="currentColor" 
                  d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z"
                />
              </svg>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 448 512"
                    className={`w-16 h-16 ${isOnFire ? 'text-orange-500' : 'text-orange-400'}`}
                  >
                    <path 
                      fill="currentColor" 
                      d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z"
                    />
                  </svg>
                )}
              </div>
            </>
          )}
          {!isInactive && !isOnFirePlus && (
            <div className={`absolute -top-2 -right-2 ${
              isOnFire ? 'bg-red-500' : 'bg-blue-500'
            } text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold`}>
              {streakCount}
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{streakMessage}</h3>
        <p className="text-gray-600 mb-4">{progressMessage}</p>
        {!isInactive && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${isOnFire || isOnFirePlus ? 'bg-red-500' : 'bg-orange-400'}`} 
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {isOnFire 
                ? 'Amazing! Keep the streak going!' 
                : `Complete a task to continue your streak`
              }
            </p>
          </>
        )}
      </div>
    );
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
        return renderStreakCounter();
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
