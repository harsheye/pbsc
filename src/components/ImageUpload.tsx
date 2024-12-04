'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { mediaService } from '@/services/mediaService';

interface ImageUploadProps {
  onSuccess: (url: string) => void;
  onError: (error: any) => void;
  onUploadStart?: () => void;
  category: 'event' | 'leader';
  title?: string;
}

export default function ImageUpload({ onSuccess, onError, onUploadStart, category, title = 'Uploaded file' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      onUploadStart?.();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      mediaService.addMedia({
        url: data.url,
        type: data.type,
        title,
        category,
        fileType: data.fileType
      });

      onSuccess(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      onError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm'];
    const validTypes = [...validImageTypes, ...validVideoTypes];

    if (!validTypes.includes(file.type)) {
      onError('Invalid file type. Please use JPG, PNG, WebP for images or MP4, WebM for videos.');
      return false;
    }

    // Max size: 10MB for images, 50MB for videos
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      onError(`File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
      return false;
    }

    return true;
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && validateFile(file)) {
            handleUpload(file);
          }
        }}
      />
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleButtonClick}
        disabled={uploading}
        className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-3
          hover:bg-black/70 transition-all duration-300 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Choose File'}
      </motion.button>
      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="text-white">Uploading...</div>
        </div>
      )}
    </div>
  );
} 