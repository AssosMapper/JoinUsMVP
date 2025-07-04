<script setup lang="ts">
import Uploader from "@/components/ui/Uploader.vue";
import { getMediaUrl } from "@/utils/media.util";
import { PublicMediaDto } from "@shared/dto/media.dto";
import Button from "primevue/button";
import { ref, watch } from "vue";

/**
 * Composant UploadImage avec optimistic UI
 *
 * Modes d'utilisation :
 * 1. Avec handleUpload : Upload immédiat lors de la sélection
 * 2. Sans handleUpload : Sélection de fichier avec optimistic UI, upload géré par le parent
 *
 * Exemples :
 *
 * Mode 1 - Upload immédiat :
 * <UploadImage
 *   v-model="image"
 *   :handle-upload="uploadFunction"
 *   @remove="handleRemove"
 * />
 *
 * Mode 2 - Sélection avec optimistic UI :
 * <UploadImage
 *   v-model="image"
 *   @file-selected="handleFileSelect"
 *   @remove="handleRemove"
 * />
 */

const props = defineProps<{
  modelValue?: PublicMediaDto | null;
  preview?: boolean;
  handleUpload?: (file: File) => Promise<void>;
}>();

const emit = defineEmits<{
  "update:modelValue": [PublicMediaDto | null];
  remove: [];
  fileSelected: [File];
}>();

const previewUrl = ref<string | null>(null);
const selectedFile = ref<File | null>(null);

watch(
  () => props.modelValue,
  (newMedia) => {
    if (newMedia) {
      // Si l'URL commence par 'data:', c'est une URL de FileReader (optimistic UI)
      // Sinon, c'est une URL de media server
      previewUrl.value = newMedia.filepath.startsWith("data:")
        ? newMedia.filepath
        : getMediaUrl(newMedia.filepath);
    } else {
      previewUrl.value = null;
    }
  },
  { immediate: true }
);

const handleFileSelect = async (file: File) => {
  selectedFile.value = file;

  // Créer un aperçu optimistic avec FileReader
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string;

    // Créer un objet PublicMediaDto temporaire pour l'optimistic UI
    const tempMedia: PublicMediaDto = {
      id: "temp-" + Date.now(),
      filepath: e.target?.result as string,
      filename: file.name,
      size: file.size,
      mimetype: file.type,
      createdAt: new Date(),
    };

    emit("update:modelValue", tempMedia);
  };
  reader.readAsDataURL(file);

  // Émettre l'événement fileSelected pour permettre au parent de gérer le fichier
  emit("fileSelected", file);

  // Si handleUpload est fourni, l'exécuter (mode upload immédiat)
  if (props.handleUpload) {
    try {
      await props.handleUpload(file);
    } catch (error) {
      // En cas d'erreur, revenir à l'état précédent
      previewUrl.value = props.modelValue
        ? getMediaUrl(props.modelValue.filepath)
        : null;
      selectedFile.value = null;
      throw error;
    }
  }
};

const handleUploadSuccess = () => {
  // Cette méthode peut être appelée par le parent après un upload réussi
  selectedFile.value = null;
};

const handleRemove = () => {
  previewUrl.value = null;
  selectedFile.value = null;
  emit("update:modelValue", null);
  emit("remove");
};

// Exposer les méthodes pour le parent
defineExpose({
  handleUploadSuccess,
  selectedFile: () => selectedFile.value,
});
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Prévisualisation -->
    <div
      v-if="preview && previewUrl"
      class="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300"
    >
      <img :src="previewUrl" alt="Preview" class="w-full h-full object-cover" />
    </div>

    <!-- Upload Button -->
    <div class="flex items-center gap-2">
      <Uploader
        accept="image/*"
        :max-size="5"
        :handle-upload="handleFileSelect"
        @upload-success="handleUploadSuccess"
      >
        <template #default="{ triggerUpload, isUploading }">
          <Button
            type="button"
            class="bg-primary-500 text-white"
            :loading="isUploading"
            @click="triggerUpload"
          >
            <i class="pi pi-upload mr-2"></i>
            {{ modelValue ? "Changer l'image" : "Ajouter une image" }}
          </Button>
        </template>
      </Uploader>

      <Button
        v-if="previewUrl"
        type="button"
        severity="danger"
        text
        @click="handleRemove"
      >
        <i class="pi pi-trash"></i>
      </Button>
    </div>

    <!-- Indicateur de fichier sélectionné (mode sans handleUpload) -->
    <div v-if="selectedFile && !handleUpload" class="text-sm text-gray-600">
      <i class="pi pi-file mr-1"></i>
      Fichier sélectionné: {{ selectedFile.name }}
    </div>
  </div>
</template>
