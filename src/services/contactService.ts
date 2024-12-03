import { IContactSubmission } from '@/types/contact';
import { initialContacts } from '@/data/store';

// Use initial data from store
let submissions: IContactSubmission[] = [...initialContacts];

export const contactService = {
  getAllSubmissions: () => submissions,

  addSubmission: (submission: Omit<IContactSubmission, 'timestamp'>) => {
    const newSubmission = {
      ...submission,
      timestamp: new Date()
    };
    submissions = [newSubmission, ...submissions];
    return newSubmission;
  },

  deleteSubmission: (uid: string) => {
    submissions = submissions.filter(sub => sub.uid !== uid);
  }
}; 