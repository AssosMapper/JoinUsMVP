export interface Media {
  id: string;
  title?: string;
  description?: string;
  filename: string;
  filepath: string;
  mimetype: string;
  size: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicMedia extends Omit<Media, "filepath"> {}
