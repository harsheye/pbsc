'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LeadershipMember, ChapterMember } from '@/types/leadership';
import { leadershipService } from '@/services/leadershipService';
import ImageUpload from './ImageUpload';
import { getImageUrl, handleImageError } from '@/utils/imageUtils';
import { DEFAULT_IMAGE } from '@/constants/images';

interface EditLeaderModalProps {
  type: 'leadership' | 'chapter';
  data: LeadershipMember | ChapterMember;
  onClose: () => void;
  onSave: (data: LeadershipMember | ChapterMember) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
}

export default function LeadershipManagement() {
  const [leadership, setLeadership] = useState<LeadershipMember[]>([]);
  const [chapterMembers, setChapterMembers] = useState<ChapterMember[]>([]);
  const [editingLeader, setEditingLeader] = useState<{ type: 'leadership' | 'chapter'; id: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const handleImageUpload = (url: string, type: 'leadership' | 'chapter', id: string) => {
    try {
      const updatedMember = leadershipService.updateMemberImage(type, id, url);
      if (updatedMember) {
        if (type === 'leadership') {
          setLeadership(prev => prev.map(member => 
            member.id === id ? updatedMember as LeadershipMember : member
          ));
        } else {
          setChapterMembers(prev => prev.map(member => 
            member.id === id ? updatedMember as ChapterMember : member
          ));
        }
      }
    } catch (error) {
      console.error('Failed to update image:', error);
    }
  };

  const refreshData = () => {
    setLeadership(leadershipService.getAllLeadership());
    setChapterMembers(leadershipService.getAllChapterMembers());
  };

  const handleSave = (type: 'leadership' | 'chapter', id: string, data: LeadershipMember | ChapterMember) => {
    try {
      const updatedMember = leadershipService.updateMember(type, id, data);
      if (updatedMember) {
        if (type === 'leadership') {
          setLeadership(prev => prev.map(member => 
            member.id === id ? updatedMember as LeadershipMember : member
          ));
        } else {
          setChapterMembers(prev => prev.map(member => 
            member.id === id ? updatedMember as ChapterMember : member
          ));
        }
        setEditingLeader(null);
      }
    } catch (error) {
      console.error('Failed to update member:', error);
    }
  };

  const currentEditingMember = editingLeader ? (
    editingLeader.type === 'leadership'
      ? leadership.find(leader => leader.id === editingLeader.id)
      : chapterMembers.find(member => member.id === editingLeader.id)
  ) : null;

  return (
    <div className="space-y-8">
      {/* Faculty Leadership */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-orange-400">Faculty Leadership</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {leadership.map((leader) => (
            <motion.div
              key={leader.id}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-sm"
            >
              <div className="relative h-48 mb-4">
                <img
                  src={leader.image || DEFAULT_IMAGE}
                  alt={leader.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = DEFAULT_IMAGE;
                  }}
                />
                <button
                  onClick={() => setEditingLeader({ type: 'leadership', id: leader.id })}
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
          {chapterMembers.map((member) => (
            <motion.div
              key={member.id}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-sm"
            >
              <div className="relative h-48 mb-4">
                <img
                  src={member.image || DEFAULT_IMAGE}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = DEFAULT_IMAGE;
                  }}
                />
                <button
                  onClick={() => setEditingLeader({ type: 'chapter', id: member.id })}
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
      {editingLeader && currentEditingMember && (
        <EditLeaderModal
          type={editingLeader.type}
          data={currentEditingMember}
          onClose={() => setEditingLeader(null)}
          onSave={(data: LeadershipMember | ChapterMember) => 
            handleSave(editingLeader.type, editingLeader.id, data)}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />
      )}
    </div>
  );
}

function EditLeaderModal({ type, data, onClose, onSave, isUploading, setIsUploading }: EditLeaderModalProps) {
  const [formData, setFormData] = useState<LeadershipMember | ChapterMember>(data);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    
    try {
      setSaveError(null);
      await onSave(formData);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes');
    }
  };

  const handleImageUploadStart = () => {
    setIsUploading(true);
    setUploadError(null);
  };

  const handleImageUploadSuccess = (url: string) => {
    setIsUploading(false);
    setUploadError(null);
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleImageUploadError = (error: any) => {
    setIsUploading(false);
    setUploadError(error.message || 'Failed to upload image');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-2xl mx-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-orange-400">
          Edit {type === 'leadership' ? 'Faculty Leader' : 'Chapter Member'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  onSuccess={handleImageUploadSuccess}
                  onError={handleImageUploadError}
                  onUploadStart={handleImageUploadStart}
                />
                {uploadError && (
                  <p className="text-red-500 text-sm">{uploadError}</p>
                )}
                {formData.image && (
                  <div className="relative h-40 rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(formData.image)}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      onError={handleImageError}
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
                disabled={isUploading}
                className={`px-6 py-2 rounded-lg bg-orange-500 text-white
                  ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUploading ? 'Uploading...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
        
        {saveError && (
          <p className="text-red-500 text-sm mb-4">{saveError}</p>
        )}
      </div>
    </motion.div>
  );
} 