<script setup lang="ts">
import Uploader from "@/components/ui/Uploader.vue";
import { getMediaUrl } from "@/utils/media.util";
import { PublicMediaDto } from "@shared/dto/media.dto";
import { ref, watch } from "vue";
const props = defineProps<{
  modelValue?: PublicMediaDto | null;
  preview?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [PublicMediaDto | null];
}>();

const previewUrl = ref<string | null>(null);

watch(
  () => props.modelValue,
  (newMedia) => {
    if (newMedia) previewUrl.value = getMediaUrl(newMedia.filename);
    else previewUrl.value = null;
  },
  { immediate: true }
);

const handleUploadSuccess = (file: PublicMediaDto) => {
  emit("update:modelValue", file);
};
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Prévisualisation -->
    <div
      v-if="preview && previewUrl"
      class="w-32 h-32 rounded-lg overflow-hidden bg-gray-100"
    >
      <img :src="previewUrl" alt="Preview" class="w-full h-full object-cover" />
    </div>

    <!-- Upload Button -->
    <div class="flex items-center gap-2">
      <Uploader
        accept="image/*"
        :max-size="5"
        @upload-success="handleUploadSuccess"
      >
        <template #default="{ triggerUpload, isUploading }">
          <Button
            type="button"
            severity="secondary"
            :loading="isUploading"
            @click="triggerUpload"
          >
            <i class="pi pi-upload mr-2"></i>
            {{ modelValue ? "Changer l'image" : "Ajouter une image" }}
          </Button>
        </template>
      </Uploader>

      <Button
        v-if="modelValue"
        type="button"
        severity="danger"
        text
        @click="emit('update:modelValue', null)"
      >
        <i class="pi pi-trash"></i>
      </Button>
    </div>
  </div>
</template>
