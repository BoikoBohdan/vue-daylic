import { ref, computed, onUnmounted } from 'vue'
import useTeamStore from '@/stores/teamStore'

interface SpinnerSector {
  id: number
  label: string
  color: string
  probability: number
}

// Hardcoded sectors
const sectors: SpinnerSector[] = [
  { id: 1, label: 'Pizza', color: '#FF6B6B', probability: 25 },
  { id: 2, label: 'Burger', color: '#4ECDC4', probability: 25 },
  { id: 3, label: 'Sushi', color: '#45B7D1', probability: 25 },
  { id: 4, label: 'Salad', color: '#96CEB4', probability: 25 },
]

export function useSpinner() {
  const teamStore = useTeamStore()
  console.log(teamStore.team)

  // Spinner state
  const isSpinning = ref(false)
  const currentRotation = ref(0)
  const targetRotation = ref(0)
  const animationId = ref<number | null>(null)
  const winningSector = ref<SpinnerSector | null>(null)
  const spinDuration = 3000

  // Calculate sector angles
  const sectorAngles = computed(() => {
    const totalProbability = teamStore.team.length * 100
    let currentAngle = 0

    return teamStore.team.map((sector) => {
      const angle = (100 / totalProbability) * 360
      const startAngle = currentAngle
      const endAngle = currentAngle + angle
      currentAngle += angle

      return {
        ...sector,
        startAngle,
        endAngle,
        centerAngle: (startAngle + endAngle) / 2,
      }
    })
  })

  // Get random sector based on probabilities
  const getRandomSector = (): SpinnerSector => {
    const totalProbability = teamStore.team.length * 100
    const random = Math.random() * totalProbability

    let currentSum = 0
    for (const sector of sectors) {
      currentSum += sector.probability
      if (random <= currentSum) {
        return sector
      }
    }

    return sectors[0]
  }

  let startTime = 0

  // Animation loop
  const animate = () => {
    if (!isSpinning.value) return

    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / spinDuration, 1)

    // Easing function for smooth deceleration
    const easeOut = 1 - Math.pow(1 - progress, 3)

    currentRotation.value = targetRotation.value * easeOut

    if (progress < 1) {
      animationId.value = requestAnimationFrame(animate)
    } else {
      stopSpin()
    }
  }

  // Start animation timer
  const startAnimation = () => {
    startTime = Date.now()
    animate()
  }

  // Start spinning
  const startSpin = () => {
    if (isSpinning.value) return

    isSpinning.value = true
    winningSector.value = null

    // Calculate random target rotation
    const randomSector = getRandomSector()
    const sectorAngle = sectorAngles.value.find((s) => s.id === randomSector.id)!
    const targetAngle = 360 * 5 + sectorAngle.centerAngle // 5 full rotations + sector center

    targetRotation.value = targetAngle
    currentRotation.value = 0

    startAnimation()
  }

  // Stop spinning
  const stopSpin = () => {
    if (!isSpinning.value) return

    isSpinning.value = false
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
      animationId.value = null
    }

    // Determine winning sector
    const normalizedRotation = currentRotation.value % 360
    const winningSectorAngle = sectorAngles.value.find((sector) => {
      const start = sector.startAngle
      const end = sector.endAngle
      return normalizedRotation >= start && normalizedRotation <= end
    })

    if (winningSectorAngle) {
      winningSector.value = winningSectorAngle
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
    }
  })

  return {
    isSpinning,
    currentRotation,
    sectorAngles,
    winningSector,
    startSpin,
    stopSpin,
  }
}
