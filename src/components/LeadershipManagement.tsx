'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LeadershipMember, ChapterMember } from '@/types/leadership';
import { leadershipService } from '@/services/leadershipService';
import ImageUpload from './ImageUpload';

interface EditLeaderModalProps {
  type: 'leadership' | 'chapter';
  data: LeadershipMember | ChapterMember;
  onClose: () => void;
  onSave: (data: LeadershipMember | ChapterMember) => void;
  onImageUpload: (url: string) => void;
}

export default function LeadershipManagement() {
  const [leadership, setLeadership] = useState(leadershipService.getAllLeadership());
  const [chapterMembers, setChapterMembers] = useState(leadershipService.getAllChapterMembers());
  const [editingLeader, setEditingLeader] = useState<{ type: 'leadership' | 'chapter'; index: number } | null>(null);

  const handleImageUpload = (url: string, type: 'leadership' | 'chapter', index: number) => {
    leadershipService.updatePosition(type, index, { image: url });
    refreshData();
  };

  const refreshData = () => {
    setLeadership(leadershipService.getAllLeadership());
    setChapterMembers(leadershipService.getAllChapterMembers());
  };

  const handleSave = (type: 'leadership' | 'chapter', index: number, data: LeadershipMember | ChapterMember) => {
    leadershipService.updatePosition(type, index, data);
    setEditingLeader(null);
    refreshData();
  };

  return (
    <div className="space-y-8">
      {/* Faculty Leadership */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-orange-400">Faculty Leadership</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {leadership.map((leader, index) => (
            <motion.div
              key={index}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-sm"
            >
              <div className="relative h-48 mb-4">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => setEditingLeader({ type: 'leadership', index })}
                  className="absolute top-2 right-2 bg-orange-500/80 p-2 rounded-full"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{leader.name}</h3>
                <p className="text-orange-400">{leader.position}</p>
                <p className="text-sm text-gray-400">{leader.education}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Chapter Leadership */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-orange-400">Chapter Leadership</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {chapterMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-sm"
            >
              <div className="relative h-48 mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => setEditingLeader({ type: 'chapter', index })}
                  className="absolute top-2 right-2 bg-orange-500/80 p-2 rounded-full"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-orange-400">{member.position}</p>
                <p className="text-sm text-gray-400">{member.education} • {member.year}</p>
                <p className="text-sm text-gray-400">{member.course}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Edit Modal */}
      {editingLeader && (
        <EditLeaderModal
          type={editingLeader.type}
          data={editingLeader.type === 'leadership' 
            ? leadership[editingLeader.index] 
            : chapterMembers[editingLeader.index]}
          onClose={() => setEditingLeader(null)}
          onSave={(data: LeadershipMember | ChapterMember) => 
            handleSave(editingLeader.type, editingLeader.index, data)}
          onImageUpload={(url: string) => 
            handleImageUpload(url, editingLeader.type, editingLeader.index)}
        />
      )}
    </div>
  );
}

function EditLeaderModal({ type, data, onClose, onSave, onImageUpload }: EditLeaderModalProps) {
  const [formData, setFormData] = useState<LeadershipMember | ChapterMember>(data);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-2xl mx-4">
        <h2 className="text-2xl font-bold mb-6 text-orange-400">
          Edit {type === 'leadership' ? 'Faculty Leader' : 'Chapter Member'}
        </h2>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Education</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
              />
            </div>

            {type === 'chapter' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Course</label>
                <input
                  type="text"
                  value={(formData as ChapterMember).course}
                  onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
              <div className="space-y-2">
                <ImageUpload
                  category="leader"
                  onSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  onError={(error) => console.error('Upload failed:', error)}
                />
                {formData.image && (
                  <div className="relative h-40 rounded-lg overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 bg-red-500/80 text-white p-2 rounded-full
                        hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-gray-700 text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-orange-500 text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
} 