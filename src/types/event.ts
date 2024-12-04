import { ObjectId } from 'mongodb';

export interface IEvent {
  _id?: string | ObjectId;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'technical' | 'workshop' | 'seminar' | 'other';
  isUpcoming: boolean;
  image?: string;
  registrationLink?: string;
  createdAt?: Date;
} 