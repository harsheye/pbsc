export const getFileType = (url: string): 'image' | 'video' => {
  const extension = url.split('.').pop()?.toLowerCase() || '';
  return ['mp4', 'webm'].includes(extension) ? 'video' : 'image';
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const generatePublicUrl = (category: string, filename: string): string => {
  return `/uploads/${category}/${filename}`;
};

export const isValidFileType = (file: File): boolean => {
  const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const validVideoTypes = ['video/mp4', 'video/webm'];
  return [...validImageTypes, ...validVideoTypes].includes(file.type);
};

export const getMaxFileSize = (fileType: string): number => {
  return fileType.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
}; 