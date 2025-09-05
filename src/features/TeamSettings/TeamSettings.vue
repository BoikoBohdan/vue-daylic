<script setup lang="ts">
import { ref } from 'vue'
import { AddMemberModal } from './index'
import useTeamStore from '@/stores/teamStore'

const teamStore = useTeamStore()
const isAddMemberModalOpen = ref(false)

const openAddMemberModal = () => {
  isAddMemberModalOpen.value = true
}

const closeAddMemberModal = () => {
  isAddMemberModalOpen.value = false
}
</script>

<template>
  <div class="team-settings-sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">Team Members</h2>
      <button class="add-member-btn" @click="openAddMemberModal">
        <span class="add-icon">+</span>
        Add Member
      </button>
    </div>

    <div class="team-members-list">
      <div
        class="member-item"
        v-for="member in teamStore.team"
        :key="member.id"
        :class="{ absent: !member.isPresent }"
      >
        <label class="checkbox-container">
          <input
            type="checkbox"
            class="presence-checkbox"
            @change="teamStore.togglePresence(member.id)"
            :checked="member.isPresent"
          />
          <span class="checkmark"></span>
        </label>
        <div class="member-info">
          <div class="member-avatar" :style="{ background: member.avatar.background }">
            <span class="avatar-text">
              {{ member.avatar.icon }}
            </span>
          </div>
          <div class="member-details">
            <h4 class="member-name">{{ member.fullName }}</h4>
            <p class="member-role">{{ member.role }}</p>
          </div>
        </div>
        <div class="member-actions">
          <button
            v-if="member.wasSelected"
            class="selection-indicator selected"
            @click="teamStore.toggleSelection(member.id)"
            title="Click to unselect"
          >
            <span class="selection-icon">✓</span>
          </button>
          <button class="remove-member-btn">
            <span class="remove-icon" @click="teamStore.removeMember(member.id)">×</span>
          </button>
        </div>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="stats">
        <div class="stat-item">
          <span class="stat-number">{{ teamStore.team.length }}</span>
          <span class="stat-label">Total Members</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{
            teamStore.team.filter((member) => member.isPresent).length
          }}</span>
          <span class="stat-label">Present Today</span>
        </div>
      </div>
    </div>
  </div>
  <AddMemberModal v-if="isAddMemberModalOpen" @handle-close="closeAddMemberModal" />
</template>

<style src="./TeamSettings.css" scoped></style>
