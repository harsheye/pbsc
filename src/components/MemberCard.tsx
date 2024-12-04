import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChapterMember, LeadershipMember } from '@/types/leadership';
import { DEFAULT_IMAGE } from '@/constants/images';

interface MemberCardProps {
  member: ChapterMember | LeadershipMember;
  index: number;
}

export default function MemberCard({ member, index }: MemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-xl p-6 backdrop-blur-sm"
    >
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={member.image || DEFAULT_IMAGE}
          alt={member.name}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = DEFAULT_IMAGE;
          }}
        />
      </div>
      <h3 className="text-xl font-bold">{member.name}</h3>
      <p className="text-orange-400">{member.position}</p>
      <p className="text-sm text-gray-400">{member.education}</p>
      {'course' in member && (
        <p className="text-sm text-gray-400">{member.course}</p>
      )}
    </motion.div>
  );
} 