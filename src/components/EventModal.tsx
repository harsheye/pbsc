'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import dynamic from 'next/dynamic';
import "react-datepicker/dist/react-datepicker.css";
import { IEvent } from '@/types/event';
import ImageUpload from './ImageUpload';

// Import DatePicker with proper type casting
const DatePicker = dynamic(
  () => import('react-datepicker').then((mod) => mod.default), 
  { ssr: false }
) as any; // Use type assertion to avoid TypeScript errors

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: () => void;
}

export default function EventModal({
  isOpen,
  onClose,
  onEventCreated
}: EventModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<Partial<IEvent>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    venue: '',
    category: 'workshop',
    isUpcoming: true,
    image: '',
    registrationLink: ''
  });
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isImageCropping, setIsImageCropping] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClickOutside = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      if (!isImageCropping) { // Only close if not cropping
        onClose();
      }
    }
  }, [onClose, isImageCropping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    try {
      setIsSaving(true);
      
      // Create event data object
      const eventData = {
        title: formData.title || '',
        description: formData.description || '',
        date: formData.date || '',
        time: formData.time || '',
        venue: formData.venue || '',
        category: formData.category || 'workshop',
        isUpcoming: true,
        mainImage: formData.image || '', // Include the image URL
        registrationLink: formData.registrationLink || ''
      };

      console.log('Sending event data:', eventData); // Debug log

      const response = await axios.post('http://localhost:5000/api/events', eventData);
      console.log('Server response:', response.data); // Debug log

      onEventCreated?.();
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      setNotification({
        type: 'error',
        message: 'Failed to create event'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClickOutside}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-8 w-full max-w-[98vw] max-h-[98vh] 
              overflow-hidden shadow-2xl border border-orange-500/20"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative mb-8 pb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Create New Event
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
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(98vh-12rem)] pr-4 -mr-4">
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 gap-8">
                  {/* Left Column - Event Details */}
                  <div className="col-span-8 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-orange-500/10">
                      <h3 className="text-xl font-semibold text-orange-400 mb-6">Event Details</h3>
                      
                      <div className="grid grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="col-span-2">
                          <label className="block text-sm mb-1.5">Event Title</label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 transition-colors"
                            required
                          />
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                          <label className="block text-sm mb-1.5">Description</label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 transition-colors h-32"
                            required
                          />
                        </div>

                        {/* Date & Time */}
                        <div>
                          <label className="block text-sm mb-1.5">Date</label>
                          {isMounted && ( // Only render DatePicker on client
                            <DatePicker
                              selected={formData.date ? new Date(formData.date) : null}
                              onChange={(date: Date | null) => setFormData(prev => ({ 
                                ...prev, 
                                date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                              }))}
                              minDate={new Date()}
                              dateFormat="MMMM d, yyyy"
                              className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 transition-colors"
                            />
                          )}
                        </div>

                        <div>
                          <label className="block text-sm mb-1.5">Time</label>
                          <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                            className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 transition-colors"
                            required
                          />
                        </div>

                        {/* Venue */}
                        <div className="col-span-2">
                          <label className="block text-sm mb-1.5">Venue</label>
                          <input
                            type="text"
                            name="venue"
                            value={formData.venue}
                            onChange={e => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                            className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 transition-colors"
                            required
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-sm mb-1.5">Category</label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as IEvent['category'] }))}
                            className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 transition-colors"
                            required
                          >
                            <option value="workshop">Workshop</option>
                            <option value="seminar">Seminar</option>
                            <option value="conference">Conference</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        {/* Registration Link */}
                        <div>
                          <label className="block text-sm mb-1.5">Registration Link</label>
                          <input
                            type="url"
                            name="registrationLink"
                            value={formData.registrationLink}
                            onChange={e => setFormData(prev => ({ ...prev, registrationLink: e.target.value }))}
                            className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 transition-colors"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Image Upload */}
                  <div className="col-span-4 space-y-6">
                    <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-orange-500/10">
                      <h3 className="text-xl font-semibold text-orange-400 mb-6">Event Image</h3>
                      
                      <ImageUpload
                        category="event"
                        aspectRatio={16/9}
                        currentImage={formData.image}
                        onSuccess={(url: string) => {
                          setFormData(prev => ({
                            ...prev,
                            image: url
                          }));
                          setIsImageCropping(false);
                          setNotification({
                            type: 'success',
                            message: 'Image uploaded successfully!'
                          });
                          setTimeout(() => setNotification(null), 3000);
                        }}
                        onError={(error: string) => {
                          console.error('Image upload failed:', error);
                          setIsImageCropping(false);
                          setNotification({
                            type: 'error',
                            message: 'Failed to upload image. Please try again.'
                          });
                          setTimeout(() => setNotification(null), 3000);
                        }}
                        onCropStart={() => setIsImageCropping(true)}
                      />

                      {/* Image Preview */}
                      {formData.image && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium mb-3">Preview</h4>
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-orange-500/20">
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-orange-500/20">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={uploading || isSaving || isImageCropping}
                    className="px-6 py-2.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || isSaving || isImageCropping}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg 
                      hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 min-w-[100px]
                      shadow-lg shadow-orange-500/20"
                  >
                    {isSaving ? 'Creating...' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
              : 'bg-red-500/20 border border-red-500/30 text-red-400'
          }`}
        >
          {notification.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
} 