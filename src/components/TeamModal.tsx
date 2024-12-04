'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
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
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<Partial<ITeamMember>>({
    name: '',
    position: '',
    education: '',
    year: new Date().getFullYear(),
    course: '',
    linkedIn: '',
    image: ''
  });
  const [uploading, setUploading] = useState(false);

  // Pre-fill form data when member is provided
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        position: member.position || '',
        education: member.education || '',
        year: member.year || new Date().getFullYear(),
        course: member.course || '',
        linkedIn: member.linkedIn || '',
        image: member.image || ''
      });
    } else {
      // Reset form when adding new member
      setFormData({
        name: '',
        position: '',
        education: '',
        year: new Date().getFullYear(),
        course: '',
        linkedIn: '',
        image: ''
      });
    }
  }, [member, isOpen]); // Reset when modal opens/closes or member changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    try {
      setUploading(true);
      const formDataToSend = new FormData(formRef.current);
      
      if (member?._id) {
        // Update existing member - only send changed fields
        const changedFields = Object.entries(formData).reduce((acc, [key, value]) => {
          if (member[key as keyof ITeamMember] !== value) {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, any>);

        if (Object.keys(changedFields).length > 0) {
          await axios.patch(`http://localhost:5000/api/team/${member._id}`, formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
          onMemberUpdated?.();
        }
      } else {
        // Create new member
        await axios.post('http://localhost:5000/api/team', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        onMemberCreated?.();
      }
      onClose();
    } catch (error) {
      console.error('Error saving team member:', error);
    } finally {
      setUploading(false);
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
            className="bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6">
              {member ? 'Edit Team Member' : 'Add Team Member'}
            </h2>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields with pre-filled values */}
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  required
                />
              </div>

              {/* Position with predefined options */}
              <div>
                <label className="block text-sm mb-1">Position</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  required
                >
                  <option value="">Select Position</option>
                  <option value="Chairperson">Chairperson</option>
                  <option value="Vice Chairperson">Vice Chairperson</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Joint Secretary">Joint Secretary</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Technical Head">Technical Head</option>
                  <option value="Media Head">Media Head</option>
                  <option value="Event Head">Event Head</option>
                  <option value="Web Master">Web Master</option>
                  <option value="Member">Member</option>
                </select>
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm mb-1">Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={e => setFormData(prev => ({ ...prev, education: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  required
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm mb-1">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={e => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  min={1}
                  max={5}
                  required
                />
              </div>

              {/* Course */}
              <div>
                <label className="block text-sm mb-1">Course</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={e => setFormData(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  required
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={e => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm mb-1">Profile Image</label>
                <ImageUpload
                  category="team"
                  aspectRatio={1}
                  currentImage={formData.image}
                  onSuccess={(file) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = 'image';
                    input.value = file;
                    formRef.current?.appendChild(input);
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
                  disabled={uploading}
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Saving...' : member ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 