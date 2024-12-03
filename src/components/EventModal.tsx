'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { eventService } from '@/services/eventService';
import { IEvent } from '@/types/event';
import ImageUpload from './ImageUpload';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

type EventCategory = 'technical' | 'workshop' | 'seminar' | 'other';

export default function EventModal({ isOpen, onClose, onEventCreated }: EventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'technical' as EventCategory,
    isUpcoming: true,
    image: '',
    registrationLink: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't submit if still uploading
    if (isUploading) {
      return;
    }

    try {
      await eventService.addEvent(formData);
      onEventCreated();
      onClose();
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        category: 'technical' as EventCategory,
        isUpcoming: true,
        image: '',
        registrationLink: ''
      });
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleImageUploadStart = () => {
    setIsUploading(true);
    setUploadError(null);
  };

  const handleImageUploadSuccess = (url: string) => {
    setIsUploading(false);
    setUploadError(null);
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleImageUploadError = (error: any) => {
    setIsUploading(false);
    setUploadError(error.message || 'Failed to upload image');
    console.error('Image upload failed:', error);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900 p-8 rounded-xl w-full max-w-2xl mx-4"
            onClick={handleModalClick}
          >
            <h2 className="text-2xl font-bold mb-6 text-orange-400">Create New Event</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2 
                      focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ 
                      ...prev, 
                      category: e.target.value as EventCategory 
                    }))}
                    className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  >
                    <option value="technical">Technical</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Venue
                </label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={e => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Image
                </label>
                <div className="space-y-2">
                  <ImageUpload
                    category="event"
                    onSuccess={handleImageUploadSuccess}
                    onError={handleImageUploadError}
                    onUploadStart={handleImageUploadStart}
                  />
                  {uploadError && (
                    <p className="text-red-500 text-sm">{uploadError}</p>
                  )}
                  {formData.image && (
                    <div className="relative h-40 rounded-lg overflow-hidden">
                      <img
                        src={formData.image}
                        alt="Event preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="absolute top-2 right-2 bg-red-500/80 text-white p-2 rounded-full
                          hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Registration Link
                </label>
                <input
                  type="url"
                  value={formData.registrationLink}
                  onChange={e => setFormData(prev => ({ ...prev, registrationLink: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 
                    transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 
                    transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? 'Uploading...' : 'Create Event'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 