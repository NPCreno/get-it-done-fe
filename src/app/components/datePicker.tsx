"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/app/components/shadcn/button"
import { Calendar } from "@/app/components/shadcn/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/shadcn/popover"
import Image from "next/image"

interface DatePickerProps {
  date?: Date
  setDate: (date: Date) => void
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-between text-left font-normal h-[40px] rounded-[10px]",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(date, "PPP") : <span className="text-border">Pick a date</span>}
          {/* <span className="text-[#828282]">Pick a date</span> */}
          <Image src="/svgs/calendar-outline.svg" alt="calendar" width={20} height={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(day) => setDate(day as Date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
