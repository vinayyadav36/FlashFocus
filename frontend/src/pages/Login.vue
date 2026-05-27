<template>
  <div class="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
    <h2 class="text-2xl font-bold text-center mb-6">Login to FlashFocus</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="email" type="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input v-model="password" type="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500" />
      </div>
      <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
        Login / Register
      </button>
      <p v-if="error" class="text-red-500 text-sm text-center mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  error.value = '';
  try {
    let res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });

    // Auto register if login fails
    if (!res.ok) {
       res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: password.value })
      });
    }

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Authentication failed');
    }

    const data = await res.json();
    authStore.setAuth(data.user, data.token);
    router.push('/dashboard');
  } catch (err: any) {
    error.value = err.message;
  }
};
</script>
