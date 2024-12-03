import { IEvent } from '@/types/event';
import { IContactSubmission } from '@/types/contact';
import { LeadershipMember, ChapterMember } from '@/types/leadership';

// Initial Events Data
export const initialEvents: IEvent[] = [
  {
    id: '1',
    title: 'Web Development Workshop',
    description: 'Learn modern web development techniques with React and Next.js',
    date: '2024-04-15',
    time: '10:00 AM',
    venue: 'CU Block-1 Auditorium',
    category: 'workshop',
    isUpcoming: true,
    image: '/events/workshop.jpg',
    createdAt: new Date('2024-01-15').toISOString()
  },
  // Add more events here
];

// Initial Leadership Data
export const initialLeadership: LeadershipMember[] = [
  {
    name: "Dr. R.S. Bawa",
    position: "Vice Chancellor",
    education: "Ph.D. in Computer Science",
    year: "",
    image: "/leaders/vc.jpg",
    linkedin: "https://linkedin.com/in/rsbawa",
    description: "Leading Chandigarh University with excellence and innovation."
  },
  // Add more leadership members here
];

// Initial Chapter Members Data
export const initialChapterMembers: ChapterMember[] = [
  {
    name: "Kavya",
    position: "Chairperson",
    image: "/leaders/chairperson.jpg",
    linkedIn: "https://linkedin.com/in/kavya",
    education: "B.Tech",
    year: "4th Year",
    course: "Computer Science"
  },
  // Add more chapter members here
];

// Initial Contact Submissions
export const initialContacts: IContactSubmission[] = []; 