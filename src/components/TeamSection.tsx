'use client';
import { motion } from 'framer-motion';
import { useApi } from '@/hooks/useApi';
import { TeamMember } from '@/types/team';
import { DEFAULT_IMAGE } from '@/constants/images';

export default function TeamSection() {
  const { data: members, loading } = useApi<TeamMember>('/team');

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <motion.div
          key={member._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          className="bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm"
        >
          <div className="aspect-square relative">
            <img
              src={member.image || DEFAULT_IMAGE}
              alt={member.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="text-orange-400">{member.position}</p>
            {/* Add other member details */}
          </div>
        </motion.div>
      ))}
    </div>
  );
} 