<script setup lang="ts">
import { type PropType } from 'vue'
import type { TimerStore } from '@/stores/timerStore'

const { timerStore, onOpenPiP, isPiPSupported } = defineProps({
  timerStore: {
    type: Object as PropType<TimerStore>,
    required: true,
  },
  onOpenPiP: {
    type: Function as PropType<() => void>,
    required: false,
  },
  isPiPSupported: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const updateDefaultTimerSeconds = (operation: 'increment' | 'decrement') => {
  const valueBasedOnOperation =
    operation === 'increment' ? timerStore.defaultSeconds + 1 : timerStore.defaultSeconds - 1
  timerStore.setDefaultTimer(timerStore.defaultMinutes, valueBasedOnOperation)
}

const updateDefaultTimerMinutes = (operation: 'increment' | 'decrement') => {
  const valueBasedOnOperation =
    operation === 'increment' ? timerStore.defaultMinutes + 1 : timerStore.defaultMinutes - 1
  timerStore.setDefaultTimer(valueBasedOnOperation, timerStore.defaultSeconds)
}

const startTimer = () => {
  timerStore.startTimer(timerStore.defaultMinutes, timerStore.defaultSeconds)
}

const pauseTimer = () => {
  timerStore.pauseTimer()
}

const stopTimer = () => {
  timerStore.stopTimer()
}

// Removed automatic stopTimer on mount to prevent PiP from resetting timer
</script>

<template>
  <div class="timer-settings">
    <div class="timer-container">
      <!-- Timer Display Section -->
      <div class="timer-display-section">
        <!-- Minutes Section -->
        <div class="time-section">
          <button
            class="control-btn increment"
            @click="updateDefaultTimerMinutes('increment')"
            :disabled="timerStore.status !== 'stopped'"
          >
            <span class="control-icon">+</span>
          </button>

          <div class="time-display">
            <span class="time-value">{{
              timerStore.status === 'stopped'
                ? timerStore.defaultMinutes.toString().padStart(2, '0')
                : timerStore.minutes.toString().padStart(2, '0')
            }}</span>
            <span class="time-label">MIN</span>
          </div>

          <button
            class="control-btn decrement"
            @click="updateDefaultTimerMinutes('decrement')"
            :disabled="timerStore.status !== 'stopped'"
          >
            <span class="control-icon">−</span>
          </button>
        </div>

        <!-- Separator -->
        <div class="time-separator">:</div>

        <!-- Seconds Section -->
        <div class="time-section">
          <button
            class="control-btn increment"
            @click="updateDefaultTimerSeconds('increment')"
            :disabled="timerStore.status !== 'stopped'"
          >
            <span class="control-icon">+</span>
          </button>

          <div class="time-display">
            <span class="time-value">{{
              timerStore.status === 'stopped'
                ? timerStore.defaultSeconds.toString().padStart(2, '0')
                : timerStore.seconds.toString().padStart(2, '0')
            }}</span>
            <span class="time-label">SEC</span>
          </div>

          <button
            class="control-btn decrement"
            @click="updateDefaultTimerSeconds('decrement')"
            :disabled="timerStore.status !== 'stopped'"
          >
            <span class="control-icon">−</span>
          </button>
        </div>
      </div>

      <!-- Control Buttons Section - Below Timer -->
      <div class="control-buttons-section">
        <button
          class="timer-btn start-btn"
          @click="startTimer"
          :disabled="
            timerStore.status === 'running' ||
            (timerStore.minutes === 0 && timerStore.seconds === 0)
          "
        >
          <span class="btn-icon">▶</span>
          <span class="btn-text">START</span>
        </button>

        <button
          class="timer-btn pause-btn"
          @click="pauseTimer"
          :disabled="timerStore.status !== 'running'"
        >
          <span class="btn-icon">⏸</span>
          <span class="btn-text">PAUSE</span>
        </button>

        <button
          class="timer-btn stop-btn"
          @click="stopTimer"
          :disabled="timerStore.status !== 'running' && timerStore.status !== 'paused'"
        >
          <span class="btn-icon">⏹</span>
          <span class="btn-text">STOP</span>
        </button>

        <button
          v-if="onOpenPiP"
          class="timer-btn pip-btn"
          @click="onOpenPiP"
          :disabled="!isPiPSupported"
        >
          <span class="btn-icon">🖼️</span>
          <span class="btn-text">PiP</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style src="./TimerSettingsPiP.css" scoped></style>
