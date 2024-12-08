'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { IEvent } from '@/types/event';
import EventModal from './EventModal';

export default function EventManagement() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = (event: IEvent) => {
    if (!event._id) {
      console.error('Event ID is missing');
      return;
    }
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleEventUpdated = async () => {
    try {
      await fetchEvents();
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error refreshing events:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/20 rounded-xl border border-orange-500/10 overflow-hidden group"
          >
            {/* Event Image */}
            <div className="aspect-video relative">
              <img
                src={event.image || '/images/default.png'}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <span className="text-white font-medium">{event.title}</span>
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 bg-orange-500/80 rounded-lg hover:bg-orange-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-gray-400">{event.venue}</p>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  event.isUpcoming 
                    ? 'bg-green-500/10 text-green-400' 
                    : 'bg-gray-500/10 text-gray-400'
                }`}>
                  {event.isUpcoming ? 'Upcoming' : 'Past'}
                </span>
              </div>
              
              <div className="text-sm text-gray-500">
                <div>Date: {new Date(event.date).toLocaleDateString()}</div>
                <div>Time: {event.time}</div>
                <div>Category: {event.category}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onEventCreated={handleEventUpdated}
        event={selectedEvent}
      />
    </div>
  );
} 