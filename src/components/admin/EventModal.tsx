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

    setError(null);
    setNotification(null);

    try {
      setUploading(true);
      const uploadData = new FormData();
      uploadData.append('image', file);
      uploadData.append('category', 'events');
      uploadData.append('name', formData.title || 'unnamed');

      const response = await axios.post('http://localhost:5000/api/upload', uploadData);
      
      if (response.data?.success && response.data?.imageUrl) {
        // Remove /public prefix for client-side usage
        const clientImageUrl = response.data.imageUrl.replace('/public', '');
        setFormData(prev => ({ ...prev, image: clientImageUrl }));
        setNotification({
          type: 'success',
          message: 'Image uploaded successfully!'
        });
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
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
            className="bg-black/90 rounded-xl p-8 w-full max-w-4xl"
          >
            <h2 className="text-2xl font-bold mb-6">
              {event ? 'Edit Event' : 'Create New Event'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-video rounded-lg border-2 border-dashed border-orange-500/20 
                        bg-[#0D0D0D] hover:border-orange-500/40 cursor-pointer
                        flex flex-col items-center justify-center"
                    >
                      {formData.image ? (
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <>
                          <div className="p-4 rounded-full bg-[#1A1A1A]">
                            <svg 
                              className="w-8 h-8 text-orange-500" 
                              fill="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z"/>
                              <path d="M8 11l-3 4h11l-4-6-3 4z"/>
                              <path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z"/>
                            </svg>
                          </div>
                          <p className="text-orange-500 mt-4">Click to upload event image</p>
                          <p className="text-sm text-gray-500 mt-1">Drop your image here or click to browse</p>
                          <p className="text-xs text-gray-600 mt-1">PNG, JPG up to 10MB</p>
                        </>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {uploading && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-orange-500">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-sm">Uploading...</span>
                      </div>
                    )}
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
  );
} 