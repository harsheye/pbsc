'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { IFaculty } from '@/types/faculty';
import ImageUpload from './ImageUpload';

interface FacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty?: IFaculty;
  onFacultyCreated?: () => void;
  onFacultyUpdated?: () => void;
}

export default function FacultyModal({
  isOpen,
  onClose,
  faculty,
  onFacultyCreated,
  onFacultyUpdated
}: FacultyModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<Partial<IFaculty>>({
    name: '',
    position: '',
    education: '',
    linkedIn: '',
    image: ''
  });
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill form data when faculty is provided
  useEffect(() => {
    if (faculty) {
      setFormData({
        name: faculty.name || '',
        position: faculty.position || '',
        education: faculty.education || '',
        linkedIn: faculty.linkedIn || '',
        image: faculty.image || ''
      });
    }
  }, [faculty]);

  const handleClickOutside = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    try {
      setIsSaving(true);
      const formDataToSend = new FormData(formRef.current);
      
      if (faculty?._id) {
        await axios.patch(`http://localhost:5000/api/faculty/${faculty._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        onFacultyUpdated?.();
      } else {
        await axios.post('http://localhost:5000/api/faculty', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        onFacultyCreated?.();
      }
      onClose();
    } catch (error) {
      console.error('Error saving faculty:', error);
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
            className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-8 w-full max-w-7xl max-h-[95vh] 
              overflow-hidden shadow-2xl border border-orange-500/20"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative mb-8 pb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  {faculty ? 'Edit Faculty Member' : 'Add Faculty Member'}
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
            <div className="overflow-y-auto max-h-[calc(95vh-12rem)] pr-4 -mr-4">
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 gap-8">
                  {/* Left Column - Basic Information */}
                  <div className="col-span-8 space-y-6">
                    <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-orange-500/10">
                      <h3 className="text-xl font-semibold text-orange-400 mb-6">Basic Information</h3>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                          <label className="block text-sm mb-1.5">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 transition-colors"
                            required
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm mb-1.5">Position</label>
                          <select
                            name="position"
                            value={formData.position}
                            onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
                            className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 transition-colors"
                            required
                          >
                            <option value="">Select Position</option>
                            <option value="Professor">Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                            <option value="Faculty Advisor">Faculty Advisor</option>
                          </select>
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm mb-1.5">Education</label>
                          <input
                            type="text"
                            name="education"
                            value={formData.education}
                            onChange={e => setFormData(prev => ({ ...prev, education: e.target.value }))}
                            className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 transition-colors"
                            required
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm mb-1.5">LinkedIn URL</label>
                          <input
                            type="url"
                            name="linkedIn"
                            value={formData.linkedIn}
                            onChange={e => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                            className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 transition-colors"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Image Upload */}
                  <div className="col-span-4 space-y-6">
                    <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-orange-500/10">
                      <h3 className="text-xl font-semibold text-orange-400 mb-6">Profile Image</h3>
                      
                      <ImageUpload
                        category="faculty"
                        aspectRatio={1}
                        currentImage={formData.image}
                        onSuccess={(url: string) => {
                          const input = document.createElement('input');
                          input.type = 'hidden';
                          input.name = 'image';
                          input.value = url;
                          formRef.current?.appendChild(input);
                          setFormData(prev => ({
                            ...prev,
                            image: url
                          }));
                        }}
                        onError={(error: string) => {
                          console.error('Image upload failed:', error);
                        }}
                      />

                      {/* Image Preview */}
                      {formData.image && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium mb-3">Preview</h4>
                          <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-orange-500/20">
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
                    disabled={uploading || isSaving}
                    className="px-6 py-2.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || isSaving}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg 
                      hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 min-w-[100px]
                      shadow-lg shadow-orange-500/20"
                  >
                    {isSaving ? 'Saving...' : faculty ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 