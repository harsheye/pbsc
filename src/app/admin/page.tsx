'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import EventModal from '@/components/EventModal';
import TeamModal from '@/components/TeamModal';
import FacultyModal from '@/components/FacultyModal';
import ImageUpload from '@/components/ImageUpload';
import { IEvent } from '@/types/event';
import { ITeamMember } from '@/types/team';
import { IFaculty } from '@/types/faculty';
import { useRouter } from 'next/navigation';
import { ADMIN_CREDENTIALS } from '@/constants/auth';

type Section = 'events' | 'team' | 'faculty' | 'media';

export default function AdminDashboard() {
  const router = useRouter();
  
  // All state declarations first
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openSections, setOpenSections] = useState<Section[]>(['events']);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [teamMembers, setTeamMembers] = useState<ITeamMember[]>([]);
  const [facultyMembers, setFacultyMembers] = useState<IFaculty[]>([]);
  const [mediaItems, setMediaItems] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [selectedMember, setSelectedMember] = useState<ITeamMember | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<IFaculty | null>(null);
  const [loading, setLoading] = useState({
    events: false,
    team: false,
    faculty: false,
    media: false
  });

  // Auth check effect
  useEffect(() => {
    const username = localStorage.getItem('adminUsername');
    const password = localStorage.getItem('adminPassword');
    
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Data fetching effect
  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
      fetchTeam();
      fetchFaculty();
      fetchMedia();
    }
  }, [isAuthenticated]);

  // Rest of your fetch functions and handlers remain the same
  const fetchEvents = async () => {
    try {
      setLoading(prev => ({ ...prev, events: true }));
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  const fetchTeam = async () => {
    try {
      setLoading(prev => ({ ...prev, team: true }));
      const response = await axios.get('http://localhost:5000/api/team');
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(prev => ({ ...prev, team: false }));
    }
  };

  const fetchFaculty = async () => {
    try {
      setLoading(prev => ({ ...prev, faculty: true }));
      const response = await axios.get('http://localhost:5000/api/faculty');
      setFacultyMembers(response.data);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    } finally {
      setLoading(prev => ({ ...prev, faculty: false }));
    }
  };

  const fetchMedia = async () => {
    try {
      setLoading(prev => ({ ...prev, media: true }));
      const response = await axios.get('http://localhost:5000/api/images');
      setMediaItems(response.data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(prev => ({ ...prev, media: false }));
    }
  };

  const toggleSection = (section: Section) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  // Rest of your JSX remains the same
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="space-y-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Events Section */}
        <div className="bg-black/30 rounded-lg overflow-hidden border border-orange-500/20">
          <button
            onClick={() => toggleSection('events')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <h2 className="text-xl font-semibold">Events</h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(null);
                setIsEventModalOpen(true);
              }}
              className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Event
            </button>
          </button>
          
          <AnimatePresence>
            {openSections.includes('events') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6 border-t border-orange-500/20 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map(event => (
                    <div key={event._id} className="bg-white/5 rounded-lg p-4">
                      <div className="aspect-video relative mb-4">
                        <img 
                          src={event.image || '/images/default-event.jpg'} 
                          alt={event.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">{event.description}</p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsEventModalOpen(true);
                          }}
                          className="px-3 py-1 bg-orange-500/20 rounded hover:bg-orange-500/30 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Team Section */}
        <div className="bg-black/30 rounded-lg overflow-hidden border border-orange-500/20">
          <button
            onClick={() => toggleSection('team')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <h2 className="text-xl font-semibold">Team Members</h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMember(null);
                setIsTeamModalOpen(true);
              }}
              className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Member
            </button>
          </button>
          
          <AnimatePresence>
            {openSections.includes('team') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6 border-t border-orange-500/20 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {teamMembers.map(member => (
                    <div key={member._id} className="bg-white/5 rounded-lg p-4">
                      <div className="aspect-square relative mb-4">
                        <img 
                          src={member.image || '/images/default-profile.jpg'} 
                          alt={member.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
                      <p className="text-orange-500 mb-1">{member.position}</p>
                      <p className="text-sm text-gray-400 mb-4">{member.education}</p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setIsTeamModalOpen(true);
                          }}
                          className="px-3 py-1 bg-orange-500/20 rounded hover:bg-orange-500/30 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Faculty Section */}
        <div className="bg-black/30 rounded-lg overflow-hidden border border-orange-500/20">
          <button
            onClick={() => toggleSection('faculty')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <h2 className="text-xl font-semibold">Faculty Members</h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFaculty(null);
                setIsFacultyModalOpen(true);
              }}
              className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Faculty
            </button>
          </button>
          
          <AnimatePresence>
            {openSections.includes('faculty') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6 border-t border-orange-500/20 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {facultyMembers.map(faculty => (
                    <div key={faculty._id} className="bg-white/5 rounded-lg p-4">
                      <div className="aspect-square relative mb-4">
                        <img 
                          src={faculty.image || '/images/default-profile.jpg'} 
                          alt={faculty.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{faculty.name}</h3>
                      <p className="text-orange-500 mb-1">{faculty.position}</p>
                      <p className="text-sm text-gray-400 mb-4">{faculty.education}</p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedFaculty(faculty);
                            setIsFacultyModalOpen(true);
                          }}
                          className="px-3 py-1 bg-orange-500/20 rounded hover:bg-orange-500/30 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Media Section */}
        <div className="bg-black/30 rounded-lg overflow-hidden border border-orange-500/20">
          <button
            onClick={() => toggleSection('media')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <h2 className="text-xl font-semibold">Media Gallery</h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsUploadModalOpen(true);
              }}
              className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Upload Media
            </button>
          </button>
          
          <AnimatePresence>
            {openSections.includes('media') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6 border-t border-orange-500/20 grid grid-cols-2 md:grid-cols-4 gap-6">
                  {mediaItems.map((item, index) => (
                    <div key={index} className="aspect-square relative group">
                      <img 
                        src={item}
                        alt="Gallery Image"
                        className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          onClick={() => navigator.clipboard.writeText(item)}
                          className="px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                        >
                          Copy URL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modals */}
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          event={selectedEvent}
          onEventCreated={fetchEvents}
          onEventUpdated={fetchEvents}
        />

        <TeamModal
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
          member={selectedMember}
          onMemberCreated={fetchTeam}
          onMemberUpdated={fetchTeam}
        />

        <FacultyModal
          isOpen={isFacultyModalOpen}
          onClose={() => setIsFacultyModalOpen(false)}
          faculty={selectedFaculty}
          onFacultyCreated={fetchFaculty}
          onFacultyUpdated={fetchFaculty}
        />
      </div>
    </div>
  );
} 