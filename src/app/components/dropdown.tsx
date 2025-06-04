"use client"

import * as React from "react"
import { Button } from "@/app/components/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/app/components/shadcn/dropdown-menu"

interface CustomDropdownMenuProps {
  options: {
    name: string;
    color?: string;
    project_id?: string;
  }[]
  selectedOption: {
    name: string;
    color?: string;
    project_id?: string;
  }
  setSelectedOption: (option: {name: string, color?: string, project_id?: string}) => void
  placeholder: string;
  disabled?: boolean;
}

export function CustomDropdownMenu({
  options,
  selectedOption,
  setSelectedOption,
  placeholder,
  disabled,
}: CustomDropdownMenuProps) {

  const currentSelectedColor = options.find(option => option.name === selectedOption.name)?.color;

  return (
    <div className="w-full relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
          variant="outline"
          className="w-full h-[40px] rounded-[10px] justify-between text-text"
          disabled={disabled}
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
              <span className="text-sm font-normal font-lato text-text">{placeholder}</span>
            )}
            <svg width="20" height="10" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 0.5L10.2683 10.5L21 0.5" stroke="#333333"/>
            </svg>

          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[244px] max-h-[286px] overflow-y-auto absolute" side="bottom" align="start" sideOffset={4}>
        <DropdownMenuRadioGroup
          value={selectedOption.name}
          onValueChange={(value) => {
            const selected = options.find(option => option.name === value);
            if (selected) {
              setSelectedOption({
                name: selected.name,
                color: selected.color,
                project_id: selected.project_id
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
