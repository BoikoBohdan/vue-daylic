<script setup lang="ts">
import { ref, computed } from 'vue'
import { roles, avatarConfig } from '@/configuration'
import useTeamStore from '@/stores/teamStore'

const teamStore = useTeamStore()
const fullName = ref<string>('')
const role = ref<string>('')
const avatar = ref<{ icon: string; background: string }>(avatarConfig[0])

const isValid = computed(() => {
  return fullName.value.length >= 3 && role.value
})

const emits = defineEmits<{
  (e: 'handle-close'): void
}>()

const handleClose = () => {
  emits('handle-close')
}

const handleAddMember = () => {
  teamStore.addMember({
    fullName: fullName.value,
    role: role.value,
    avatar: avatar.value,
  })
  handleClose()
}
</script>

<template>
  <div class="modal-overlay">
    <form class="modal-container" @submit.prevent="handleAddMember">
      <div class="modal-header">
        <h2 class="modal-title">Add New Team Member</h2>
        <button class="close-btn" @click="handleClose">
          <span class="close-icon">×</span>
        </button>
      </div>

      <div class="modal-body">
        <form class="add-member-form">
          <div
            class="form-group"
            :class="{ 'has-error': fullName.length > 0 && fullName.length < 3 }"
          >
            <label class="form-label">Full Name</label>
            <input
              v-model="fullName"
              type="text"
              class="form-input"
              :class="{ error: fullName.length > 0 && fullName.length < 3 }"
              placeholder="Enter full name"
              minlength="3"
            />
            <span class="error-message" v-if="fullName.length > 0 && fullName.length < 3">
              Full name must be at least 3 characters long
            </span>
          </div>

          <div class="form-group" :class="{ 'has-error': !role }">
            <label class="form-label">Role</label>
            <select v-model="role" class="form-select" :class="{ error: !role }">
              <option value="">Select a role</option>
              <option v-for="roleOption in roles" :key="roleOption" :value="roleOption">
                {{ roleOption }}
              </option>
            </select>
            <span class="error-message" v-if="!role"> Please select a role </span>
          </div>

          <div class="form-group">
            <label class="form-label">Avatar Icon</label>
            <div class="icon-grid">
              <div
                class="icon-option"
                :class="{ selected: avatar.icon === avatarOption.icon }"
                v-for="avatarOption in avatarConfig"
                :key="avatarOption.icon"
                @click="avatar = avatarOption"
              >
                <div class="icon-avatar" :style="{ background: avatarOption.background }">
                  <span class="icon-text">{{ avatarOption.icon }}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="handleClose">Cancel</button>
        <button class="btn btn-primary" @click="handleAddMember" :disabled="!isValid">
          Add Member
        </button>
      </div>
    </form>
  </div>
</template>

<style src="./AddMemberModal.css" scoped></style>
