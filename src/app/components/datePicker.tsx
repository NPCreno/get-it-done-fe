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
  customClass?: string
  placeholder?: string
}

export function DatePicker({ date, setDate, customClass, placeholder }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleDateSelect = (day: Date | undefined) => {
    if (day) {
      setDate(day as Date)
      setOpen(false)
    }
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-between text-left font-normal h-[40px] rounded-[10px]",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(date, "PPP") : <span className="text-border text-text">{placeholder}</span>}
          <Image src="/svgs/calendar-outline.svg" alt="calendar" width={20} height={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-auto p-0 ${customClass}`}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </PopoverContent>
    </Popover>
  )
}
