import { defineStore } from 'pinia'

const DEFAULT_MINUTES = 2
const DEFAULT_SECONDS = 0

export const useTimerStore = defineStore('timer', {
  state: () => ({
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
