<script setup lang="ts">
import { useSpinner } from '@/composables/useSpinner'

interface SpinnerSector {
  id: number
  label: string
  color: string
  probability: number
  startAngle: number
  endAngle: number
  centerAngle: number
}

const emit = defineEmits<{
  (e: 'spin-complete', sector: SpinnerSector): void
}>()

const { isSpinning, currentRotation, sectorAngles, winningSector, startSpin, stopSpin } =
  useSpinner()

// Watch for winning sector changes to emit event
import { watch } from 'vue'

watch(winningSector, (newSector) => {
  if (newSector) {
    emit('spin-complete', newSector)
  }
})
</script>

<template>
  <div class="spinner-container">
    <!-- Spinner Wheel -->
    <div class="spinner-wheel" :style="{ transform: `rotate(${currentRotation}deg)` }">
      <div
        class="spinner-pie"
        :style="{
          background: `conic-gradient(${sectorAngles.map((s) => `${s.color} ${s.startAngle}deg ${s.endAngle}deg`).join(', ')})`,
        }"
      >
        <div
          v-for="sector in sectorAngles"
          :key="sector.id"
          class="spinner-sector"
          :class="{ 'winning-sector': winningSector?.id === sector.id }"
        >
          <div
            class="sector-label"
            :style="{
              transform: `rotate(${sector.centerAngle + 270}deg) translateY(-140px)`,
              transformOrigin: 'center',
            }"
          >
            {{ sector.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- Center Pointer -->
    <div class="spinner-pointer"></div>

    <!-- Controls -->
    <div class="spinner-controls">
      <button
        class="spin-btn"
        @click="startSpin"
        :disabled="isSpinning"
        :class="{ spinning: isSpinning }"
      >
        <span class="btn-icon">🎯</span>
        <span class="btn-text">{{ isSpinning ? 'Spinning...' : 'Spin' }}</span>
      </button>

      <button class="stop-btn" @click="stopSpin" :disabled="!isSpinning">
        <span class="btn-icon">⏹️</span>
        <span class="btn-text">Stop</span>
      </button>
    </div>

    <!-- Winning Result -->
    <div v-if="winningSector" class="winning-result">
      <div class="result-label">Winner:</div>
      <div class="result-value" :style="{ color: winningSector.color }">
        {{ winningSector.label }}
      </div>
    </div>
  </div>
</template>

<style src="./SpinnerUI.css" scoped></style>
