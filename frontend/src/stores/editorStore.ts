import { defineStore } from 'pinia';
import { ref } from 'vue';
import { PageConfig } from '../shared/types/index';

export const useEditorStore = defineStore('editor', () => {
  const currentPage = ref<Partial<PageConfig> | null>(null);

  function setCurrentPage(page: Partial<PageConfig>) {
    currentPage.value = page;
  }

  return { currentPage, setCurrentPage };
});
