'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ITeamMember } from '@/types/team';
import TeamModal from './TeamModal';

export default function TeamManagement() {
  const [members, setMembers] = useState<ITeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ITeamMember | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/team');
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEditMember = (member: ITeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleMemberCreated = () => {
    fetchMembers();
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading team members...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => (
          <motion.div
            key={member._id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/30 rounded-lg border border-orange-500/20 relative group"
          >
            {/* Quick Edit Button - Always visible on hover */}
            <button
              onClick={() => handleEditMember(member)}
              className="absolute top-4 right-4 px-3 py-1.5 bg-orange-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </button>

            <div className="p-6">
              {/* Member Info */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={member.image || '/images/default-avatar.png'}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-orange-500/20"
                />
                <div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-orange-500">{member.position}</p>
                </div>
              </div>

              {/* Member Details */}
              <div className="space-y-2 text-gray-400">
                <p>{member.education}</p>
                {member.course && member.year && (
                  <p>{member.course} • Year {member.year}</p>
                )}
                {member.linkedIn && (
                  <a
                    href={member.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-orange-400 hover:text-orange-300 mt-3"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn Profile</span>
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
          No team members found. Add your first team member!
        </div>
      )}

      {/* Team Modal */}
      <TeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTeamMemberCreated={handleMemberCreated}
        member={selectedMember}
      />
    </div>
  );
}