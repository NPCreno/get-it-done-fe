// Timer configuration
const TimerConfigValues = {
  pomodoro: 25 * 60,    // 25 minutes in seconds
  shortBreak: 5 * 60,   // 5 minutes in seconds
  longBreak: 15 * 60    // 15 minutes in seconds
} as const;

// Types
export type TimerType = keyof typeof TimerConfigValues;

export type TimerConfigType = typeof TimerConfigValues;
export const TimerConfig: TimerConfigType = TimerConfigValues;

export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  currentTimer: TimerType;
}

type Subscriber = (state: TimerState) => void;

export class TimerService {
  private static instance: TimerService;
  private subscribers: Subscriber[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private endTime: number | null = null;
  private isRunning: boolean = false;
  private currentTimeLeft: number = TimerConfig.pomodoro;
  private currentTimerType: TimerType = 'pomodoro';
  private audio: HTMLAudioElement;

  private constructor() {
    this.audio = new Audio();
    this.loadState();
    window.addEventListener('beforeunload', () => this.saveState());
  }

  public static getInstance(): TimerService {
    if (!TimerService.instance) {
      TimerService.instance = new TimerService();
    }
    return TimerService.instance;
  }

  private notifySubscribers(): void {
    const state = this.getCurrentState();
    this.subscribers.forEach(subscriber => subscriber(state));
  }

  private async playSound(url: string): Promise<void> {
    try {
      this.audio.src = url;
      this.audio.volume = 0.5;
      await this.audio.play();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  private saveState(): void {
    try {
      const state = {
        endTime: this.endTime,
        isRunning: this.isRunning,
        currentTimerType: this.currentTimerType,
        currentTimeLeft: this.currentTimeLeft,
        savedAt: Date.now()
      };
      localStorage.setItem('pomodoroTimerState', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save timer state:', error);
    }
  }
  
  public cleanup(): void {
    this.pause();
    this.subscribers = [];
  }

  public start(timerType: TimerType, duration: number = TimerConfig[timerType]): void {
    // If we're already running, just update the timer type if it changed
    if (this.isRunning && this.intervalId) {
      if (this.currentTimerType !== timerType) {
        this.currentTimerType = timerType;
        this.currentTimeLeft = duration;
        this.endTime = Date.now() + (this.currentTimeLeft * 1000);
      }
      return;
    }

    // If we're resuming from pause, use the current time left
    const timeToUse = this.currentTimerType === timerType && this.currentTimeLeft > 0 
      ? this.currentTimeLeft 
      : duration;

    this.pause();
    this.currentTimerType = timerType;
    this.currentTimeLeft = timeToUse;
    this.isRunning = true;
    this.endTime = Date.now() + (timeToUse * 1000);
    
    this.intervalId = setInterval(() => this.tick(), 1000);
    this.playSound('/soundfx/start.mp3');
    this.notifySubscribers();
    this.saveState();
  }

  public pause(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.notifySubscribers();
    this.saveState();
  }

  public reset(timerType: TimerType = this.currentTimerType): void {
    this.pause();
    this.currentTimerType = timerType;
    this.currentTimeLeft = TimerConfig[timerType];
    this.isRunning = false;
    this.endTime = null;
    this.notifySubscribers();
    this.saveState();
  }

  public toggle(timerType: TimerType = this.currentTimerType): void {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start(timerType);
    }
  }

  public setTimerType(timerType: TimerType): void {
    if (this.currentTimerType !== timerType) {
      this.currentTimerType = timerType;
      this.currentTimeLeft = TimerConfig[timerType];
      this.notifySubscribers();
      this.saveState();
    }
  }

  public subscribe(callback: Subscriber): () => void {
    this.subscribers.push(callback);
    // Immediately send current state to new subscriber
    callback(this.getCurrentState());
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  public getCurrentState(): TimerState {
    return {
      timeLeft: this.currentTimeLeft,
      isRunning: this.isRunning,
      currentTimer: this.currentTimerType
    };
  }

  private tick(): void {
    if (!this.endTime) return;
    
    const now = Date.now();
    const timeLeft = Math.ceil((this.endTime - now) / 1000);
    
    if (timeLeft <= 0) {
      this.currentTimeLeft = 0;
      this.pause();
      // Play alarm when timer ends
      this.playSound('/soundfx/alarm.mp3');
    } else {
      this.currentTimeLeft = timeLeft;
    }
    
    this.notifySubscribers();
  }

  private loadState(): void {
    try {
      const saved = localStorage.getItem('pomodoroTimerState');
      if (!saved) return;

      const state = JSON.parse(saved) as {
        isRunning: boolean;
        endTime: number | null;
        currentTimeLeft: number;
        currentTimerType: TimerType;
        savedAt: number;
      };

      // Don't restore if the state is too old (e.g., > 24 hours)
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      const isStateTooOld = Date.now() - (state.savedAt || 0) > TWENTY_FOUR_HOURS;
      
      if (isStateTooOld) {
        this.resetToDefault();
        return;
      }

      const timePassed = Math.floor((Date.now() - state.savedAt) / 1000);
      
      if (state.isRunning && state.endTime) {
        this.currentTimeLeft = Math.max(0, state.currentTimeLeft - timePassed);
        if (this.currentTimeLeft > 0) {
          this.endTime = Date.now() + (this.currentTimeLeft * 1000);
          this.start(state.currentTimerType, this.currentTimeLeft);
        } else {
          this.resetToDefault();
        }
      } else {
        this.currentTimeLeft = Math.max(0, state.currentTimeLeft - timePassed);
        this.currentTimerType = state.currentTimerType;
        this.isRunning = false;
        this.notifySubscribers();
      }
    } catch (error) {
      console.error('Failed to load timer state:', error);
      this.resetToDefault();
    }
  }

  private resetToDefault(): void {
    this.currentTimeLeft = TimerConfig.pomodoro;
    this.currentTimerType = 'pomodoro';
    this.isRunning = false;
    this.endTime = null;
    this.notifySubscribers();
    this.saveState();
  }
}

// Export a singleton instance
export const timerService = TimerService.getInstance();
