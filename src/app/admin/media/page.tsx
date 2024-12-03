'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ImageUpload from '@/components/ImageUpload';
import { mediaService, MediaItem } from '@/services/mediaService';

export default function MediaManagement() {
  const [media, setMedia] = useState<MediaItem[]>(mediaService.getAllMedia());
  const [selectedCategory, setSelectedCategory] = useState<MediaItem['category']>('event');
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const handleUploadSuccess = (url: string, title: string) => {
    const newMedia = mediaService.addMedia({
      url,
      title,
      type: url.match(/\.(mp4|webm)$/) ? 'video' : 'image',
      category: selectedCategory,
      fileType: url.split('.').pop() || ''
    });
    setMedia(mediaService.getAllMedia());
    setUploadingFor(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      mediaService.deleteMedia(id);
      setMedia(mediaService.getAllMedia());
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-secondary text-transparent bg-clip-text">
            Media Management
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUploadingFor('new')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium
              hover:bg-orange-600 transition-all duration-300"
          >
            Upload New Media
          </motion.button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-4 mb-8">
          {['event', 'leader', 'other'].map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category as MediaItem['category'])}
              className={`px-6 py-2 rounded-lg transition-all ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-white'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}s
            </motion.button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {media
            .filter(item => item.category === selectedCategory)
            .map((item) => (
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
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigator.clipboard.writeText(item.url)}
                      className="bg-white/20 p-2 rounded-full"
                    >
                      Copy URL
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500/20 p-2 rounded-full"
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium truncate">{item.title}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(item.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Upload Modal */}
        {uploadingFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md mx-4">
              <h2 className="text-2xl font-bold mb-6">Upload New Media</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                    placeholder="Enter media title"
                    onChange={(e) => setUploadingFor(e.target.value)}
                  />
                </div>
                <ImageUpload
                  onSuccess={(url) => handleUploadSuccess(url, uploadingFor || 'Untitled')}
                  onError={(error) => {
                    console.error('Upload failed:', error);
                    setUploadingFor(null);
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
} 