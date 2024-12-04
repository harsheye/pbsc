'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { teamService } from '@/services/teamService';
import { DEFAULT_IMAGE } from '@/constants/images';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'faculty' | 'leadership' | 'chapter';
  onMemberAdded?: () => void;
}

export default function TeamModal({ isOpen, onClose, type, onMemberAdded }: TeamModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    education: '',
    image: DEFAULT_IMAGE,
    linkedin: '',
    description: '',
    course: '',
    year: type === 'chapter' ? new Date().getFullYear().toString() : ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          data.append(key, value);
        }
      });
      data.append('type', type);

      await teamService.addTeamMember(data);
      onMemberAdded?.();
      onClose();
    } catch (error) {
      console.error('Failed to add team member:', error);
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 p-6 rounded-xl w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">
              Add {type.charAt(0).toUpperCase() + type.slice(1)} Member
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                required
              />

              <input
                type="text"
                placeholder="Position"
                value={formData.position}
                onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                required
              />

              <input
                type="text"
                placeholder="Education"
                value={formData.education}
                onChange={e => setFormData(prev => ({ ...prev, education: e.target.value }))}
                className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                required
              />

              <input
                type="url"
                placeholder="LinkedIn URL"
                value={formData.linkedin}
                onChange={e => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2 h-24"
              />

              {type === 'chapter' && (
                <input
                  type="text"
                  placeholder="Course"
                  value={formData.course}
                  onChange={e => setFormData(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  required
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  image: e.target.files?.[0] || null 
                }))}
                className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
              />

              <div className="flex gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg"
                >
                  Add Member
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 