<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';

const router = useRouter();
const authStore = useAuthStore();

const schema = Yup.object().shape({
  username: Yup.string().required('Usuario Requerido'),
  password: Yup.string().required('Contraseña es Requerido')
});

if (authStore.auth.data) {
  router.push('/');
}

function handleSubmit(values: any, { setErrors }: any) {
  const { username, password } = values;

  return authStore.login(username, password).then(() => {
    router.push('/');
  })
  .catch(error => setErrors({ apiError: error }));
}

</script>

<template>
  <Form @submit="handleSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
    <h1>Login</h1>
    <div class="input-bx">
      <Field name='username' type="text" :class="{ 'is-invalid': errors.username || errors.apiError }"
        placeholder="Usuario" required />
      <ion-icon class="icon" name="person-circle"></ion-icon>
      <div class="invalid-feedback">{{ errors.username }}</div>
    </div>
    <div class="input-bx">
      <Field name="password" type="password" :class="{ 'is-invalid': errors.password || errors.apiError }"
        placeholder="Contraseña" required />
      <ion-icon class="icon" name="lock-closed"></ion-icon>
      <div class="invalid-feedback">{{ errors.password }}</div>
    </div>
    <div class="remember-forgot">
      <label><input type="checkbox" name="remember" /> Recordarme</label>
      <a href="#">Olvidaste tu contraseña</a>
    </div>
    <button type="submit" class="btn">
      <span v-show="isSubmitting" class="loader"></span>
      <p v-show="!isSubmitting">Ingresar</p>
    </button>
    <div v-if="errors.apiError" class="error-alert">{{ errors.apiError }}</div>
  </Form>
</template>

<style scoped>
.wrapper h1 {
  font-size: 3em;
  text-align: center;
}

.input-bx {
  position: relative;
  width: 100%;
  height: 50px;
  margin: 30px 0;
}

.input-bx input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  color: #fff;
  padding: 20px 45px 20px 20px;
}

.input-bx input.is-invalid {
  width: 100%;
  height: 100%;
  background: rgba(250, 150, 150, 0.1);
  border: 2px solid rgba(255, 0, 0, 0.2);
  color: red;
}

.input-bx input::placeholder {
  color: #fff;
}

.input-bx input.is-invalid::placeholder {
  color: red;
}

.input-bx .icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5em;
}

.input-bx .invalid-feedback {
  padding: 0px 16px;
  margin: 0;
  color: red;
  font-weight: 300;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  font-size: 1.2em;
  margin: -15px 0 15px;
}

.remember-forgot label input {
  accent-color: #fff;
  margin-right: 3px;
}

.remember-forgot a {
  color: #fff;
  text-decoration: none;
}

.remember-forgot a:hover {
  text-decoration: underline;
}

button {
  width: 100%;
  height: 50px;
  border-radius: 15px;
  border: none;
  outline: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 1.2em;
  font-weight: 600;
  color: #333;
}

button p {
  font-size: 1.2em;
  font-weight: 600;
  color: #333;
}

.loader {
  margin: auto 0;
  width: 24px;
  height: 24px;
  border: 4px solid purple;
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

.error-alert {
  margin: 16px;
  width: 100%;
  background: transparent;
  color: red;
  text-align: center;
  font-weight: 400;
}
</style>
