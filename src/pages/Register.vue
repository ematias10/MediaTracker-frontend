<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  invitation_code: ''
});

const error = ref('');
const loading = ref(false);

const handleRegister = async () => {
  error.value = '';
  loading.value = true;
  
  try {
    await authStore.register(form.value);
    router.push('/');
  } catch (err) {
    if (err.response?.status === 403) {
      error.value = 'Código de invitación inválido.';
    } else if (err.response?.data) {
      error.value = 'Error en el registro. Verifica los datos e intenta nuevamente.';
      console.error(err.response.data);
    } else {
      error.value = 'Error de conexión con el servidor.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-bg-dark">
    <div class="w-full max-w-md bg-surface-dark rounded-2xl shadow-xl p-8 border border-slate-700/50">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-slate-100 mb-2">Media Tracker</h1>
        <p class="text-slate-400">Únete a tu grupo privado</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div v-if="error" class="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
          {{ error }}
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
            <input v-model="form.first_name" type="text" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Apellido</label>
            <input v-model="form.last_name" type="text" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Usuario *</label>
          <input v-model="form.username" type="text" required class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Ej: matias_mt" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
          <input v-model="form.email" type="email" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="tucorreo@ejemplo.com" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Contraseña *</label>
          <input v-model="form.password" type="password" required class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Código de Invitación *</label>
          <input v-model="form.invitation_code" type="password" required class="w-full bg-slate-900 border border-primary/50 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-slate-600" placeholder="Ingresa el código secreto" />
          <p class="text-xs text-slate-500 mt-2">Requerido para acceder a esta plataforma privada.</p>
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-primary/20">
          <span v-if="loading">Registrando...</span>
          <span v-else>Crear cuenta</span>
        </button>

        <p class="text-center text-sm text-slate-400 mt-6">
          ¿Ya tienes cuenta? 
          <router-link to="/login" class="text-primary hover:text-primary-dark font-medium hover:underline transition-colors">Inicia sesión</router-link>
        </p>
      </form>
    </div>
  </div>
</template>
