export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  title: string;
  uploadedAt: string;
  category: 'event' | 'leader' | 'other';
  fileType: string;
}

export interface UploadResponse {
  url: string;
  fileType: string;
  type: 'image' | 'video';
  size: number;
} 