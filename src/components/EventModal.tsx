'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IEvent } from '@/types/event';
import { eventService } from '@/services/eventService';

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
      images: []
    }
  );

  // Get tomorrow's date in YYYY-MM-DD format
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (event) {
        await eventService.updateEvent(event._id.toString(), formData);
        onEventUpdated?.();
      } else {
        await eventService.addEvent(formData as Omit<IEvent, '_id' | 'createdAt'>);
        onEventCreated?.();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full"
          >
            <h2 className="text-2xl font-bold text-orange-400 mb-4">
              {event ? 'Edit Event' : 'Create New Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Event Title"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  required
                />
                <select
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as IEvent['category'] }))}
                  className="bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  required
                >
                  {['technical', 'workshop', 'seminar', 'other'].map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={formData.date}
                  min={minDate}
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  required
                />
                <input
                  type="time"
                  value={formData.time}
                  onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Venue"
                  value={formData.venue}
                  onChange={e => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                  className="bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  required
                />
                <input
                  type="url"
                  placeholder="Registration Link (optional)"
                  value={formData.registrationLink}
                  onChange={e => setFormData(prev => ({ ...prev, registrationLink: e.target.value }))}
                  className="bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                />
              </div>
              <textarea
                placeholder="Event Description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2 h-32"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600"
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