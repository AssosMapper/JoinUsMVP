<script setup lang="ts">
import { useUpload } from "@/composables/useUpload";
import { useNotificationStore } from "@/store/notificationStore";
import { PublicMediaDto } from "@shared/dto/media.dto";
import { ref } from "vue";

const props = defineProps<{
  accept?: string;
  maxSize?: number; // en MB
}>();

const emit = defineEmits<{
  "upload-success": [PublicMediaDto];
  "upload-error": [Error];
  "upload-progress": [number];
}>();

const { upload, isUploading } = useUpload();
const notificationStore = useNotificationStore();
const fileInput = ref<HTMLInputElement | null>(null);

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];

  // Vérification de la taille si maxSize est défini
  if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
    notificationStore.showNotification(
      `Le fichier ne doit pas dépasser ${props.maxSize}MB`,
      "error"
    );
    return;
  }

  try {
    const result = await upload(file);
    emit("upload-success", result);
  } catch (error: any) {
    emit("upload-error", error);
    notificationStore.showNotification(error.message, "error");
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      class="hidden"
      @change="handleFileSelect"
    />

    <slot :trigger-upload="triggerFileInput" :is-uploading="isUploading">
      <Button type="button" :loading="isUploading" @click="triggerFileInput">
        <i class="pi pi-upload mr-2"></i>
        {{ "Télécharger" }}
      </Button>
    </slot>
  </div>
</template>
