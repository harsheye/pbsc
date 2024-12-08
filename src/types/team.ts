import { ObjectId } from 'mongodb';

export interface ITeamMember {
  _id?: string | ObjectId;
  id: string;
  name: string;
  position: string;
  education: string;
  year: number;
  course: string;
  image?: string;
  linkedIn?: string;
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