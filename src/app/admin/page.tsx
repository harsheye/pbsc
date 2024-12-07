'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import axios from 'axios';

type ActiveTab = 'team' | 'faculty' | 'events' | 'contact';

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  education: string;
  year: number;
  course: string;
  image: string;
  linkedIn: string;
}

interface Faculty {
  _id: string;
  name: string;
  position: string;
  education: string;
  image: string;
  linkedIn: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'workshop' | 'seminar' | 'conference' | 'other';
  isUpcoming: boolean;
  mainImage: string;
  registrationLink?: string;
}

interface Contact {
  _id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
}

interface ModalState {
  isOpen: boolean;
  type: 'add' | 'edit';
  data?: Event;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('team');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, type: 'add' });

  const tabs = [
    { id: 'team', label: 'Team Members', icon: '👥' },
    { id: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'contact', label: 'Contact', icon: '📞' }
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'team':
          const teamResponse = await axios.get('http://localhost:5000/api/team');
          setTeamMembers(teamResponse.data);
          break;
        case 'faculty':
          const facultyResponse = await axios.get('http://localhost:5000/api/faculty');
          setFaculty(facultyResponse.data);
          break;
        case 'events':
          const eventsResponse = await axios.get('http://localhost:5000/api/events');
          setEvents(eventsResponse.data);
          break;
        case 'contact':
          const contactsResponse = await axios.get('http://localhost:5000/api/contacts');
          setContacts(contactsResponse.data);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-8">Loading...</div>;
    }

    switch (activeTab) {
      case 'team':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map(member => (
              <div key={member._id} className="bg-black/20 rounded-lg p-6 border border-orange-500/10">
                <img 
                  src={member.image || '/images/default-avatar.png'} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-center">{member.name}</h3>
                <p className="text-orange-500 text-center mb-2">{member.position}</p>
                <div className="text-sm text-gray-400">
                  <p>Education: {member.education}</p>
                  <p>Course: {member.course}</p>
                  <p>Year: {member.year}</p>
                  {member.linkedIn && (
                    <a 
                      href={member.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-400"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'faculty':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faculty.map(member => (
              <div key={member._id} className="bg-black/20 rounded-lg p-6 border border-orange-500/10">
                <img 
                  src={member.image || '/images/default-avatar.png'} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-center">{member.name}</h3>
                <p className="text-orange-500 text-center mb-2">{member.position}</p>
                <p className="text-sm text-gray-400">Education: {member.education}</p>
                {member.linkedIn && (
                  <a 
                    href={member.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400"
                  >
                    LinkedIn Profile
                  </a>
                )}
              </div>
            ))}
          </div>
        );

      case 'events':
        return (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setModalState({ isOpen: true, type: 'add' })}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <span>Add Event</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map(event => (
                <div key={event._id} className="bg-black/20 rounded-lg overflow-hidden border border-orange-500/10">
                  <div className="aspect-video relative">
                    <img 
                      src={event.mainImage || '/images/default-event.jpg'} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-orange-500">{event.category}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-400 mb-2">{event.description}</p>
                    <div className="text-sm text-gray-400">
                      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                      <p>Time: {event.time}</p>
                      <p>Venue: {event.venue}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        event.isUpcoming ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {event.isUpcoming ? 'Upcoming' : 'Past'}
                      </span>
                      
                      <div className="flex gap-2">
                        {event.isUpcoming && event.registrationLink && (
                          <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30 transition-colors text-sm flex items-center gap-1"
                          >
                            Register
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                        <button
                          onClick={() => setModalState({ isOpen: true, type: 'edit', data: event })}
                          className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30 transition-colors text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {modalState.isOpen && (
              <EventModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, type: 'add' })}
                event={modalState.data}
                onEventCreated={() => {
                  fetchData();
                  setModalState({ isOpen: false, type: 'add' });
                }}
                onEventUpdated={() => {
                  fetchData();
                  setModalState({ isOpen: false, type: 'add' });
                }}
              />
            )}
          </div>
        );

      case 'contact':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contacts.map(contact => (
              <div key={contact._id} className="bg-black/20 rounded-lg p-6 border border-orange-500/10">
                <div className="mb-4 pb-4 border-b border-orange-500/10">
                  <h3 className="text-lg font-semibold text-orange-500">{contact.name}</h3>
                  <p className="text-sm text-gray-400">{contact.email}</p>
                  <p className="text-sm text-gray-400">{contact.phone}</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Subject</h4>
                  <p className="text-sm text-gray-400">{contact.subject}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Message</h4>
                  <p className="text-sm text-gray-400">{contact.description}</p>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      
      <main className="flex-grow mt-24">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
              Admin Dashboard
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Tabs Section */}
            <div className="lg:col-span-1">
              <div className="bg-black/30 rounded-xl border border-orange-500/20 p-6 sticky top-32">
                <h2 className="text-xl font-semibold text-orange-500 mb-4">Navigation</h2>
                <div className="space-y-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as ActiveTab)}
                      className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all
                        ${activeTab === tab.id 
                          ? 'bg-orange-500/20 text-orange-500 border border-orange-500/20' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                    >
                      <span className="text-xl">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-black/30 rounded-xl border border-orange-500/20 p-6"
              >
                <h2 className="text-xl font-semibold text-orange-500 mb-6">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                {renderContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 