import type { User } from '@/models/user'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useLoginStore = defineStore('user', {
  state: (): User => ({
    usuario: '',
    contra: '',
    remember: false
  }),
  actions: {
    login(data: User) {
      // Prueba 1
      // const router = useRouter()

      this.usuario = data.usuario
      this.contra = data.contra
      this.remember = data.remember

      // router.push('/home')
    }
  }
})
