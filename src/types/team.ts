import { ObjectId } from 'mongodb';

export interface ITeamMember {
  _id?: string | ObjectId;
  name: string;
  position: string;
  education: string;
  image?: string;
  linkedIn?: string;
  year?: number;
  course?: string;
  createdAt?: Date;
}

export const POSITION_HIERARCHY = [
  'Faculty Advisor',
  'Assistant Professor',
  'Chair',
  'Vice Chair',
  'Secretary',
  'Treasurer',
  'Technical Head',
  'Media Head',
  'Event Head',
  'Web Master',
  'Member'
] as const; 