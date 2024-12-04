import { MongoDocument } from './common';

// Old event format (for migration)
export interface ILegacyEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'technical' | 'workshop' | 'seminar' | 'other';
  isUpcoming: boolean;
  image?: string;
  registrationLink?: string;
  createdAt: string;
}

// New event format (MongoDB)
export interface IEvent extends MongoDocument {
  _id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'technical' | 'workshop' | 'seminar' | 'other';
  isUpcoming: boolean;
  mainImage: string;
  imageStack: string[];
  createdAt?: string;
} 