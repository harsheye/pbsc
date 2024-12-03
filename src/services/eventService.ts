import { IEvent } from '@/types/event';
import { initialEvents } from '@/data/store';

// Use initial data from store
let events: IEvent[] = [...initialEvents];

// Add image validation
const isValidImageUrl = (url: string) => {
  if (!url) return true; // Optional image
  try {
    new URL(url);
    return url.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/) !== null;
  } catch {
    return false;
  }
};

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
    if (event.image && !isValidImageUrl(event.image)) {
      throw new Error('Invalid image URL');
    }

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