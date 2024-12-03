type StorageKey = 'events' | 'contacts' | 'leadership' | 'chapterMembers' | 'media';

export const storage = {
  save: (key: StorageKey, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  },

  load: <T>(key: StorageKey, defaultValue: T): T => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return defaultValue;
    }
  },

  clear: (key: StorageKey) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error clearing ${key}:`, error);
    }
  }
}; 