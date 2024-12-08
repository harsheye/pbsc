import { ObjectId } from 'mongodb';

export interface IEvent {
  _id?: string;
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'workshop' | 'seminar' | 'conference' | 'other';
  isUpcoming: boolean;
  image: string;
  registrationLink?: string;
  imageStack: string[];
  createdAt?: Date;
} 