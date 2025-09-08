<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTimerStore } from '@/stores/timerStore'
import { Timer, TimerPip } from './utils'

const timerStore = useTimerStore()
const timer = new Timer({})
const timerPip = new TimerPip()

const { minutes, seconds, status } = storeToRefs(timerStore)
const currentTime = ref({
  minutes: minutes.value,
  seconds: seconds.value,
})
watch([minutes, seconds], ([newMinutes, newSeconds]) => {
  currentTime.value.minutes = newMinutes
  currentTime.value.seconds = newSeconds
})

const updateTimer = (value: 'minutes' | 'seconds', operation: 'increment' | 'decrement') => {
  if (value === 'minutes') {
    if (operation === 'increment' && minutes.value < 59) {
      timerStore.setTimer(minutes.value + 1, seconds.value)
    } else if (operation === 'decrement' && minutes.value > 0) {
      timerStore.setTimer(minutes.value - 1, seconds.value)
    }
  } else {
    if (operation === 'increment' && seconds.value < 59) {
      timerStore.setTimer(minutes.value, seconds.value + 1)
    } else if (operation === 'decrement' && seconds.value > 0) {
      timerStore.setTimer(minutes.value, seconds.value - 1)
    }
  }
}

const startTimer = () => {
  status.value = 'running'
  timer.stop()
  timer.start(currentTime.value.minutes, currentTime.value.seconds)
  timerPip.showPip()
  timer.onFinishSubscribe(() => {
    document.title = 'Sync - Time’s up!'
    currentTime.value.minutes = minutes.value
    currentTime.value.seconds = seconds.value
    status.value = 'stopped'
    timerPip.destroy()
  })
  timer.onTickSubscribe((minutes, seconds) => {
    document.title = `Sync -Timer -${minutes}:${seconds.toString().padStart(2, '0')}`
    currentTime.value.minutes = minutes
    currentTime.value.seconds = seconds
    timerPip.drawPip(minutes, seconds)
  })
}

const pauseTimer = () => {
  timer.pause()
  status.value = 'paused'
}

const stopTimer = () => {
  timer.stop()
}

const formatTime = (mins: number, secs: number) => {
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  timer.stop()
  status.value = 'stopped'
})

</script>

<template>
  <div class="timer-settings">
    <div class="timer-main-row">
      <!-- Timer Display -->
      <div class="timer-display">
        <div class="time-display">
          <span class="time-value">{{ formatTime(currentTime.minutes, currentTime.seconds) }}</span>
        </div>

        <!-- Time Controls -->
        <div class="time-controls">
          <div class="time-section">
            <h3 class="section-title">Minutes</h3>
            <div class="control-group">
              <button
                class="control-btn increment"
                @click="updateTimer('minutes', 'increment')"
                :disabled="status !== 'stopped'"
              >
                <span class="control-icon">+</span>
              </button>
              <button
                class="control-btn decrement"
                @click="updateTimer('minutes', 'decrement')"
                :disabled="status !== 'stopped'"
              >
                <span class="control-icon">−</span>
              </button>
            </div>
          </div>

          <div class="time-section">
            <h3 class="section-title">Seconds</h3>
            <div class="control-group">
              <button
                class="control-btn increment"
                @click="updateTimer('seconds', 'increment')"
                :disabled="status !== 'stopped'"
              >
                <span class="control-icon">+</span>
              </button>
              <button
                class="control-btn decrement"
                @click="updateTimer('seconds', 'decrement')"
                :disabled="status !== 'stopped'"
              >
                <span class="control-icon">−</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Timer Controls -->
      <div class="timer-controls">
        <div class="control-buttons">
          <button
            class="timer-btn start-btn"
            @click="startTimer"
            :disabled="status === 'running' || (minutes === 0 && seconds === 0)"
          >
            <span class="btn-icon">▶️</span>
            <span class="btn-text">Start</span>
          </button>

          <button class="timer-btn pause-btn" @click="pauseTimer" :disabled="status !== 'running'">
            <span class="btn-icon">⏸️</span>
            <span class="btn-text">Pause</span>
          </button>

          <button
            class="timer-btn stop-btn"
            @click="stopTimer"
            :disabled="status !== 'running' && status !== 'paused'"
          >
            <span class="btn-icon">⏹️</span>
            <span class="btn-text">Stop</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./TimerSettings.css" scoped></style>
