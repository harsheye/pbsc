'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: File;
  onCropComplete: (croppedImage: File) => void;
  aspectRatio?: number;
}

export default function ImageCropModal({
  isOpen,
  onClose,
  image,
  onCropComplete,
  aspectRatio = 1
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  const handleRotate = (degrees: number) => {
    setRotation(prev => (prev + degrees) % 360);
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  const handleClickOutside = useCallback((e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose]);

  const getCroppedImg = async () => {
    if (!imgRef.current) return;
    setIsCropping(true);

    try {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = Math.floor(crop.width * scaleX);
      canvas.height = Math.floor(crop.height * scaleY);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.translate(canvas.width/2, canvas.height/2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.translate(-canvas.width/2, -canvas.height/2);

      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create image blob'));
          },
          'image/jpeg',
          0.95
        );
      });

      const croppedFile = new File([blob], image.name, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      console.log('Cropped image created:', {
        originalSize: image.size,
        croppedSize: croppedFile.size,
        dimensions: `${canvas.width}x${canvas.height}`
      });

      await onCropComplete(croppedFile);
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
      alert(error instanceof Error ? error.message : 'Failed to crop image. Please try again.');
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100]"
          onClick={handleClickOutside}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex flex-col p-4 md:p-8"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Crop Image
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-6 bg-black/80 backdrop-blur-sm p-4 rounded-xl border border-orange-500/10">
              {/* Zoom Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleZoom(-0.1)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-sm min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
                  <button
                    onClick={() => handleZoom(0.1)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Rotation Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRotate(-90)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <span className="text-sm min-w-[60px] text-center">{rotation}°</span>
                  <button
                    onClick={() => handleRotate(90)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setScale(1);
                  setRotation(0);
                }}
                className="px-4 py-2 bg-orange-500/20 rounded-lg text-orange-400 hover:bg-orange-500/30 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Crop Area */}
            <div className="flex-1 bg-black/30 rounded-xl flex items-center justify-center overflow-hidden">
              {preview && (
                <ReactCrop
                  crop={crop}
                  onChange={c => setCrop(c)}
                  aspect={aspectRatio}
                  className="max-w-full max-h-full"
                >
                  <img
                    ref={imgRef}
                    src={preview}
                    alt="Crop preview"
                    className="max-h-[calc(100vh-12rem)] w-auto object-contain transition-transform"
                    style={{
                      transform: `scale(${scale}) rotate(${rotation}deg)`
                    }}
                  />
                </ReactCrop>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={onClose}
                disabled={isCropping}
                className="px-6 py-2.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={getCroppedImg}
                disabled={isCropping}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg 
                  hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20
                  disabled:opacity-50 min-w-[100px]"
              >
                {isCropping ? 'Applying...' : 'Apply Crop'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 