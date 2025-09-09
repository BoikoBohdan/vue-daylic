<template>
  <div class="matrix-winner">
    <button class="matrix-btn select-btn" @click="selectWinner" :disabled="isSelecting">
      <span class="btn-icon">🎯</span>
      <span class="btn-text">{{ isSelecting ? 'SELECTING...' : 'SELECT' }}</span>
    </button>
    <div class="matrix-container">
      <div class="squares-grid">
        <div
          v-for="(square, index) in squares"
          :key="index"
          class="square"
          :class="{
            filled: square.filled,
            filling: square.filling,
            stopped: square.stopped,
          }"
        >
          <span class="square-text">{{ square.letter }}</span>
        </div>
      </div>
      <div class="winner-text" :class="{ revealed: isRevealed }">
        <span class="winner-label">WINNER:</span>
        <span class="winner-name">{{ selectedWinner }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  options?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
})

const emit = defineEmits<{
  'winner-selected': [winnerName: string]
}>()

const isSelecting = ref(false)
const isRevealed = ref(false)
const selectedWinner = ref('')
const squares = ref<Array<{ filled: boolean; filling: boolean; stopped: boolean; letter: string }>>(
  [],
)
const animationInterval = ref<number | null>(null)

const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const generateRandomLetter = () => {
  return symbols[Math.floor(Math.random() * symbols.length)]
}

const initializeSquares = () => {
  squares.value = Array(10)
    .fill(null)
    .map(() => ({
      filled: false,
      filling: false,
      stopped: false,
      letter: generateRandomLetter(),
    }))
}

const startRandomAnimation = () => {
  animationInterval.value = setInterval(() => {
    squares.value.forEach((square) => {
      if (!square.stopped) {
        square.letter = generateRandomLetter()
      }
    })
  }, 200) // Change letters every 100ms
}

const stopAnimation = (winner: string) => {
  const winnerPadded = winner.padEnd(10, ' ').toUpperCase()

  // Stop squares one by one with the correct letter
  winnerPadded.split('').forEach((letter, index) => {
    setTimeout(() => {
      squares.value[index].stopped = true
      squares.value[index].letter = letter
      squares.value[index].filling = true

      setTimeout(() => {
        squares.value[index].filling = false
        squares.value[index].filled = true
      }, 500)
    }, index * 200) // Stop each square with 200ms delay
  })

  // Clear the animation interval
  if (animationInterval.value) {
    clearInterval(animationInterval.value)
    animationInterval.value = null
  }
}

const selectWinner = () => {
  if (props.options.length === 0) {
    alert('No options available. Please provide options first.')
    return
  }

  isSelecting.value = false
  isRevealed.value = false
  // selectedWinner.value = ''

  // Select winner immediately
  const winnerName = props.options[Math.floor(Math.random() * props.options.length)]

  // Start stopping animation
  stopAnimation(winnerName)
  selectedWinner.value = winnerName

  // Show winner text after all squares are filled
  setTimeout(() => {
    isRevealed.value = true
    isSelecting.value = false
    // selectedWinner.value = winnerName

    // Notify parent component about the selected winner
    emit('winner-selected', selectedWinner.value)
  }, 2500) // 10 squares * 200ms + 500ms buffer

  setTimeout(() => {
    if (isRevealed.value) {
      initializeSquares()
      startRandomAnimation()
    }
  }, 5000)
}

onMounted(() => {
  initializeSquares()
  startRandomAnimation()
})

onUnmounted(() => {
  if (animationInterval.value) {
    clearInterval(animationInterval.value)
  }
})
</script>

<style src="./MatrixWinner.css" scoped></style>
