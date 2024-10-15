<script setup lang="ts">
import { useSessionStore } from '@/stores/sessionStore';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/models/user';
import { useRouter } from 'vue-router';

const router = useRouter();

const sessionStore = useSessionStore();
const authStore = useAuthStore();

const usersKey = 'vue-3-jwt-refresh-token-users';
const users: User[] = JSON.parse(localStorage.getItem(usersKey) || '[]');

// authStore.auth.data me devuelve un Proxy(Object) asi que tuve que usar un proxy para obtener los datos
const proxyAuthData = new Proxy(authStore.auth.data!, {
    get: (target, key: keyof User) => {
        return target[key];
    }
})

// Obtengo las entradas (pares clave-valor)
const entries = Object.entries(proxyAuthData);

// Lo vuelvo a un objeto normal para usarlo de manera mas comoda
const userData = Object.fromEntries(entries);

function logout() {
  authStore.logout();  
  router.push('/login');
}

function addUser() {
  const user: User = {
    id: 2,
    firstname: 'Usuario',
    lastname: 'Prueba',
    usuario: 'UsuarioPrueba',
    contra: 'prueba',
    isAdmin: false,
    refreshTokens: []
  }

  users.push(user);
  localStorage.setItem(usersKey, JSON.stringify(users));
}

</script>

<template>
  <div class="wrapper">
    <h1>Bienvenido {{ userData.username }}</h1>
    <div class="container">
      <div class="user-data">
        <h3>Información del usuario:</h3>
        <p>Nombre: {{ userData.firstname }} {{ userData.lastName }}</p>
        <p>Usuario: {{ userData.username }}</p>
        <p v-if="userData.isAdmin">Rol: Administrador</p><p v-else>Rol: Usuario</p>
      </div>
      <div class="users-list">
        <h3>Lista de usuarios:</h3>
        <ul>
          <li v-for="user in users" v-bind:key="user.id">
            <p>{{ user.usuario }} <span v-if="user.isAdmin">[Administrador]</span><span v-else>[Usuario]</span></p>
          </li>
        </ul>
      </div>
      <div class="token-data">
        <div class="toke-data-header">
          <h3>Información de sesión:</h3>
          <span v-if="sessionStore.loading" class="loader"></span>
        </div>
        <p>JWT Payload: {{ sessionStore.data.payload }}</p>
        <p>JWT Creado: {{ sessionStore.data.tokenCreated?.getHours().toString().padStart(2, '0') }}:{{ sessionStore.data.tokenCreated?.getMinutes().toString().padStart(2, '0') }} hs</p>
        <p>JWT Expira: {{ sessionStore.data.tokenExpire?.getHours().toString().padStart(2, '0') }}:{{ sessionStore.data.tokenExpire?.getMinutes().toString().padStart(2, '0') }} hs</p>
        <p>JWT Refresca: {{ sessionStore.data.tokenRefresh?.getHours().toString().padStart(2, '0') }}:{{ sessionStore.data.tokenRefresh?.getMinutes().toString().padStart(2, '0') }} hs</p>
      </div>
      <button class="add-user" v-if="userData.isAdmin" @click="addUser">Agregar Usuario</button>
      <button class="logout" @click="logout">Cerrar Sesión</button>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 70%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  color: #ffffff;
}

h1 {
  font-size: 24px;
  padding: 20px 20px;
}

.container {
  height: 84%;
  padding: 20px;
  display: grid;
  grid-template-columns: 60% 38%;
  background: transparent ;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.555);
  border-radius: 0px 0px 10px 10px;
  gap: 2%;
}

.user-data {
  background-color: rgba(81, 25, 86, 0.3);
  border-radius: 3px;
  padding: 10px 20px;
}

.token-data {
  background-color: rgba(81, 25, 86, 0.3);
  border-radius: 3px;
  padding: 10px 20px;
}

.toke-data-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.users-list {
  grid-row: span 2;
  background-color: rgba(81, 25, 86, 0.3);
  border-radius: 3px;
  padding: 10px 20px;
}

.users-list ul {
  padding-left: 20px;
}

h3 {
  font-size: 18px;
  text-decoration: underline;
}

p {
  font-size: 15px;
}

.loader {
  margin: auto 0;
  width: 20px;
  height: 20px;
  border: 4px solid rgb(226, 226, 226);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.add-user {
  height: 40px;
  background-color: #7d3c98;
  border: none;
  border-radius: 12px;
  color: #ffffff;
}

.logout {
  height: 40px;
  background-color: #FFE8C7;
  border: none;
  border-radius: 12px;
  margin-bottom: 10px;
}

</style>
