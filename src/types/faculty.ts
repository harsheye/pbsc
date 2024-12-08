import { ObjectId } from 'mongodb';

export interface IFacultyMember {
  _id?: string | ObjectId;
  name: string;
  position: string;
  education: string;
  image?: string;
  linkedIn?: string;
  createdAt?: Date;
} 