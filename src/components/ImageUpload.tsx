'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export interface ImageUploadProps {
  onSuccess: (url: string) => void;
  currentImage?: string;
  className?: string;
}

export default function ImageUpload({ onSuccess, currentImage, className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.imageUrl) {
        setPreview(response.data.imageUrl);
        onSuccess(response.data.imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {preview ? (
        <div className="relative w-32 h-32 mx-auto">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity
              flex items-center justify-center text-white rounded-lg"
          >
            Change Image
          </button>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-orange-500/30 rounded-lg
            flex items-center justify-center text-gray-400 hover:text-orange-500
            hover:border-orange-500 transition-colors"
          disabled={uploading}
        >
          {uploading ? (
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"
              />
              <span>Uploading...</span>
            </div>
          ) : (
            <span>Click to upload image</span>
          )}
        </motion.button>
      )}
    </div>
  );
} 