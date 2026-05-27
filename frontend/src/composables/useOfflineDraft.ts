import { ref } from 'vue';
import { PageConfig } from '../../../shared/types/index';

export function useOfflineDraft(pageId: string | undefined) {
  const isOffline = ref(!navigator.onLine);
  const draftKey = `flashfocus_draft_${pageId || 'new'}`;

  window.addEventListener('online', () => (isOffline.value = false));
  window.addEventListener('offline', () => (isOffline.value = true));

  const saveDraft = (data: Partial<PageConfig>) => {
    localStorage.setItem(draftKey, JSON.stringify(data));
  };

  const loadDraft = (): Partial<PageConfig> | null => {
    const draft = localStorage.getItem(draftKey);
    return draft ? JSON.parse(draft) : null;
  };

  const clearDraft = () => {
    localStorage.removeItem(draftKey);
  };

  return { isOffline, saveDraft, loadDraft, clearDraft };
}
