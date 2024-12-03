import { IContactSubmission } from '@/types/contact';

let contactSubmissions: IContactSubmission[] = [];

export const contactService = {
  submitContact: (submission: IContactSubmission) => {
    contactSubmissions = [submission, ...contactSubmissions];
    return submission;
  },

  getAllSubmissions: () => {
    return contactSubmissions;
  },

  deleteSubmission: (uid: string) => {
    contactSubmissions = contactSubmissions.filter(sub => sub.uid !== uid);
  }
}; 