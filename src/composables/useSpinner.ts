import { ref, computed, onUnmounted } from 'vue'
import useTeamStore from '@/stores/teamStore'

interface SpinnerSector {
  id: string
  label: string
  color: string
  probability: number
  startAngle: number
  endAngle: number
  centerAngle: number
}

// Default colors for team members
const defaultColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD']

export function useSpinner() {
  const teamStore = useTeamStore()

  // Spinner state
  const isSpinning = ref(false)
  const currentRotation = ref(0)
  const targetRotation = ref(0)
  const animationId = ref<number | null>(null)
  const winningSector = ref<SpinnerSector | null>(null)
  const spinDuration = 3000

  // Calculate sector angles
  const sectorAngles = computed(() => {
    const teamMembers = teamStore.team.filter(member => !member.wasSelected && member.isPresent)
    
    if (teamMembers.length === 0) {
      return []
    }

    const totalProbability = teamMembers.length * 100
    let currentAngle = 0

    return teamMembers.map((member, index) => {
      const angle = (100 / totalProbability) * 360
      const startAngle = currentAngle
      const endAngle = currentAngle + angle
      currentAngle += angle

      return {
        id: member.id,
        label: member.fullName,
        color: defaultColors[index % defaultColors.length],
        probability: 100,
        startAngle,
        endAngle,
        centerAngle: (startAngle + endAngle) / 2,
      }
    })
  })

  // Get random sector based on probabilities
  const getRandomSector = (): SpinnerSector | null => {
    const sectors = sectorAngles.value
    if (sectors.length === 0) return null

    const randomIndex = Math.floor(Math.random() * sectors.length)
    return sectors[randomIndex]
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

    const sectors = sectorAngles.value
    if (sectors.length === 0) return

    isSpinning.value = true
    winningSector.value = null

    // Calculate random target rotation
    const randomSector = getRandomSector()
    if (!randomSector) return

    const targetAngle = 360 * 5 + randomSector.centerAngle // 5 full rotations + sector center
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
