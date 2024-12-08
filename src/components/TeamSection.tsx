'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useApi } from '@/hooks/useApi';
import { ITeamMember } from '@/types/team';
import TeamModal from '@/components/admin/TeamModal';

export default function TeamSection() {
  const { data: members, loading, mutate } = useApi<ITeamMember>('/team');
  const [selectedMember, setSelectedMember] = useState<ITeamMember | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (member: ITeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleMemberUpdated = () => {
    mutate(); // Refresh the data
    setIsModalOpen(false);
    setSelectedMember(undefined);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <motion.div
            key={member._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="group bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm relative"
          >
            <div className="aspect-square relative">
              <Image
                src={member.image || '/images/default-avatar.png'}
                alt={member.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/default-avatar.png';
                }}
              />
              
              {/* Edit Button Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleEdit(member)}
                  className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-orange-400">{member.position}</p>
              {member.education && (
                <p className="text-gray-400 mt-2">{member.education}</p>
              )}
              {member.course && member.year && (
                <p className="text-gray-400 mt-1">
                  {member.course} • Year {member.year}
                </p>
              )}
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
                  <span>Edit</span>
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <TeamModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMember(undefined);
        }}
        onTeamMemberCreated={handleMemberUpdated}
        member={selectedMember}
      />
    </>
  );
} 