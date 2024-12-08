'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import dynamic from 'next/dynamic';
import "react-datepicker/dist/react-datepicker.css";
import { IEvent } from '@/types/event';

const DatePicker = dynamic(() => import('react-datepicker'), { ssr: false });

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
    mainImage: '',
    registrationLink: ''
  });
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', e.target.files[0]);
      formData.append('category', 'events');

      const response = await axios.post('http://localhost:5000/api/upload', formData);
      setFormData(prev => ({ ...prev, mainImage: response.data.imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    try {
      setIsSaving(true);
      const response = await axios.post('http://localhost:5000/api/events', formData);
      onEventCreated?.();
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
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
          onClick={(e) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
              onClose();
            }
          }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-black/90 rounded-xl p-8 w-full max-w-4xl"
          >
            <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2 h-32"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Date</label>
                      {isMounted && (
                        <DatePicker
                          selected={formData.date ? new Date(formData.date) : null}
                          onChange={(date: Date) => setFormData(prev => ({
                            ...prev,
                            date: date.toISOString().split('T')[0]
                          }))}
                          className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block mb-2">Time</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2">Venue</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={e => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                      className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as IEvent['category'] }))}
                      className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2"
                    >
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="conference">Conference</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2">Registration Link</label>
                    <input
                      type="url"
                      value={formData.registrationLink}
                      onChange={e => setFormData(prev => ({ ...prev, registrationLink: e.target.value }))}
                      className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Event Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2"
                    />
                    {formData.mainImage && (
                      <div className="mt-2">
                        <img
                          src={formData.mainImage}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || isSaving}
                  className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  {isSaving ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}