'use client';
import { useState, useEffect, useRef } from 'react';
import AdminTabs from '@/components/admin/AdminTabs';
import AdminContent from '@/components/admin/AdminContent';
import LayoutWrapper from '@/components/LayoutWrapper';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Tab = 'team' | 'faculty' | 'events' | 'contact';

// Add this CSS for custom styling (you can add it to your globals.css)
const datePickerStyles = `
  .react-datepicker {
    font-family: inherit;
    background-color: #0D0D0D;
    border: 1px solid rgba(249, 115, 22, 0.2);
    border-radius: 0.5rem;
    color: white;
  }
  .react-datepicker__header {
    background-color: #1A1A1A;
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
`;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('adminActiveTab') as Tab) || 'team';
    }
    return 'team';
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'workshop',
    image: '',
    registrationLink: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadData = new FormData();
      uploadData.append('image', file);
      uploadData.append('category', 'events');
      uploadData.append('name', formData.title || 'unnamed');

      const response = await axios.post('http://localhost:5000/api/upload', uploadData);
      
      if (response.data?.success && response.data?.imageUrl) {
        const clientImageUrl = response.data.imageUrl.replace('/public', '');
        setFormData(prev => ({ ...prev, image: clientImageUrl }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.date || !formData.venue || !formData.image) {
        alert('Please fill in all required fields and upload an image');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/events', formData);
      
      if (response.data?.success) {
        setIsModalOpen(false);
        // Reset form data
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          venue: '',
          category: 'workshop',
          image: '',
          registrationLink: ''
        });
        // Show success message
        alert('Event created successfully!');
        // Optionally refresh events list
      } else {
        throw new Error(response.data?.error || 'Failed to create event');
      }
    } catch (error: any) {
      console.error('Error creating event:', error);
      alert(error.response?.data?.error || 'Failed to create event');
    }
  };

  const getTabTitle = () => {
    switch(activeTab) {
      case 'team':
        return 'Team Members';
      case 'faculty':
        return 'Faculty Management';
      case 'events':
        return 'Event Management';
      case 'contact':
        return 'Contact Messages';
      default:
        return '';
    }
  };

  const handleAddEvent = () => {
    setIsModalOpen(true);
  };

  const handleAddFaculty = () => {
    // Handle faculty addition
  };

  return (
    <LayoutWrapper includeHeader={true}>
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-orange-500 mb-8">Admin Dashboard</h1>
          
          <div className="flex gap-8">
            {/* Left Navigation */}
            <div className="w-64 shrink-0">
              <div className="bg-black/30 rounded-xl border border-orange-500/20 p-4">
                <h2 className="text-xl font-semibold mb-4">Navigation</h2>
                <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1">
              <div className="bg-black/30 rounded-xl border border-orange-500/20 p-6">
                {/* Dynamic Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-orange-500">{getTabTitle()}</h2>
                  {/* Only show Add button for faculty and events */}
                  {(activeTab === 'faculty' || activeTab === 'events') && (
                    <button
                      onClick={activeTab === 'events' ? handleAddEvent : handleAddFaculty}
                      className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                    >
                      <span>Add {activeTab === 'faculty' ? 'Faculty' : 'Event'}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Content */}
                <AdminContent activeTab={activeTab} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 rounded-xl p-8 w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
            
            <div className="space-y-6">
              {/* Grid Layout for Form Fields */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2.5 h-32"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <div className="relative">
                      <DatePicker
                        selected={formData.date ? new Date(formData.date) : null}
                        onChange={(date: Date | null) => {
                          if (date) {
                            setFormData(prev => ({ 
                              ...prev, 
                              date: date.toISOString().split('T')[0] 
                            }));
                          }
                        }}
                        dateFormat="MMMM d, yyyy"
                        minDate={new Date()}
                        placeholderText="Select event date"
                        className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2.5 cursor-pointer"
                        calendarClassName="!bg-[#0D0D0D]"
                        showPopperArrow={false}
                        popperPlacement="bottom-start"
                        popperModifiers={[{
                          name: 'offset',
                          options: {
                            offset: [0, 8]
                          },
                          fn: ({ state }) => {
                            state.styles.popper = {
                              ...state.styles.popper,
                              marginTop: '8px'
                            };
                            return state;
                          }
                        }]}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg 
                          className="w-5 h-5 text-orange-500" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                          />
                        </svg>
                      </div>
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

                {/* Right Column */}
                <div className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2.5"
                      required
                    >
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="conference">Conference</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

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

                  {/* Attractive Image Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Event Image</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative group cursor-pointer"
                    >
                      {formData.image ? (
                        // Image Preview
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <img 
                            src={formData.image} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300 flex items-center justify-center">
                            <p className="text-white">Click to change image</p>
                          </div>
                        </div>
                      ) : (
                        // Upload Button
                        <div className="aspect-video rounded-lg border-2 border-dashed border-orange-500/20 
                          bg-[#0D0D0D] hover:border-orange-500/40 transition-colors
                          flex flex-col items-center justify-center gap-4"
                        >
                          <div className="p-4 rounded-full bg-[#1A1A1A]">
                            <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z"/>
                              <path d="M8 11l-3 4h11l-4-6-3 4z"/>
                              <path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z"/>
                            </svg>
                          </div>
                          <div className="text-center">
                            <p className="text-orange-500">Click to upload event image</p>
                            <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                          </div>
                        </div>
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

              {/* Footer Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-orange-500/20">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#252525]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
} 