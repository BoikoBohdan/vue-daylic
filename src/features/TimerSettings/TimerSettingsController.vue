<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import TimerSettingsPiP from './TimerSettingsPiP.vue'
import { useTimerStore } from '@/stores/timerStore'

const timerStore = useTimerStore()
const isPiPSupported = ref(false)

onMounted(() => {
  isPiPSupported.value = 'documentPictureInPicture' in window
})

async function openPiP() {
  if (!isPiPSupported.value) return

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
      width: 400,
      height: 300,
    })

    // Copy styles to PiP window
    const style = pipWindow.document.createElement('style')
    style.textContent = `
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
      }
      #pip-app {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        box-sizing: border-box;
      }

      /* Timer Settings Styles */
      .timer-settings {
        width: 100%;
        max-width: 350px;
      }

      .timer-container {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(15px);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        padding: 1.5rem;
        color: white;
      }

      .timer-display-section {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .time-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }

      .control-btn {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: bold;
        transition: all 0.2s ease;
      }

      .control-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
      }

      .control-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .time-display {
        text-align: center;
        margin: 0.5rem 0;
      }

      .time-value {
        display: block;
        font-size: 2.5rem;
        font-weight: bold;
        line-height: 1;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .time-label {
        display: block;
        font-size: 0.7rem;
        opacity: 0.8;
        margin-top: 0.2rem;
        font-weight: 600;
        letter-spacing: 1px;
      }

      .time-separator {
        font-size: 2.5rem;
        font-weight: bold;
        color: white;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        margin: 0 0.5rem;
        align-self: center;
        margin-top: -2rem;
      }

      .control-buttons-section {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
      }

      .timer-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 60px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .timer-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }

      .timer-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-icon {
        font-size: 1.2rem;
      }

      .start-btn:not(:disabled) {
        background: rgba(34, 197, 94, 0.3);
      }

      .start-btn:hover:not(:disabled) {
        background: rgba(34, 197, 94, 0.4);
      }

      .pause-btn:not(:disabled) {
        background: rgba(251, 191, 36, 0.3);
      }

      .pause-btn:hover:not(:disabled) {
        background: rgba(251, 191, 36, 0.4);
      }

      .stop-btn:not(:disabled) {
        background: rgba(239, 68, 68, 0.3);
      }

      .stop-btn:hover:not(:disabled) {
        background: rgba(239, 68, 68, 0.4);
      }
    `
    pipWindow.document.head.appendChild(style)

    const mountPoint = pipWindow.document.createElement('div')
    mountPoint.id = 'pip-app'
    pipWindow.document.body.appendChild(mountPoint)

    const { createApp } = await import('vue')
    const pipApp = createApp(TimerSettingsPiP, { timerStore })
    pipApp.mount(mountPoint)

    pipWindow.addEventListener('unload', () => {
      pipApp.unmount()
    })
  } catch (error) {
    console.error('PiP failed:', error)
  }
}

onMounted(() => timerStore.stopTimer())
onUnmounted(() => timerStore.stopTimer())
</script>

<template>
  <div class="timer-controller">
    <TimerSettingsPiP
      :timerStore="timerStore"
      :onOpenPiP="openPiP"
      :isPiPSupported="isPiPSupported"
    />
  </div>
</template>
<style src="./TimerSettingsController.css" scoped></style>
