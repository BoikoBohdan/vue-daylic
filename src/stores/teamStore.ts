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

const useTeamStore = defineStore<string, { team: TeamMember[] }>('team', {
  state: () => ({
    team: [],
  }),
  actions: {
    addMember(member: TeamMember) {
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
