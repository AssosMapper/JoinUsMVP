import { useApi } from "@/composables/useApi";
import { useApiStore } from "@/store/apiUrls.store";
import { Media } from "@shared/types/media";

const mediaService = {
  uploadFile: async (file: File, title?: string, description?: string) => {
    const apiStore = useApiStore();
    const formData = new FormData();
    formData.append("file", file);
    if (title) formData.append("title", title);
    if (description) formData.append("description", description);

    const { data, error } = await useApi(apiStore.media.upload)
      .post(formData)
      .json<Media>();

    if (error.value) throw error.value;
    return data.value;
  },

  getMediaUrl: (media?: Media | null) => {
    if (!media) return null;
    return `${import.meta.env.VITE_API_BASE_URL}/${media.filepath}`;
  },
};

export default mediaService;
