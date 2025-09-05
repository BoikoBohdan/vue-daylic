import type { AvatarConfig } from '@/configuration'
import { defineStore } from 'pinia'

interface TeamMember {
  id: string
  fullName: string
  role: string
  avatar: AvatarConfig
  isPresent: boolean
  wasSelected: boolean
}

interface TeamState {
  team: TeamMember[]
}

interface TeamActions {
  addMember(member: Omit<TeamMember, 'id' | 'isPresent' | 'wasSelected'>): void
  removeMember(id: string): void
  togglePresence(id: string): void
  toggleSelection(id: string): void
  resetSelections(): void
}

const useTeamStore = defineStore<string, TeamState, {}, TeamActions>('team', {
  state: (): TeamState => ({
    team: [],
  }),
  actions: {
    addMember(member: Omit<TeamMember, 'id' | 'isPresent' | 'wasSelected'>) {
      const uuid = crypto.randomUUID()
      this.team.push({ ...member, id: uuid, isPresent: true, wasSelected: false })
    },
    removeMember(id: string) {
      this.team = this.team.filter((member) => member.id !== id)
    },
    togglePresence(id: string) {
      this.team = this.team.map((member) =>
        member.id === id ? { ...member, isPresent: !member.isPresent } : member,
      )
    },
    toggleSelection(id: string) {
      this.team = this.team.map((member) =>
        member.id === id ? { ...member, wasSelected: !member.wasSelected } : member,
      )
    },
    resetSelections() {
      this.team = this.team.map((member) => ({ ...member, wasSelected: false }))
    },
  },
  persist: true,
})

export default useTeamStore
