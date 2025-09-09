<script setup lang="ts">
import { computed } from 'vue'
import { MatrixWinner } from '@/components'
import { TimerSettingsController, TeamSettings } from '@/features'
import useTeamStore from '@/stores/teamStore'

const teamStore = useTeamStore()
const availableTeamMembers = computed(() => {
  return teamStore.team
    .filter((member) => !member.wasSelected && member.isPresent)
    .map((member) => member.fullName)
})

const handleWinnerSelected = (winnerName: string) => {
  const selectedMember = teamStore.team.find((member) => member.fullName === winnerName)
  if (selectedMember) {
    teamStore.toggleSelection(selectedMember.id)
  }
}
</script>

<template>
  <div class="dashboard-container">
    <!-- Left Sidebar -->
    <TeamSettings />

    <!-- Main Content Section -->
    <div class="main-section">
      <div class="section-header">
        <TimerSettingsController />
      </div>

      <div class="section-content">
        <MatrixWinner :options="availableTeamMembers" @winner-selected="handleWinnerSelected" />
      </div>
    </div>
  </div>
</template>

<style src="./DashboardView.css" scoped></style>
