'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { IFacultyMember } from '@/types/faculty';
import FacultyModal from './FacultyModal';

export default function FacultyManagement() {
  const [members, setMembers] = useState<IFacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<IFacultyMember | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/faculty');
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching faculty members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const handleEditMember = (member: IFacultyMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleMemberCreated = () => {
    fetchMembers();
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading faculty members...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Faculty Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => (
          <motion.div
            key={member._id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/30 rounded-lg border border-orange-500/20 relative group"
          >
            <div className="p-6">
              {/* Member Info */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <img
                    src={member.image || '/images/default-avatar.png'}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-orange-500">{member.position}</p>
                  </div>
                </div>
                
                {/* Edit Button */}
                <button
                  onClick={() => handleEditMember(member)}
                  className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </div>

              {/* Member Details */}
              <div className="space-y-2 text-gray-400">
                <p>{member.education}</p>
                {member.linkedIn && (
                  <a
                    href={member.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 mt-3"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {members.length === 0 && (
        <div className="text-center text-gray-400 py-12 bg-black/20 rounded-xl border border-orange-500/10">
          No faculty members found. Add your first faculty member!
        </div>
      )}

      {/* Faculty Modal */}
      <FacultyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFacultyMemberCreated={handleMemberCreated}
        member={selectedMember}
      />
    </div>
  );
} 