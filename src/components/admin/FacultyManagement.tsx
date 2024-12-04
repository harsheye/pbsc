import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ImageUpload from '../ImageUpload';

interface FacultyMember {
  _id: string;
  id: string;
  name: string;
  position: string;
  education: string;
  image: string;
  linkedIn: string;
}

export default function FacultyManagement() {
  const [members, setMembers] = useState<FacultyMember[]>([]);
  const [editingMember, setEditingMember] = useState<FacultyMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/faculty');
      setMembers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching faculty members:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editingMember) {
        await axios.patch(`http://localhost:5000/api/faculty/${editingMember._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('http://localhost:5000/api/faculty', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchMembers();
      setIsModalOpen(false);
      setEditingMember(null);
    } catch (error) {
      console.error('Error saving faculty member:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-orange-500">Faculty Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Add Faculty
        </button>
      </div>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => (
          <motion.div
            key={member._id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/30 rounded-lg p-6 border border-orange-500/20"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-center mb-2">{member.name}</h3>
            <p className="text-orange-500 text-center mb-4">{member.position}</p>
            <div className="space-y-2 text-gray-400">
              <p>Education: {member.education}</p>
              {member.linkedIn && (
                <a 
                  href={member.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400 transition-colors"
                >
                  LinkedIn Profile
                </a>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingMember(member);
                  setIsModalOpen(true);
                }}
                className="px-3 py-1 bg-orange-500/20 rounded hover:bg-orange-500/30 transition-colors"
              >
                Edit
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <FacultyModal
          member={editingMember}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMember(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function FacultyModal({ member, onClose, onSubmit }: { 
  member: FacultyMember | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl font-semibold mb-4">
          {member ? 'Edit Faculty' : 'Add Faculty'}
        </h3>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" value={member?.id || ''} />
          
          {/* Basic Information */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={member?.name || ''}
              className="w-full bg-black/50 rounded px-3 py-2 border border-orange-500/30"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Position</label>
            <input
              type="text"
              name="position"
              defaultValue={member?.position || ''}
              className="w-full bg-black/50 rounded px-3 py-2 border border-orange-500/30"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Education</label>
            <input
              type="text"
              name="education"
              defaultValue={member?.education || ''}
              className="w-full bg-black/50 rounded px-3 py-2 border border-orange-500/30"
              required
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm mb-1">LinkedIn URL</label>
            <input
              type="url"
              name="linkedIn"
              defaultValue={member?.linkedIn || ''}
              className="w-full bg-black/50 rounded px-3 py-2 border border-orange-500/30"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm mb-1">Profile Image</label>
            <ImageUpload
              currentImage={member?.image}
              onSuccess={(url) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'image';
                input.value = url;
                formRef.current?.appendChild(input);
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 rounded hover:bg-orange-600 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 