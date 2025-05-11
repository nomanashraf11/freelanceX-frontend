import { defineStore } from 'pinia'
import { getAPI } from '../utils/api'
import type { User } from '../types/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    async fetchUser() {
      try {
        const response = await getAPI<User>('/user/profile')
        this.user = response.data
      } catch (error) {
        this.user = null
        console.log(error)
      }
    },
    clearUser() {
      this.user = null
    },
  },
})