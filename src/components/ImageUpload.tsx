'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ImageCropModal from './ImageCropModal';

interface ImageUploadProps {
  onSuccess: (url: string) => void;
  onError?: (error: string) => void;
  category: 'team' | 'faculty' | 'event' | 'media';
  currentImage?: string;
  aspectRatio?: number;
  onCropStart?: () => void;
  onCropEnd?: () => void;
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

export default function ImageUpload({
  onSuccess,
  onError,
  category,
  currentImage,
  aspectRatio = 1,
  onCropStart,
  onCropEnd
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setShowCropModal(true);
      onCropStart?.();
    }
  };

  const handleCropComplete = async (croppedFile: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', croppedFile);
      formData.append('category', category);

      console.log('Uploading cropped image:', {
        name: croppedFile.name,
        size: croppedFile.size,
        type: croppedFile.type
      });

      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success && response.data.imageUrl) {
        const imageUrl = response.data.imageUrl;
        console.log('Image uploaded successfully:', imageUrl);
        setPreview(imageUrl);
        onSuccess(imageUrl);
        setNotification({
          type: 'success',
          message: 'Image uploaded successfully!'
        });
      } else {
        throw new Error(response.data.error || 'Failed to upload image');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setNotification({
        type: 'error',
        message: errorMessage
      });
      onError?.(errorMessage);
    } finally {
      setUploading(false);
      setShowCropModal(false);
      onCropEnd?.();
    }
  };

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <>
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
            onChange={handleFileSelect}
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
            {uploading ? 'Uploading...' : 'Click to select image'}
          </span>
        </motion.div>

        {/* Loading Indicator */}
        {uploading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-white">Uploading image...</span>
            </div>
          </div>
        )}

        {notification && (
          <div className="absolute inset-x-0 bottom-0 bg-green-500/20 border-t border-green-500/30 p-2 text-sm text-green-400 text-center">
            {notification.message}
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 text-green-400 hover:text-green-300"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Crop Modal */}
      {selectedFile && (
        <ImageCropModal
          isOpen={showCropModal}
          onClose={() => {
            setShowCropModal(false);
            setSelectedFile(null);
          }}
          image={selectedFile}
          onCropComplete={handleCropComplete}
          aspectRatio={aspectRatio}
        />
      )}
    </>
  );
} 