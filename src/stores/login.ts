import type { User } from '@/models/user'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('user', {
  state: (): User => ({
    usuario: '',
    contra: '',
    remember: false
  }),
  actions: {
    login(data: User) {
      this.usuario = data.usuario
      this.contra = data.contra
      this.remember = data.remember
    }
  }
})
