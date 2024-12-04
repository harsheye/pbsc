'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeamManagement from '@/components/admin/TeamManagement';
import FacultyManagement from '@/components/admin/FacultyManagement';
import EventManagement from '@/components/admin/EventManagement';
import MediaGallery from '@/components/admin/MediaGallery';

type ActiveTab = 'team' | 'faculty' | 'events' | 'media';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('team');

  const tabs = [
    { id: 'team', label: 'Team Members', icon: 'users' },
    { id: 'faculty', label: 'Faculty', icon: 'academic-cap' },
    { id: 'events', label: 'Events', icon: 'calendar' },
    { id: 'media', label: 'Media Gallery', icon: 'photo' }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 h-screen w-64 bg-black/50 backdrop-blur-lg border-r border-orange-500/20">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text mb-8">
            Admin Dashboard
          </h1>
          <ul className="space-y-2">
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all
                    ${activeTab === tab.id 
                      ? 'bg-orange-500/20 text-orange-500' 
                      : 'hover:bg-white/5'
                    }`}
                >
                  <span className={`heroicon-${tab.icon}`} />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="pt-8"
          >
            {activeTab === 'team' && <TeamManagement />}
            {activeTab === 'faculty' && <FacultyManagement />}
            {activeTab === 'events' && <EventManagement />}
            {activeTab === 'media' && <MediaGallery />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
} 