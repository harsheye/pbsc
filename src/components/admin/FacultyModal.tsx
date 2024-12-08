'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { IFacultyMember } from '@/types/faculty';
import Notification from '@/components/Notification';

interface FacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFacultyMemberCreated?: () => void;
  member: IFacultyMember | null;
}

export default function FacultyModal({
  isOpen,
  onClose,
  onFacultyMemberCreated,
  member
}: FacultyModalProps) {
  const [formData, setFormData] = useState<Partial<IFacultyMember>>({
    name: '',
    position: '',
    education: '',
    linkedIn: '',
    image: '',
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        position: member.position,
        education: member.education,
        linkedIn: member.linkedIn,
        image: member.image,
      });
    } else {
      setFormData({
        name: '',
        position: '',
        education: '',
        linkedIn: '',
        image: '',
      });
    }
  }, [member]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setNotification(null);

    try {
      setUploading(true);
      const uploadData = new FormData();
      uploadData.append('image', file);
      uploadData.append('category', 'leader');
      uploadData.append('name', formData.name || 'unnamed');

      const response = await axios.post('http://localhost:5000/api/upload', uploadData);
      
      if (response.data?.success && response.data?.imageUrl) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    try {
      setError(null);
      setIsSaving(true);

      if (!formData.name || !formData.position || !formData.education) {
        setError('Please fill in all required fields');
        return;
      }

      const endpoint = member 
        ? `http://localhost:5000/api/faculty/${member._id}`
        : 'http://localhost:5000/api/faculty';
      
      const method = member ? 'PATCH' : 'POST';
      
      const response = await axios({
        method,
        url: endpoint,
        data: formData,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        onFacultyMemberCreated?.();
        onClose();
        setNotification({
          type: 'success',
          message: `Faculty member ${member ? 'updated' : 'created'} successfully!`
        });
      } else {
        throw new Error(response.data?.error || `Failed to ${member ? 'update' : 'create'} faculty member`);
      }
    } catch (error: any) {
      console.error('Error saving faculty member:', error);
      setError(error.response?.data?.error || error.message || `Failed to ${member ? 'update' : 'create'} faculty member`);
      setNotification({
        type: 'error',
        message: `Failed to ${member ? 'update' : 'create'} faculty member`
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

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
              className="bg-black/90 rounded-xl p-8 w-full max-w-4xl"
            >
              <h2 className="text-2xl font-bold mb-6">
                {member ? 'Edit Faculty Member' : 'Add New Faculty Member'}
              </h2>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Position *</label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Education *</label>
                      <input
                        type="text"
                        value={formData.education}
                        onChange={e => setFormData(prev => ({ ...prev, education: e.target.value }))}
                        className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                      <input
                        type="url"
                        value={formData.linkedIn}
                        onChange={e => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                        className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  {/* Right Column - Image Upload */}
                  <div className="space-y-6">
                    <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-orange-500/10">
                      <h3 className="text-xl font-semibold text-orange-400 mb-6">Profile Image</h3>
                      
                      <div className="space-y-4">
                        {formData.image ? (
                          <div className="relative group">
                            <div className="aspect-square w-48 rounded-xl overflow-hidden border-2 border-orange-500/20">
                              <img
                                src={formData.image}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="p-2 bg-orange-500/80 rounded-full hover:bg-orange-500 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, image: '' }));
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                  }}
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
                            onClick={() => fileInputRef.current?.click()}
                            className="w-48 aspect-square rounded-xl border-2 border-dashed border-orange-500/20 hover:border-orange-500/40 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-300"
                          >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Click to upload profile image</span>
                            <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                          </button>
                        )}

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />

                        {uploading && (
                          <div className="flex items-center gap-2 text-orange-500">
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Uploading image...</span>
                          </div>
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
                    {isSaving ? 'Saving...' : member ? 'Update' : 'Create'}
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