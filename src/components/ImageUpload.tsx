'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadProps {
  currentImage?: string;
  onSuccess: (url: string) => void;
  onError?: (error: string) => void;
  category: 'team' | 'faculty' | 'event' | 'media';
  aspectRatio?: number;
}

export default function ImageUpload({ 
  currentImage, 
  onSuccess, 
  onError, 
  category,
  aspectRatio = 1 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 95,
    height: 95,
    x: 2.5,
    y: 2.5
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setPreview(reader.result?.toString() || null);
        setShowCropper(true);
      });
      setSelectedFile(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: PixelCrop
  ): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        1
      );
    });
  };

  const handleUpload = async () => {
    if (!imgRef.current || !selectedFile) return;

    try {
      setUploading(true);
      const croppedImage = await getCroppedImg(imgRef.current, crop as PixelCrop);
      
      // Create a new file from the cropped blob
      const croppedFile = new File([croppedImage], selectedFile.name, {
        type: 'image/jpeg',
      });

      const formData = new FormData();
      formData.append('image', croppedFile);
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
      setShowCropper(false);
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(scale + delta, 0.5), 3);
    setScale(newScale);
  };

  useEffect(() => {
    const img = imgRef.current;
    if (img && showCropper) {
      img.addEventListener('wheel', handleWheel);
      return () => img.removeEventListener('wheel', handleWheel);
    }
  }, [showCropper]);

  return (
    <div className="relative w-full">
      {showCropper && preview ? (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Crop Image</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-sm">{Math.round(scale * 100)}%</span>
                  <button
                    onClick={() => setScale(s => Math.min(s + 0.1, 3))}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => setScale(1)}
                  className="text-sm text-orange-500 hover:text-orange-400"
                >
                  Reset Zoom
                </button>
              </div>
            </div>
            <div className="relative w-full max-h-[70vh] overflow-hidden mb-4">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={aspectRatio}
                className="max-h-full flex justify-center"
              >
                <img
                  ref={imgRef}
                  src={preview}
                  alt="Crop preview"
                  className="max-h-[70vh] object-contain transition-transform"
                  style={{ transform: `scale(${scale})` }}
                />
              </ReactCrop>
            </div>
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-400">
                Drag to adjust the crop area
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCropper(false)}
                  className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="px-6 py-2 bg-orange-500 rounded hover:bg-orange-600 transition-colors flex items-center gap-2"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <span>Upload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
              onChange={onSelectFile}
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
              Click to select image
            </span>
          </motion.div>
        </div>
      )}

      {/* Loading Indicator */}
      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
} 