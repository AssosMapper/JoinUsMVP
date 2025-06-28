<script setup lang="ts">
import { useNotificationStore } from "@/store/notificationStore";
import { ref } from "vue";

const props = defineProps<{
  accept?: string;
  maxSize?: number;
  handleUpload: (file: File) => Promise<void>;
}>();

const emit = defineEmits<{
  "upload-success": [];
  "upload-error": [Error];
  "upload-start": [];
}>();

const notificationStore = useNotificationStore();
const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];

  if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
    notificationStore.showNotification(
      `Le fichier ne doit pas dépasser ${props.maxSize}MB`,
      "error"
    );
    return;
  }

  isUploading.value = true;
  emit("upload-start");

  try {
    await props.handleUpload(file);
    emit("upload-success");
    input.value = "";
  } catch (error: any) {
    emit("upload-error", error);
    notificationStore.showNotification(error.message, "error");
  } finally {
    isUploading.value = false;
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
