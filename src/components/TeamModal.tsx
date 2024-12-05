'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ITeamMember } from '@/types/team';
import ImageUpload from './ImageUpload';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: ITeamMember;
  onMemberCreated?: () => void;
  onMemberUpdated?: () => void;
}

export default function TeamModal({
  isOpen,
  onClose,
  member,
  onMemberCreated,
  onMemberUpdated
}: TeamModalProps) {
  const [formData, setFormData] = useState<Partial<ITeamMember>>(
    member || {
      name: '',
      position: '',
      education: '',
      year: undefined,
      course: '',
      image: '',
      linkedIn: ''
    }
  );
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (member?._id) {
        // Update existing member
        const response = await axios.patch(`http://localhost:5000/api/team/${member._id}`, formData);
        if (response.data.success) {
          onMemberUpdated?.();
          setNotification({ type: 'success', message: 'Team member updated successfully!' });
        }
      } else {
        // Create new member
        const response = await axios.post('http://localhost:5000/api/team', formData);
        if (response.data.success) {
          onMemberCreated?.();
          setNotification({ type: 'success', message: 'Team member created successfully!' });
        }
      }
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotification({ 
        type: 'error', 
        message: 'Failed to save team member. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-4xl bg-gray-900/90 backdrop-blur-lg rounded-2xl p-8 overflow-y-auto max-h-[90vh]"
          >
            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ... other form fields ... */}

              {/* Image Upload */}
              <div className="col-span-4 space-y-6">
                <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-orange-500/10">
                  <h3 className="text-xl font-semibold text-orange-400 mb-6">Profile Image</h3>
                  
                  <ImageUpload
                    category="team"
                    aspectRatio={1}
                    currentImage={formData.image}
                    onSuccess={(url: string) => {
                      console.log('Image uploaded:', url);
                      setFormData(prev => ({
                        ...prev,
                        image: url
                      }));
                    }}
                    onError={(error: string) => {
                      console.error('Image upload failed:', error);
                      setNotification({
                        type: 'error',
                        message: 'Failed to upload image'
                      });
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg border border-orange-500/20 hover:bg-orange-500/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Saving...' : member ? 'Update' : 'Create'}
                </button>
              </div>
            </form>

            {/* Notification */}
            <AnimatePresence>
              {notification && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg
                    ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  {notification.message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 