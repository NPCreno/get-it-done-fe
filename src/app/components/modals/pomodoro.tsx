import React, { useEffect, useState } from 'react';

type TimerType = 'pomodoro' | 'shortBreak' | 'longBreak';

interface PomodoroModalProps {
  onClose: () => void;
}

const TimerConfig = {
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
};

export default function PomodoroModal({ 
  onClose,
}: PomodoroModalProps) {
  const [activeTimer, setActiveTimer] = useState<TimerType>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(TimerConfig.pomodoro.time);
  const [isActive, setIsActive] = useState(false);
 
  const currentTimer = TimerConfig[activeTimer];

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  };
  window.addEventListener("keydown", handleEscapeKey);

  const handleTimerChange = (timerType: TimerType) => {
    setActiveTimer(timerType);
    setTimeLeft(TimerConfig[timerType].time);
    setIsActive(false);
  };

  // Sound effect for starting the timer
  const playStartSound = () => {
    const audio = new Audio('/soundfx/start.mp3');
    audio.volume = 0.5; // Set volume to 50%
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval!);
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    const newIsActive = !isActive;
    setIsActive(newIsActive);
    
    // Play sound when starting the timer
    if (newIsActive) {
      playStartSound();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
              width: `calc(${100 / Object.keys(TimerConfig).length}% - 2px)`,
              transform: `translateX(calc(${Object.keys(TimerConfig).indexOf(activeTimer) * 100}% + 1px))`
            }}
          />
          
          {Object.entries(TimerConfig).map(([key, config]) => {
            const isActive = activeTimer === key;
            return (
              <button
                key={key}
                className={`relative z-10 flex-1 flex items-center w-20 justify-center text-[13px] font-lato rounded-full h-full transition-all duration-300 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/20'
                }`}
                onClick={() => handleTimerChange(key as TimerType)}
              >
                {config.label}
              </button>
            );
          })}
        </div>
        <div className='relative'>
          <h1 className='text-white text-[100px] font-bold font-lato text-center'>
            {formatTime(timeLeft)}
          </h1>
          {isActive && (
            <span className='absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white/80 text-sm font-lato'>
              {activeTimer === 'pomodoro' ? 'Time to focus!' : 'Take a break!'}
            </span>
          )}
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