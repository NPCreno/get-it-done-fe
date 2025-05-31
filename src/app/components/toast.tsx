"use client";
import { useState } from "react";

interface ToastProps {
  className?: string;
  title: string;
  description: string;
  onClose?: () => void;
  animationClass?: string;
}

export function Toast({
  title,
  description,
  className,
  onClose,
  animationClass,
}: ToastProps) {
  const [showExit, setShowExit] = useState(false);

  return (
    <div
      className={`flex flex-col gap-[10px] p-[10px] rounded-md bg-white border border-[#CCCCCC] shadow-md ${animationClass || ''}`}
      onMouseEnter={() => setShowExit(true)}
      onMouseLeave={() => setShowExit(false)}
    >
      <div className="flex flex-row justify-between">
        <span className={`font-lato text-base font-bold ${className}`}>{title}</span>
        {showExit && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.5 4.50098L4.5 11.501M11.5 11.501L4.5 4.50098L11.5 11.501Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        )}
      </div>
      <span className="font-lato text-base font-normal text-text">{description}</span>
    </div>
  );
}
