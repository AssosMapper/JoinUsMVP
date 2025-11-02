<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Button from 'primevue/button';
import { ref, watch } from 'vue';

interface Props {
  modelValue: string;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  height?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'save', content: string): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Commencez à taper...',
  loading: false,
  disabled: false,
  height: '300px',
});

const emit = defineEmits<Emits>();

const content = ref<string>(props.modelValue);

// Synchroniser avec le modelValue parent
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue;
  }
});

// Émettre les changements vers le parent
watch(content, (newValue) => {
  emit('update:modelValue', newValue);
});

// Options configurées pour Quill Editor
const quillOptions = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] as string[] }, { 'background': [] as string[] }],
      [{ 'font': [] as string[] }],
      [{ 'align': [] as string[] }],
      ['clean'],
      ['link', 'image']
    ]
  },
  placeholder: props.placeholder,
  theme: 'snow'
};

const handleSave = (): void => {
  emit('save', content.value);
};

const handleCancel = (): void => {
  emit('cancel');
};
</script>

<template>
  <div class="wysiwyg-editor space-y-4">
    <div class="editor-container">
      <QuillEditor
        v-model:content="content"
        contentType="html"
        theme="snow"
        :options="quillOptions"
        :style="{ height: height }"
        :readonly="disabled"
      />
    </div>
    
    <div class="flex gap-2 justify-end">
      <Button
        @click="handleCancel"
        label="Annuler"
        severity="secondary"
        size="small"
        :disabled="loading"
      />
      <Button
        @click="handleSave"
        label="Sauvegarder"
        :loading="loading"
        :disabled="disabled"
        size="small"
      />
    </div>
  </div>
</template>

<style scoped>
.wysiwyg-editor {
  @apply w-full;
}

.editor-container {
  @apply border border-gray-300 rounded-md overflow-hidden;
}

:deep(.ql-editor) {
  min-height: 200px;
}

:deep(.ql-toolbar) {
  border-bottom: 1px solid #e5e7eb;
}

:deep(.ql-container) {
  border-top: none;
}
</style>
