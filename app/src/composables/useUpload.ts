import { useApiStore } from "@/store/apiUrls.store";
import { PublicMediaDto } from "@shared/dto/media.dto";
import { ref } from "vue";
import { useApi } from "./useApi";

export function useUpload() {
  const isUploading = ref(false);

  const upload = async (
    file: File,
    options?: {
      title?: string;
      description?: string;
    }
  ): Promise<PublicMediaDto> => {
    const apiStore = useApiStore();
    const formData = new FormData();

    formData.append("file", file);
    if (options?.title) formData.append("title", options.title);
    if (options?.description)
      formData.append("description", options.description);

    isUploading.value = true;

    try {
      const { data, error } = await useApi(apiStore.media.upload)
        .post(formData)
        .json<PublicMediaDto>();

      if (error.value) throw error.value;
      return data.value;
    } finally {
      isUploading.value = false;
    }
  };

  return {
    upload,
    isUploading,
  };
}
