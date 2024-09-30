<script setup lang="ts">
import { useLoginStore } from '@/stores/login'

const loginStore = useLoginStore()
</script>

<template>
  <div class="greetings">
    <h1 class="green">Hola {{ loginStore.usuario }}</h1>
    <h3 class="password">Su contraseña es: {{ loginStore.contra }}</h3>
    <h3 v-if="loginStore.remember">Recordar sesion: Si</h3>
    <h3 v-if="!loginStore.remember">Recordar sesion: No</h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

.password {
  visibility: hidden;
  width: 200px;
  background-color: rgba(0, 0, 0, 0.75);
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 100%; /* Muestra el tooltip arriba */
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.password:hover {
  visibility: visible;
  opacity: 1;
}
</style>
