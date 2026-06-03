<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center">
    <p class="text-gray-500">Loading...</p>
  </div>
  <div v-else-if="error" class="min-h-screen flex items-center justify-center flex-col">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
    <p class="text-gray-500">{{ error }}</p>
    <router-link to="/" class="mt-6 text-indigo-600 hover:underline">Go Home</router-link>
  </div>
  <div v-else class="min-h-screen bg-white">
    <div v-for="block in page?.blocks" :key="block.id">

      <!-- Hero Block -->
      <div v-if="block.type === 'hero'" class="bg-indigo-50 py-24 px-6 text-center">
        <h1 class="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">{{ block.data.headline }}</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-10">{{ block.data.subheadline }}</p>
        <button v-if="block.data.ctaText" class="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-700 shadow-lg transition">
          {{ block.data.ctaText }}
        </button>
      </div>

      <!-- Features Block -->
      <div v-if="block.type === 'features'" class="py-24 px-6 max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">{{ block.data.title }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(item, i) in block.data.items" :key="i" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {{ i + 1 }}
            </div>
            <p class="text-gray-700 mt-2">{{ item }}</p>
          </div>
        </div>
      </div>

    </div>

    <footer class="bg-gray-50 py-12 text-center text-gray-500 text-sm mt-auto border-t border-gray-200">
      Built with <a href="/" class="text-indigo-600 hover:underline">FlashFocus</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { PageConfig } from '../shared/types/index';

const route = useRoute();
const slug = route.params.slug as string;
const page = ref<PageConfig | null>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const res = await fetch(`/api/pages/${slug}`);
    if (!res.ok) {
      throw new Error('Page not found or not published');
    }
    page.value = await res.json();
    document.title = page.value?.title || 'FlashFocus Page';
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>
