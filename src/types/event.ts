export interface IEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  image?: string;
  category: 'technical' | 'workshop' | 'seminar' | 'other';
  registrationLink?: string;
  isUpcoming: boolean;
  createdAt: string;
} 