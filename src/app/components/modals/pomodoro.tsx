import React, { useEffect, useState } from 'react';
import { IProject } from '@/app/interface/IProject';
import { ITask } from '@/app/interface/ITask';
import { useFormState } from '@/app/context/FormProvider';
import Image from 'next/image';
interface PomodoroModalProps {
  onClose: () => void;
}

export default function PomodoroModal({ 
  onClose,
}: PomodoroModalProps) {
 
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };
  window.addEventListener('keydown', handleEscapeKey);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50  "
      onClick={onClose}
    >
      <div
        className="modal-popup bg-white w-auto h-auto rounded-[10px] py-5 shadow-lg flex flex-col gap-5 bg-gradient-to-br from-[#FFE09D] to-primary-default 
        items-center justify-center px-28"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between items-center rounded-full border border-primary-default gap-[10px] h-[40px] p-[2px]">
          <button className='flex flex-row gap-[10px] items-center text-[13px] font-lato text-white rounded-full bg-primary-default h-full p-1'>
            Pomodoro
          </button>
          <button className='flex flex-row gap-[10px] items-center text-[13px] font-lato text-white'>
            Short break
          </button>
          <button className='flex flex-row gap-[10px] items-center text-[13px] font-lato text-white'>
            Long break
          </button>
        </div>
        <h1 className='text-white text-[100px] font-bold font-lato'>25:00</h1>

        <div className="relative w-[106px] h-[44px]">
            <div className="absolute top-[4px] left-0 bg-[#DEDEDE] h-[40px] w-[106px] rounded-[5px] shadow-[4px_4px_4px_rgba(0,0,0,0.2)]" />
            <button className="absolute top-0 left-0 text-primary-default text-[23px] font-bold font-lato bg-white h-[40px] w-[106px] rounded-[5px] active:translate-y-[4px] transition-transform">
                Start
            </button>
        </div>
      </div>
    </div>
  );
}