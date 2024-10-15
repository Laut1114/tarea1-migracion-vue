import type { User } from '@/models/user'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('user', {
  state: (): User => ({
    usuario: '',
    contra: '',
    remember: false,
    id: 0,
    firstname: '',
    lastname: '',
    isAdmin: false,
    refreshTokens: []
  }),
  actions: {
    login(data: User) {
      this.usuario = data.usuario
      this.contra = data.contra
      this.remember = data.remember
    }
  }
})
