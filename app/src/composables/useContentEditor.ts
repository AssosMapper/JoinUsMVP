import { ref, type Ref } from 'vue';
import { useNotificationStore } from '@/store/notificationStore';

type UpdateContentFunction = (id: string, content: string) => Promise<unknown>;

interface UseContentEditorOptions {
  initialContent?: string;
  onSuccess?: (updatedData: unknown) => void;
}

interface UseContentEditorReturn {
  isEditing: Ref<boolean>;
  content: Ref<string>;
  isLoading: Ref<boolean>;
  startEditing: (initialContent?: string) => void;
  cancelEditing: () => void;
  saveContent: (id: string, updateFunction: UpdateContentFunction) => Promise<void>;
}

export function useContentEditor(options: UseContentEditorOptions = {}): UseContentEditorReturn {
  const notificationStore = useNotificationStore();
  
  const isEditing = ref<boolean>(false);
  const content = ref<string>(options.initialContent || '');
  const isLoading = ref<boolean>(false);

  const startEditing = (initialContent?: string): void => {
    isEditing.value = true;
    content.value = initialContent || options.initialContent || '';
  };

  const cancelEditing = (): void => {
    isEditing.value = false;
    content.value = '';
  };

  const saveContent = async (id: string, updateFunction: UpdateContentFunction): Promise<void> => {
    if (!id) {
      notificationStore.showNotification('ID manquant pour la sauvegarde', 'error');
      return;
    }

    isLoading.value = true;
    try {
      const updatedData = await updateFunction(id, content.value);
      
      isEditing.value = false;
      notificationStore.showNotification('Contenu mis à jour avec succès', 'success');
      
      if (options.onSuccess) {
        options.onSuccess(updatedData);
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erreur lors de la mise à jour du contenu';
      
      notificationStore.showNotification(errorMessage, 'error');
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isEditing,
    content,
    isLoading,
    startEditing,
    cancelEditing,
    saveContent,
  };
}
