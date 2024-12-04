'use client';
import { useState, useRef } from 'react';
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
  const [formData, setFormData] = useState<Partial<IFaculty>>(
    faculty || {
      id: Date.now().toString(), // Generate unique ID
      name: '',
      position: '',
      education: '',
      year: '',
      course: '',
      linkedIn: '',
      image: ''
    }
  );
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    try {
      setUploading(true);
      const formDataToSend = new FormData(formRef.current);
      
      if (faculty?._id) {
        // Update existing faculty
        await axios.patch(`http://localhost:5000/api/faculty/${faculty._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        onFacultyUpdated?.();
      } else {
        // Create new faculty
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
            className="bg-gray-900 rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6">
              {faculty ? 'Edit Faculty' : 'Add Faculty'}
            </h2>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="id" value={formData.id} />

              {/* Name */}
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

              {/* Position */}
              <div>
                <label className="block text-sm mb-1">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                  required
                />
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
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={e => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
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
                  category="faculty"
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
                  {uploading ? 'Saving...' : faculty ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 