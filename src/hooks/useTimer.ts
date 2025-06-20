import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerType, TimerState } from '@/lib/timerService';
import { timerService, TimerConfig } from '@/lib/timerService';

interface UseTimerReturn {
  timeLeft: number;
  isActive: boolean;
  currentTimer: TimerType;
  isAtDefaultTime: boolean;
  toggle: (timerType?: TimerType) => void;
  start: (timerType?: TimerType) => void;
  pause: () => void;
  reset: () => void;
  setCurrentTimer: (timerType: TimerType) => void;
}

export const useTimer = (initialTimerType: TimerType): UseTimerReturn => {
  const initialTimerRef = useRef(initialTimerType);
  const [currentTimer, setCurrentTimer] = useState<TimerType>(initialTimerType);
  const [timeLeft, setTimeLeft] = useState(timerService.getCurrentState().timeLeft);
  const [isActive, setIsActive] = useState(timerService.getCurrentState().isRunning);

  // Subscribe to timer updates
  useEffect(() => {
    const handleStateUpdate = (state: TimerState) => {
      setTimeLeft(state.timeLeft);
      setIsActive(state.isRunning);
      setCurrentTimer(state.currentTimer);
    };

    // Initial state
    handleStateUpdate(timerService.getCurrentState());
    
    // Subscribe to updates
    const unsubscribe = timerService.subscribe(handleStateUpdate);

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Update timer type when it changes
  useEffect(() => {
    if (!isActive && initialTimerRef.current !== initialTimerType) {
      timerService.setTimerType(initialTimerType);
      initialTimerRef.current = initialTimerType;
    }
  }, [initialTimerType, isActive]);

  const toggle = useCallback((timerType: TimerType = currentTimer) => {
    timerService.toggle(timerType);
  }, [currentTimer]);

  const start = useCallback((timerType: TimerType = currentTimer) => {
    timerService.start(timerType);
  }, [currentTimer]);

  const pause = useCallback(() => {
    timerService.pause();
  }, []);

  const setCurrentTimerType = useCallback((timerType: TimerType) => {
    timerService.setTimerType(timerType);
  }, []);

  const reset = useCallback(() => {
    timerService.reset(currentTimer);
  }, [currentTimer]);

  // Check if current time is at default for the current timer type
  const isAtDefaultTime = timeLeft === TimerConfig[currentTimer];

  return {
    timeLeft,
    isActive,
    currentTimer,
    isAtDefaultTime,
    toggle,
    start,
    pause,
    reset,
    setCurrentTimer: setCurrentTimerType,
  };
};
