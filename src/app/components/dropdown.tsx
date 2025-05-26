"use client"

import * as React from "react"

import { Button } from "@/app/components/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/shadcn/dropdown-menu"

interface CustomDropdownMenuProps {
  options: string[]
  selectedOption: string
  setSelectedOption: (option: string) => void
}

export function CustomDropdownMenu({
  options,
  selectedOption,
  setSelectedOption,
}: CustomDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-[40px] rounded-[10px] justify-between text-[#828282]"
        >
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel >Select Option</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedOption}
          onValueChange={setSelectedOption}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
