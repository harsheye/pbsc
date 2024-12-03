'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IEvent } from '@/types/event';
import { eventService } from '@/services/eventService';
import Image from 'next/image';
import Link from 'next/link';

export default function Events() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    loadEvents();
  }, [filter, category]);

  const loadEvents = () => {
    let filteredEvents = [];
    switch (filter) {
      case 'upcoming':
        filteredEvents = eventService.getUpcomingEvents();
        break;
      case 'past':
        filteredEvents = eventService.getPastEvents();
        break;
      default:
        filteredEvents = eventService.getAllEvents();
    }

    if (category !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }
    setEvents(filteredEvents);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-secondary text-transparent bg-clip-text">
            Events
          </h1>
          <Link href="/admin">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 text-white px-6 py-2 rounded-lg font-medium
                hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              Admin Login
            </motion.button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12">
          <div className="flex gap-2">
            {['all', 'upcoming', 'past'].map((filterOption) => (
              <motion.button
                key={filterOption}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(filterOption as any)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  filter === filterOption
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-2">
            {['all', 'technical', 'workshop', 'seminar'].map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  category === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {events.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ y: -10 }}
              className="bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm border border-orange-500/10"
            >
              {event.image && (
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    event.isUpcoming ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {event.isUpcoming ? 'Upcoming' : 'Past'}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{event.description}</p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                  <p>⏰ {event.time}</p>
                  <p>📍 {event.venue}</p>
                  <p className="text-orange-400">#{event.category}</p>
                </div>
                {event.isUpcoming && event.registrationLink && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={event.registrationLink}
                    className="mt-6 block text-center bg-gradient-to-r from-orange-500 to-orange-600 
                      text-white py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 
                      transition-all duration-300"
                  >
                    Register Now
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
} 