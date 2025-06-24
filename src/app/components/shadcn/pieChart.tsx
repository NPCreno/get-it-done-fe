"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/shadcn/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/shadcn/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/shadcn/select"

export interface PieChartData {
  title: string;
  value: number;
  fill?: string;
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
  },
  mobile: {
    label: "Mobile",
  },
  january: {
    label: "January",
    color: "var(--chart-1)",
  },
  february: {
    label: "February",
    color: "var(--chart-2)",
  },
  march: {
    label: "March",
    color: "var(--chart-3)",
  },
  april: {
    label: "April",
    color: "var(--chart-4)",
  },
  may: {
    label: "May",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

interface ChartPieInteractiveProps {
  data: PieChartData[];
  title?: string;
  description?: string;
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
  months?: {value: string; label: string}[];
}

const getMonthsUntilCurrent = () => {
  const months = [
    { value: 'january', label: 'January' },
    { value: 'february', label: 'February' },
    { value: 'march', label: 'March' },
    { value: 'april', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'june', label: 'June' },
    { value: 'july', label: 'July' },
    { value: 'august', label: 'August' },
    { value: 'september', label: 'September' },
    { value: 'october', label: 'October' },
    { value: 'november', label: 'November' },
    { value: 'december', label: 'December' }
  ];
  
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' }).toLowerCase();
  
  // Include all months up to and including the current month
  return months.slice(0, months.findIndex(m => m.value === currentMonth) + 1);
};

const defaultMonths = getMonthsUntilCurrent();

export function ChartPieInteractive({ 
  data,
  title = "Project Distribution",
  description = "Tasks by project",
  selectedMonth = defaultMonths[0].value,
  onMonthChange,
  months = defaultMonths,
}: ChartPieInteractiveProps) {
  const id = "pie-interactive";
  
  const handleMonthChange = (month: string) => {
    if (onMonthChange) {
      onMonthChange(month);
    }
  };

  return (
    <Card data-chart={id} className="flex flex-col h-full min-h-[280px]">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 p-4 pb-2">
        <div className="grid gap-0.5">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select month"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months.map((month) => (
              <SelectItem
                key={month.value}
                value={month.value}
                className="rounded-lg [&_span]:flex  cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-xs"
                    style={{
                      backgroundColor: `var(--color-${month.value})`,
                    }}
                  />
                  {month.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-4 pt-0 pb-2 flex-1 flex items-center">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="w-full h-full max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="title"
              innerRadius={60}
              strokeWidth={5}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const total = data.reduce((sum, item) => sum + item.value, 0);
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Completed Tasks
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
