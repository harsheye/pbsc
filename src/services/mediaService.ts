import { MediaItem } from '@/types/media';
import { storage } from '@/utils/storage';

let mediaItems: MediaItem[] = storage.load<MediaItem[]>('media', []);

export const mediaService = {
  getAllMedia: () => mediaItems,
  
  addMedia: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString()
    };
    mediaItems = [newItem, ...mediaItems];
    storage.save('media', mediaItems);
    return newItem;
  },

  deleteMedia: (id: string) => {
    mediaItems = mediaItems.filter(item => item.id !== id);
    storage.save('media', mediaItems);
  },

  getMediaByCategory: (category: MediaItem['category']) => {
    return mediaItems.filter(item => item.category === category);
  }
}; 