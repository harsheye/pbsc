import { IEvent } from '@/types/event';

// Mock database - in a real app, this would be a database
let events: IEvent[] = [
  {
    id: '1',
    title: 'Web Development Workshop',
    description: 'Learn modern web development techniques with React and Next.js',
    date: '2024-04-15',
    time: '10:00 AM',
    venue: 'CU Block-1 Auditorium',
    category: 'workshop',
    isUpcoming: true,
    image: '/events/workshop.jpg',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: '2',
    title: 'AI/ML Seminar',
    description: 'Exploring the latest trends in Artificial Intelligence',
    date: '2024-04-20',
    time: '2:00 PM',
    venue: 'Virtual Event',
    category: 'seminar',
    isUpcoming: true,
    image: '/events/ai-seminar.jpg',
    createdAt: new Date('2024-01-10').toISOString()
  }
];

export const eventService = {
  getAllEvents: () => {
    return events.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getUpcomingEvents: () => {
    return events.filter(event => event.isUpcoming);
  },

  getPastEvents: () => {
    return events.filter(event => !event.isUpcoming);
  },

  getEventById: (id: string) => {
    return events.find(event => event.id === id);
  },

  addEvent: (event: Omit<IEvent, 'id' | 'createdAt'>) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    events = [newEvent, ...events];
    return newEvent;
  },

  updateEvent: (id: string, updatedEvent: Partial<IEvent>) => {
    events = events.map(event => 
      event.id === id ? { ...event, ...updatedEvent } : event
    );
    return events.find(event => event.id === id);
  },

  deleteEvent: (id: string) => {
    events = events.filter(event => event.id !== id);
  }
}; 