import React, { useEffect, useCallback, useMemo } from 'react';
import { useTimer } from '@/hooks/useTimer';
import type { TimerType } from '@/lib/timerService';

interface PomodoroModalProps {
  onClose: () => void;
}

interface TimerConfig {
  label: string;
  time: number;
  bgGradient: string;
  buttonColor: string;
  borderColor: string;
  textColor: string;
}

const TIMER_CONFIG: Record<TimerType, TimerConfig> = {
  pomodoro: {
    label: 'Pomodoro',
    time: 25 * 60, // 25 minutes in seconds
    bgGradient: 'from-[#FFE09D] to-primary-default',
    buttonColor: 'bg-primary-default',
    borderColor: 'border-primary-default',
    textColor: 'text-primary-default'
  },
  shortBreak: {
    label: 'Short break',
    time: 5 * 60, // 5 minutes in seconds
    bgGradient: 'from-darkBlue-100 to-darkBlue-default',
    buttonColor: 'bg-darkBlue-default',
    borderColor: 'border-darkBlue-default',
    textColor: 'text-darkBlue-default'
  },
  longBreak: {
    label: 'Long break',
    time: 15 * 60, // 15 minutes in seconds
    bgGradient: 'from-success-100 to-success-600',
    buttonColor: 'bg-success-600',
    borderColor: 'border-success-600',
    textColor: 'text-success-600'
  }
} as const;

export default function PomodoroModal({ 
  onClose,
}: PomodoroModalProps) {
  const { 
    timeLeft, 
    isActive, 
    currentTimer: activeTimer, 
    toggle, 
    pause,
    reset,
    setCurrentTimer,
    isAtDefaultTime
  } = useTimer('pomodoro');

  // Get the current timer configuration
  const currentTimer = useMemo(() => {
    return TIMER_CONFIG[activeTimer] || TIMER_CONFIG.pomodoro;
  }, [activeTimer]);
  
  // Safe timer type for rendering
  const safeTimerType = useMemo(() => 
    (activeTimer in TIMER_CONFIG ? activeTimer : 'pomodoro') as TimerType
  , [activeTimer]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  const handleTimerChange = useCallback(async (timerType: TimerType) => {
    // Only change timer type if it's different from current and valid
    if (timerType !== activeTimer && timerType in TIMER_CONFIG) {
      // If timer is active, show confirmation dialog
      if (isActive) {
        const confirmChange = window.confirm(
          `Switching to ${timerType.replace(/^\w/, c => c.toUpperCase())} mode will reset the timer. Are you sure?`
        );
        
        if (!confirmChange) {
          return; // User cancelled the switch
        }
        
        // Pause current timer and switch mode without auto-starting
        pause();
        setCurrentTimer(timerType);
      } else {
        // If timer wasn't active, just switch the mode
        setCurrentTimer(timerType);
      }
    }
  }, [activeTimer, isActive, pause, setCurrentTimer]);
  
  // Format time for display
  const displayTime = useMemo(() => {
    const mins = Math.floor(Math.max(0, timeLeft) / 60);
    const secs = Math.max(0, timeLeft % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  const toggleTimer = useCallback(() => {
    toggle();
  }, [toggle]);

  // Clean up any resources when modal is closed
  useEffect(() => {
    return () => {
      // Any cleanup if needed when component unmounts
    };
  }, []);



  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className={`modal-popup bg-white w-auto h-auto rounded-[10px] py-5 shadow-lg flex flex-col gap-5 bg-gradient-to-br ${currentTimer.bgGradient} items-center justify-center px-28 transition-all duration-500 ease-in-out`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative flex flex-row justify-between items-center rounded-full border ${currentTimer.borderColor} gap-0.5 h-[44px] p-0.5 transition-colors duration-500 overflow-hidden`}>
          {/* Background indicator that slides between buttons */}
          <div 
            className={`absolute left-0 top-0.5 h-[calc(100%-4px)] rounded-full transition-all duration-300 ease-out ${currentTimer.buttonColor}`}
            style={{
              width: `calc(${100 / Object.keys(TIMER_CONFIG).length}% - 2px)`,
              transform: `translateX(calc(${Object.keys(TIMER_CONFIG).indexOf(activeTimer) * 100}% + 1px))`
            }}
          />
          
          {(Object.entries(TIMER_CONFIG) as Array<[TimerType, TimerConfig]>).map(([key, config]) => {
            const isActive = safeTimerType === key;
            return (
              <button
                key={key}
                className={`relative z-10 flex-1 flex items-center w-20 justify-center text-[13px] font-lato rounded-full h-full transition-all duration-300 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/20'
                }`}
                onClick={() => handleTimerChange(key)}
                disabled={isActive}
              >
                {config.label}
              </button>
            );
          })}
        </div>
        <div className='relative'>
          <h1 className='text-white text-[100px] font-bold font-lato text-center'>
            {displayTime}
          </h1>
          {isActive && (
            <span className='absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white/80 text-sm font-lato'>
              {activeTimer === 'pomodoro' ? 'Time to focus!' : 'Take a break!'}
            </span>
          )}
        </div>

        
        <div className="relative w-[106px] h-[44px]">
          <div className={`absolute top-[4px] left-0 h-[40px] w-[106px] rounded-[5px] transition-colors duration-200 ${
            isAtDefaultTime ? 'bg-[#DEDEDE]' : 'bg-[#DEDEDE]'
          } shadow-[4px_4px_4px_rgba(0,0,0,0.2)]`} />
          <button 
            className={`absolute left-0 text-[23px] font-bold font-lato bg-white h-[40px] w-[106px] rounded-[5px] transition-all duration-200 ${
              isAtDefaultTime 
                ? 'translate-y-[4px] shadow-none text-gray-400' 
                : 'top-0 text-error-300 [text-shadow:0_0_8px_rgba(239,68,68,0.8)] hover:translate-y-[-2px] active:translate-y-[4px] '
            }`}
            onClick={reset}
            disabled={isAtDefaultTime}
          >
            Reset
          </button>
        </div>

        <div className="relative w-[106px] h-[44px]">
          <div className={`absolute top-[4px] left-0 h-[40px] w-[106px] rounded-[5px] transition-colors duration-200 ${
            isActive ? 'bg-gray-300' : 'bg-[#DEDEDE]'
          } shadow-[4px_4px_4px_rgba(0,0,0,0.2)]`} />
          <button 
            className={`absolute left-0 ${currentTimer.textColor} text-[23px] font-bold font-lato bg-white h-[40px] w-[106px] rounded-[5px] transition-all duration-200 ${
              isActive 
                ? 'translate-y-[4px] shadow-none' 
                : 'top-0 hover:translate-y-[-2px] active:translate-y-[4px]'
            }`}
            onClick={toggleTimer}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
}