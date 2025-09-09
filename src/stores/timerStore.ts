import { TimerService } from '@/utils'
import { defineStore } from 'pinia'

const DEFAULT_MINUTES = 2
const DEFAULT_SECONDS = 0

interface TimerState {
  minutes: number
  seconds: number
  defaultMinutes: number
  defaultSeconds: number
  status: 'stopped' | 'running' | 'paused' | 'ready'
}

export type TimerStore = ReturnType<typeof useTimerStore>

const timerService = new TimerService({
  onTickSubscribers: [],
  onFinishSubscribers: [],
})

export const useTimerStore = defineStore('timer', {
  state: (): TimerState => ({
    minutes: DEFAULT_MINUTES,
    seconds: DEFAULT_SECONDS,
    defaultMinutes: DEFAULT_MINUTES,
    defaultSeconds: DEFAULT_SECONDS,
    status: 'stopped',
  }),
  actions: {
    setTimer(minutes: number, seconds: number): void {
      this.minutes = minutes
      this.seconds = seconds
    },
    setDefaultTimer(minutes: number, seconds: number): void {
      this.defaultMinutes = minutes
      this.defaultSeconds = seconds
    },
    startTimer(minutes: number, seconds: number): void {
      timerService.start(minutes, seconds)
      this.minutes = minutes
      this.seconds = seconds
      this.status = 'running'
      timerService.onTickSubscribe((minutes: number, seconds: number) => {
        this.minutes = minutes
        this.seconds = seconds
      })
    },
    pauseTimer(): void {
      timerService.pause()
      this.status = 'paused'
    },
    stopTimer(): void {
      timerService.stop()
      this.status = 'stopped'
      this.minutes = this.defaultMinutes
      this.seconds = this.defaultSeconds
    },
    resetTimer(): void {
      timerService.stop()
      timerService.clearSubscribers()
      this.minutes = DEFAULT_MINUTES
      this.seconds = DEFAULT_SECONDS
      this.status = 'ready'
    },
  },
  persist: true,
})
