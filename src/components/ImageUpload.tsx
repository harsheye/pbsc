'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ImageUploadProps {
  currentImage?: string;
  onSuccess: (url: string) => void;
  onError?: (error: string) => void;
  category: 'team' | 'faculty' | 'event' | 'media';
}

export default function ImageUpload({ currentImage, onSuccess, onError, category }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', category);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setPreview(data.url);
      onSuccess(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* Preview Area */}
      <div className="relative w-full h-48 bg-black/30 rounded-lg overflow-hidden group">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span>No image selected</span>
          </div>
        )}

        {/* Upload Overlay */}
        <motion.div 
          className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ opacity: 1 }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleUpload(file);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <svg
            className="w-8 h-8 text-white mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-white text-sm">
            {uploading ? 'Uploading...' : 'Click to upload'}
          </span>
        </motion.div>
      </div>

      {/* Loading Indicator */}
      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
} 