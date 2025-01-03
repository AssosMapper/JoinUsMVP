import { Media } from "@shared/types/media";

export const getMediaUrl = (
  mediaOrId?: Media | string | null
): string | null => {
  if (!mediaOrId) return null;

  const filename =
    typeof mediaOrId === "string" ? mediaOrId : mediaOrId.filename;

  return `${import.meta.env.VITE_API_BASE_URL}/uploads/${filename}`;
};
