import { LeadershipMember, ChapterMember } from '@/types/leadership';
import { initialLeadership, initialChapterMembers } from '@/data/store';

// Use initial data from store
let leadership: LeadershipMember[] = [...initialLeadership];
let chapterMembers: ChapterMember[] = [...initialChapterMembers];

export const leadershipService = {
  getAllLeadership: () => leadership,
  getAllChapterMembers: () => chapterMembers,

  updateLeadership: (index: number, member: LeadershipMember) => {
    leadership[index] = member;
    return leadership;
  },

  updateChapterMember: (index: number, member: ChapterMember) => {
    chapterMembers[index] = member;
    return chapterMembers;
  },

  updatePosition: (type: 'leadership' | 'chapter', index: number, updates: Partial<LeadershipMember | ChapterMember>) => {
    if (type === 'leadership') {
      leadership[index] = { ...leadership[index], ...updates };
      return leadership[index];
    } else {
      chapterMembers[index] = { ...chapterMembers[index], ...updates };
      return chapterMembers[index];
    }
  }
}; 