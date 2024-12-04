export interface TeamMember {
  _id: string;
  id: string;
  name: string;
  position: string;
  education: string;
  image: string;
  linkedIn: string;
  year?: number;
  course?: string;
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