<script setup lang="ts">
import { computed, ref } from "vue";

interface Props {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  rounded: true,
  src: null,
});

const imageLoadError = ref(false);

const sizeClasses = computed(
  () =>
    ({
      sm: "w-10 h-10 text-sm",
      md: "w-20 h-20 text-3xl",
      lg: "w-32 h-32 text-4xl",
    }[props.size])
);

const roundedClass = computed(() => (props.rounded ? "rounded-lg" : ""));

const firstLetter = computed(() => props.name.charAt(0).toUpperCase());

const backgroundColor = computed(() => {
  const colors = [
    "bg-blue-500",
    "bg-red-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
  ];
  const index =
    props.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
});

const shouldShowImage = computed(() => {
  return props.src && props.src.trim() !== "" && !imageLoadError.value;
});

const handleImageError = () => {
  imageLoadError.value = true;
};
</script>

<template>
  <div :class="[sizeClasses, roundedClass]">
    <img
      v-if="shouldShowImage"
      :src="props.src!"
      :alt="name"
      @error="handleImageError"
      :class="['w-full h-full object-contain', roundedClass]"
    />
    <div
      v-else
      :class="[
        'w-full h-full flex items-center justify-center text-white',
        backgroundColor,
        roundedClass,
      ]"
    >
      {{ firstLetter }}
    </div>
  </div>
</template>
