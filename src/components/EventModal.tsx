'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { IEvent } from '@/types/event';
import ImageUpload from '@/components/ImageUpload';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: IEvent;
  onEventCreated?: () => void;
  onEventUpdated?: () => void;
}

export default function EventModal({ 
  isOpen, 
  onClose, 
  event, 
  onEventCreated,
  onEventUpdated 
}: EventModalProps) {
  const [formData, setFormData] = useState<Partial<IEvent>>(
    event || {
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      category: 'technical',
      isUpcoming: true,
      image: ''
    }
  );

  // Get tomorrow's date in YYYY-MM-DD format
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (event?._id) {
        // Update existing event
        await axios.put(`/api/events/${event._id}`, formData);
        onEventUpdated?.();
      } else {
        // Create new event
        await axios.post('/api/events', formData);
        onEventCreated?.();
      }
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl mx-4"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">
                {event ? 'Edit Event' : 'Create Event'}
              </h2>

              {/* Title */}
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2 h-32"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-sm mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    min={minDate}
                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm mb-1">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                    required
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm mb-1">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={e => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as IEvent['category'] }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  required
                >
                  <option value="technical">Technical</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Registration Link */}
              <div>
                <label className="block text-sm mb-1">Registration Link</label>
                <input
                  type="url"
                  value={formData.registrationLink}
                  onChange={e => setFormData(prev => ({ ...prev, registrationLink: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  placeholder="Optional"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm mb-1">Event Image</label>
                <ImageUpload
                  category="event"
                  aspectRatio={16/9}
                  currentImage={formData.image}
                  onSuccess={(url) => {
                    setFormData(prev => ({
                      ...prev,
                      image: url
                    }));
                  }}
                  onError={(error) => {
                    console.error('Image upload failed:', error);
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {event ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 