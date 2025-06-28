export const getMediaUrl = (path?: string | null): string | null => {
  if (!path) return null;

  if (path.startsWith("/"))
    return `${import.meta.env.VITE_API_BASE_URL}` + path;

  return `${import.meta.env.VITE_API_BASE_URL}/` + path;
};
