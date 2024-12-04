'use client';
import { useState, useRef, useEffect } from 'react';
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
  const imgRef = useRef<HTMLImageElement>(null);

  // Create preview when image changes
  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  const getCroppedImg = async () => {
    if (!imgRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply transformations
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
      crop.width,
      crop.height
    );

    // Image optimization
    const quality = 0.9; // Adjust quality (0.1 to 1.0)
    const maxWidth = 1920; // Max width for optimization
    
    // Resize if width is larger than maxWidth
    if (canvas.width > maxWidth) {
      const ratio = maxWidth / canvas.width;
      const newCanvas = document.createElement('canvas');
      newCanvas.width = maxWidth;
      newCanvas.height = canvas.height * ratio;
      const newCtx = newCanvas.getContext('2d');
      if (newCtx) {
        newCtx.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);
        canvas.width = newCanvas.width;
        canvas.height = newCanvas.height;
        ctx.drawImage(newCanvas, 0, 0);
      }
    }

    // Convert canvas to blob with quality setting
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
        },
        'image/jpeg',
        quality
      );
    });

    // Create file from blob
    const croppedFile = new File([blob], image.name, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });

    onCropComplete(croppedFile);
    onClose();
  };

  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  const handleRotate = (degrees: number) => {
    setRotation(prev => (prev + degrees) % 360);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Crop Image</h2>
              <div className="flex items-center gap-4">
                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleZoom(-0.1)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-sm">{Math.round(scale * 100)}%</span>
                  <button
                    onClick={() => handleZoom(0.1)}
                    className="p-1 hover:bg-gray-700 rounded"
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
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <span className="text-sm">{rotation}°</span>
                  <button
                    onClick={() => handleRotate(90)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setScale(1);
                    setRotation(0);
                  }}
                  className="text-sm text-orange-500 hover:text-orange-400"
                >
                  Reset
                </button>
              </div>
            </div>
            
            <div className="relative aspect-video w-full mb-4 bg-black/50 rounded-lg overflow-hidden">
              {preview && (
                <ReactCrop
                  crop={crop}
                  onChange={c => setCrop(c)}
                  aspect={aspectRatio}
                >
                  <img
                    ref={imgRef}
                    src={preview}
                    alt="Crop preview"
                    className="max-h-[60vh] w-full object-contain transition-transform"
                    style={{
                      transform: `scale(${scale}) rotate(${rotation}deg)`
                    }}
                  />
                </ReactCrop>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={getCroppedImg}
                className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 