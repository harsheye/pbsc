'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mediaService } from '@/services/mediaService';
import { MediaItem } from '@/types/media';

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'event' | 'leader'>('all');

  useEffect(() => {
    // Initialize media from storage
    const storedMedia = mediaService.initializeMedia();
    setMedia(storedMedia);
  }, []);

  const filteredMedia = selectedCategory === 'all' 
    ? media 
    : media.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-orange-400">Media Library</h2>
        <div className="flex gap-4">
          {['all', 'event', 'leader'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as typeof selectedCategory)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-white'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMedia.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white/5 rounded-xl overflow-hidden group"
          >
            <div className="relative aspect-square">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  controls
                />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                flex items-center justify-center gap-4 transition-opacity">
                <button
                  onClick={() => navigator.clipboard.writeText(item.url)}
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30"
                >
                  Copy URL
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-400">
                {new Date(item.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 