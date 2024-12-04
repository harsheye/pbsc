'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { RippleBackground } from '@/components/ui/RippleBackground';
import Footer from '@/components/Footer';

interface IEvent {
  _id: string;
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'workshop' | 'seminar' | 'conference' | 'other';
  isUpcoming: boolean;
  image: string;
  imageStack: string[];
  createdAt: string;
  registrationLink?: string;
}

export default function Events() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, filter, category]);

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

  const filterEvents = () => {
    let result = [...events];

    // Apply time filter
    if (filter === 'upcoming') {
      result = result.filter(event => event.isUpcoming);
    } else if (filter === 'past') {
      result = result.filter(event => !event.isUpcoming);
    }

    // Apply category filter
    if (category !== 'all') {
      result = result.filter(event => event.category === category);
    }

    // Sort by date
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredEvents(result);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl"
          >
            Loading events...
          </motion.div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-red-400"
          >
            {error}
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Ripple Background with z-index */}
      <div className="absolute inset-0 w-full h-full">
        <RippleBackground />
      </div>

      {/* Semi-transparent overlay for better contrast */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-0" />

      {/* Content with higher z-index */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 pt-24">
          <div className="flex justify-between items-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-secondary text-transparent bg-clip-text"
            >
              Events
            </motion.h1>
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
          <motion.div 
            className="flex flex-wrap gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
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
              {['all', 'workshop', 'seminar', 'conference', 'other'].map((cat) => (
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
          </motion.div>

          {/* Events Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                whileHover={{ y: -10 }}
                className="bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm border border-orange-500/10
                  relative group"
              >
                <div className="relative h-48">
                  <Image
                    src={event.image.replace('/public', '') || '/images/default.png'}
                    alt={event.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/default.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs ${
                    event.isUpcoming ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {event.isUpcoming ? 'Upcoming' : 'Past'}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p> {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                    <p>⏰ {event.time}</p>
                    <p>📍 {event.venue}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs bg-orange-500/20 text-orange-400">
                        {event.category}
                      </span>
                      {event.registrationLink && event.isUpcoming && (
                        <motion.a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm
                            hover:bg-orange-600 transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Register
                          <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M14 5l7 7m0 0l-7 7m7-7H3" 
                            />
                          </svg>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 py-12"
            >
              No events found for the selected filters.
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
} 