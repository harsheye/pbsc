'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IEvent } from '@/types/event';
import { IContactSubmission } from '@/types/contact';
import { eventService } from '@/services/eventService';
import { contactService } from '@/services/contactService';
import EventModal from '@/components/EventModal';
import LeadershipManagement from '@/components/LeadershipManagement';
import TeamModal from '@/components/TeamModal';

export default function AdminDashboard() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<IEvent>>({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'technical' as const,
    isUpcoming: true
  });
  const [activeTab, setActiveTab] = useState<'events' | 'contacts' | 'leadership' | 'media' | 'faculty'>('events');
  const [contacts, setContacts] = useState<IContactSubmission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState({
    events: false,
    contacts: false
  });
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamModalType, setTeamModalType] = useState<'faculty' | 'leadership' | 'chapter'>('faculty');

  useEffect(() => {
    loadEvents();
    loadContacts();
  }, []);

  const loadEvents = async () => {
    setIsLoading(prev => ({ ...prev, events: true }));
    try {
      const data = await eventService.getAllEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]);
    } finally {
      setIsLoading(prev => ({ ...prev, events: false }));
    }
  };

  const loadContacts = async () => {
    setIsLoading(prev => ({ ...prev, contacts: true }));
    try {
      const data = await contactService.getAllSubmissions();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load contacts:', error);
      setContacts([]);
    } finally {
      setIsLoading(prev => ({ ...prev, contacts: false }));
    }
  };

  const handleCreateEvent = async () => {
    if (newEvent.title && newEvent.date) {
      try {
        const formData = new FormData();
        Object.entries(newEvent).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });

        await eventService.addEvent(formData);
        setIsCreating(false);
        setNewEvent({
          title: '',
          description: '',
          date: '',
          time: '',
          venue: '',
          category: 'technical' as const,
          isUpcoming: true
        });
        loadEvents();
      } catch (error) {
        console.error('Failed to create event:', error);
      }
    }
  };

  const handleUpdateEvent = async () => {
    if (editingEvent) {
      try {
        const formData = new FormData();
        Object.entries(editingEvent).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });

        await eventService.updateEvent(editingEvent._id, formData);
        setEditingEvent(null);
        loadEvents();
      } catch (error) {
        console.error('Failed to update event:', error);
      }
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(id);
        loadEvents();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleDeleteContact = async (uid: string) => {
    if (window.confirm('Are you sure you want to delete this contact submission?')) {
      try {
        await contactService.deleteSubmission(uid);
        loadContacts();
      } catch (error) {
        console.error('Failed to delete contact:', error);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-secondary text-transparent bg-clip-text">
            Admin Dashboard
          </h1>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('events')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'events' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white/10 text-white'
              }`}
            >
              Events
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('contacts')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'contacts' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white/10 text-white'
              }`}
            >
              Contact Submissions
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('leadership')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'leadership' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white/10 text-white'
              }`}
            >
              Leadership
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('media')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'media' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white/10 text-white'
              }`}
            >
              Media Library
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('faculty')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'faculty' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white/10 text-white'
              }`}
            >
              Faculty
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium
                hover:bg-orange-600 transition-all duration-300"
            >
              Create New Event
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'events' ? (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Event Form */}
              {(isCreating || editingEvent) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 p-6 rounded-xl backdrop-blur-sm mb-8"
                >
                  <h2 className="text-2xl font-bold mb-6">
                    {isCreating ? 'Create New Event' : 'Edit Event'}
                  </h2>
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Event Title"
                        value={isCreating ? newEvent.title : editingEvent?.title}
                        onChange={(e) => isCreating 
                          ? setNewEvent(prev => ({ ...prev, title: e.target.value }))
                          : setEditingEvent(prev => ({ ...prev!, title: e.target.value }))
                        }
                        className="bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                      />
                      <select
                        value={isCreating ? newEvent.category : editingEvent?.category}
                        onChange={(e) => {
                          const value = e.target.value as const;
                          if (isCreating) {
                            setNewEvent(prev => ({ ...prev, category: value }));
                          } else {
                            setEditingEvent(prev => prev ? { ...prev, category: value } : null);
                          }
                        }}
                        className="bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2"
                      >
                        {['technical', 'workshop', 'seminar', 'other'].map(cat => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Add more form fields for other event properties */}
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => isCreating ? handleCreateEvent() : handleUpdateEvent()}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg"
                      >
                        {isCreating ? 'Create' : 'Update'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsCreating(false);
                          setEditingEvent(null);
                        }}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Events List */}
              <div className="space-y-4">
                {Array.isArray(events) && events.map((event) => (
                  <motion.div
                    key={event._id}
                    className="bg-white/5 p-6 rounded-xl backdrop-blur-sm flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-xl font-bold">{event.title}</h3>
                      <p className="text-gray-400">{event.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-orange-400">#{event.category}</span>
                        <span className={event.isUpcoming ? 'text-green-400' : 'text-gray-400'}>
                          {event.isUpcoming ? 'Upcoming' : 'Past'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEditingEvent(event)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteEvent(event._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : activeTab === 'contacts' ? (
            <motion.div
              key="contacts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {contacts.map((contact) => (
                <motion.div
                  key={contact.uid}
                  className="bg-white/5 p-6 rounded-xl backdrop-blur-sm"
                  layout
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{contact.name}</h3>
                      <p className="text-orange-400">{contact.uid}</p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-gray-400 text-sm">Email</p>
                          <p>{contact.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Mobile</p>
                          <p>{contact.mobile}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-gray-400 text-sm">Subject</p>
                        <p>{contact.subject}</p>
                      </div>
                      <div className="mt-4">
                        <p className="text-gray-400 text-sm">Message</p>
                        <p className="text-gray-300">{contact.message}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteContact(contact.uid)}
                      className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20"
                    >
                      Delete
                    </motion.button>
                  </div>
                  <p className="text-gray-400 text-sm mt-4">
                    Submitted on: {contact.timestamp.toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : activeTab === 'leadership' ? (
            <LeadershipManagement />
          ) : activeTab === 'faculty' ? (
            <motion.div
              key="faculty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex justify-end mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setTeamModalType('faculty');
                    setIsTeamModalOpen(true);
                  }}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg"
                >
                  Add Faculty Member
                </motion.button>
              </div>

              {/* Faculty list will go here */}
            </motion.div>
          ) : (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Media Management */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={loadEvents}
      />
      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        type={teamModalType}
        onMemberAdded={loadTeamMembers}
      />
    </main>
  );
} 