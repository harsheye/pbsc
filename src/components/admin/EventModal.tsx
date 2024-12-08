'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import dynamic from 'next/dynamic';
import "react-datepicker/dist/react-datepicker.css";
import { IEvent } from '@/types/event';
import Image from 'next/image';
import Notification from '@/components/Notification';

const DatePicker = dynamic(() => import('react-datepicker'), { ssr: false }) as any;

const customDatePickerStyles = `
  .react-datepicker-wrapper {
    width: 100%;
    display: block;
  }

  .react-datepicker-popper {
    position: absolute !important;
    inset: auto auto auto 0 !important;
    transform: translate(0, 0) !important;
    margin-top: 1px !important;
    z-index: 9999 !important;
  }

  .react-datepicker {
    font-family: inherit;
    background-color: rgba(0, 0, 0, 0.9);
    border: 1px solid rgba(249, 115, 22, 0.2);
    border-radius: 0.5rem;
    color: white;
  }

  .react-datepicker__header {
    background-color: rgba(0, 0, 0, 0.5);
    border-bottom: 1px solid rgba(249, 115, 22, 0.2);
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: rgb(249, 115, 22);
  }

  .react-datepicker__day {
    color: white;
  }

  .react-datepicker__day:hover {
    background-color: rgba(249, 115, 22, 0.2);
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: rgb(249, 115, 22) !important;
    color: white !important;
  }

  .react-datepicker__day--disabled {
    color: rgba(255, 255, 255, 0.3);
  }

  .react-datepicker__navigation-icon::before {
    border-color: rgb(249, 115, 22);
  }

  .react-datepicker__today-button {
    background-color: rgba(249, 115, 22, 0.2);
    color: rgb(249, 115, 22);
    border-top: 1px solid rgba(249, 115, 22, 0.2);
  }

  .react-datepicker__triangle {
    display: none;
  }
`;

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: () => void;
  event?: IEvent;
}

export default function EventModal({
  isOpen,
  onClose,
  onEventCreated,
  event
}: EventModalProps): JSX.Element {
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
    registrationLink: '',
    imageStack: []
  });
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customDatePickerStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Initialize form data with event data if editing
  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        date: new Date(event.date).toISOString().split('T')[0]
      });
    }
  }, [event]);

  // Function to check if a date is in the future
  const isDateUpcoming = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    return eventDate > today;
  };

  // Update form data when date changes
  const handleDateChange = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      date: dateStr,
      isUpcoming: isDateUpcoming(dateStr) // Automatically set isUpcoming based on date
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    try {
      setError(null);
      setIsSaving(true);
      
      // Validate required fields
      if (!formData.title || !formData.date || !formData.venue) {
        setError('Please fill in all required fields');
        return;
      }
      
      const response = await axios.post('http://localhost:5000/api/events', {
        ...formData,
        isUpcoming: isDateUpcoming(formData.date),
        imageStack: formData.imageStack || []
      });
      
      if (response.data?.success) {
        onEventCreated?.();
        onClose();
      } else {
        throw new Error(response.data?.error || 'Failed to create event');
      }
    } catch (error: any) {
      console.error('Error saving event:', error);
      setError(error.response?.data?.error || error.message || 'Failed to create event');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);
    setNotification(null);

    try {
      setUploading(true);
      const uploadData = new FormData();
      uploadData.append('image', file);
      uploadData.append('category', 'events');
      uploadData.append('title', formData.title || 'event');
      uploadData.append('date', formData.date || new Date().toISOString().split('T')[0]);

      const response = await axios.post('http://localhost:5000/api/upload', uploadData);
      
      if (response.data?.success && response.data?.imageUrl) {
        setFormData(prev => ({ ...prev, image: response.data.imageUrl }));
        setNotification({
          type: 'success',
          message: 'Image uploaded successfully!'
        });
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageError('Failed to upload image. Please try again.');
      setNotification({
        type: 'error',
        message: 'Failed to upload image'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-black/90 rounded-xl p-8 w-full max-w-4xl overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-2xl font-bold mb-6">
                {event ? 'Edit Event' : 'Create New Event'}
              </h2>
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Event Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2.5"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2.5 h-32"
                        required
                      />
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Date</label>
                        <div className="relative">
                          <DatePicker
                            selected={formData.date ? new Date(formData.date) : null}
                            onChange={handleDateChange}
                            className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2.5"
                            dateFormat="MMMM d, yyyy"
                            minDate={new Date()}
                            excludeDates={[new Date()]}
                            placeholderText="Select future date"
                            required
                            calendarClassName="bg-black/90 border-orange-500/20"
                            showPopperArrow={false}
                            popperPlacement="bottom"
                            popperModifiers={[
                              {
                                name: 'preventOverflow',
                                options: {
                                  boundary: 'viewport',
                                  padding: 8
                                }
                              }
                            ]}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Time</label>
                        <input
                          type="time"
                          value={formData.time}
                          onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                          className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2.5"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Venue */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Venue</label>
                      <input
                        type="text"
                        value={formData.venue}
                        onChange={e => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                        className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2.5"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as IEvent['category'] }))}
                        className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2.5"
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
                      <label className="block text-sm font-medium mb-2">Registration Link</label>
                      <input
                        type="url"
                        value={formData.registrationLink}
                        onChange={e => setFormData(prev => ({ ...prev, registrationLink: e.target.value }))}
                        className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2.5"
                        placeholder="https://..."
                      />
                    </div>

                    {/* Event Image */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Event Image</label>
                      <div className="space-y-4">
                        {/* Hidden file input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />

                        {/* Image upload button or preview */}
                        {formData.image ? (
                          <div className="relative group">
                            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-orange-500/20">
                              <img
                                src={formData.image}
                                alt="Event preview"
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Overlay with actions */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button
                                  type="button"
                                  onClick={handleImageClick}
                                  className="p-2 bg-orange-500/80 rounded-full hover:bg-orange-500 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={handleImageRemove}
                                  className="p-2 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={handleImageClick}
                            className="w-full aspect-video rounded-lg border-2 border-dashed border-orange-500/20 hover:border-orange-500/40 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-300"
                          >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Click to upload event image</span>
                          </button>
                        )}

                        {/* Error message */}
                        {imageError && (
                          <p className="text-sm text-red-400">{imageError}</p>
                        )}

                        {/* Upload status */}
                        {uploading && (
                          <p className="text-sm text-orange-500">Uploading image...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-orange-500/20">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || isSaving}
                    className="px-6 py-2.5 bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 min-w-[100px]"
                  >
                    {isSaving ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
} 