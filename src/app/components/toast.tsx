"use client";
import Image from "next/image";
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
          <Image
            src="/svgs/close.svg"
            alt="close"
            width={16}
            height={16}
            className="cursor-pointer"
            onClick={() => onClose?.()}
          />
        )}
      </div>
      <span className="font-lato text-base font-normal text-text">{description}</span>
    </div>
  );
}
