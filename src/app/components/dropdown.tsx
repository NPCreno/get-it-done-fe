"use client"

import * as React from "react"
import Image from "next/image"
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
  options: {
    name: string;
    color?: string;
  }[]
  selectedOption: {
    name: string;
    color?: string;
  }
  setSelectedOption: (option: {name: string, color?: string}) => void
}

export function CustomDropdownMenu({
  options,
  selectedOption,
  setSelectedOption,
}: CustomDropdownMenuProps) {

  const currentSelectedColor = options.find(option => option.name === selectedOption.name)?.color;
  return (
    <div className="w-full relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
          variant="outline"
          className="w-full h-[40px] rounded-[10px] justify-between text-text"
        >
          <div className="flex flex-row items-center justify-between w-full">
            {selectedOption.name != "" ? (
              <div className="flex flex-row items-center">
                {currentSelectedColor && 
                <div className={`w-[10px] h-[10px] rounded-full mr-4`} 
                style={{backgroundColor: currentSelectedColor}}
                ></div>} 
                <span className="text-sm font-normal font-lato text-text">{selectedOption.name}</span>
              </div>
            ) : (
              <span className="text-sm font-normal font-lato text-text">Select color</span>
            )}
            <Image src="/svgs/dropdown.svg" alt="dropdown" width={20} height={10}/>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[220px] max-h-[286px] overflow-y-auto absolute" side="bottom" align="start" sideOffset={4}>
        <DropdownMenuRadioGroup
          value={selectedOption.name}
          onValueChange={(value) => {
            const selected = options.find(option => option.name === value);
            if (selected) {
              setSelectedOption({
                name: selected.name,
                color: selected.color
              });
            }
          }}
        >
          {options.map((option) => (
            <>
              <DropdownMenuRadioItem key={option.name} value={option.name}>
                {option.name != "" ? (
                  <>
                    {option.color && 
                    <div className={`w-[10px] h-[10px] rounded-full mr-4`} 
                    style={{backgroundColor: option.color}}
                    ></div>} 
                    {option.name}
                  </>
                ) : (
                  <>
                    <span className="text-sm font-normal font-lato">Select an option</span>
                  </>
                )}
              </DropdownMenuRadioItem>
            </>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )
}
