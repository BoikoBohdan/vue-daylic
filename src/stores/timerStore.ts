import { defineStore } from 'pinia'

const DEFAULT_MINUTES = 2
const DEFAULT_SECONDS = 0

interface TimerState {
  minutes: number
  seconds: number
  status: 'stopped' | 'running' | 'paused' | 'ready'
}

interface TimerActions {
  setTimer(minutes: number, seconds: number): void
  startTimer(): void
  pauseTimer(): void
  stopTimer(): void
  resetTimer(): void
}

export const useTimerStore = defineStore<string, TimerState, {}, TimerActions>('timer', {
  state: (): TimerState => ({
    minutes: DEFAULT_MINUTES,
    seconds: DEFAULT_SECONDS,
    status: 'stopped',
  }),
  actions: {
    setTimer(minutes: number, seconds: number) {
      this.minutes = minutes
      this.seconds = seconds
    },
    startTimer() {
      this.status = 'running'
    },
    pauseTimer() {
      this.status = 'paused'
    },
    stopTimer() {
      this.status = 'stopped'
    },
    resetTimer() {
      this.minutes = DEFAULT_MINUTES
      this.seconds = DEFAULT_SECONDS
      this.status = 'ready'
    },
  },
  persist: true,
})
