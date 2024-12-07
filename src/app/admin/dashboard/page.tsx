'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminTabs from '@/components/admin/AdminTabs';
import AdminContent from '@/components/admin/AdminContent';

type ActiveTab = 'team' | 'faculty' | 'events' | 'contact';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('team');

  const allTabs = [
    { id: 'team', label: 'Team Members', icon: '👥' },
    { id: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'contact', label: 'Contact', icon: '📞' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Tabs Component */}
      <AdminTabs 
        tabs={allTabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Content Component */}
      <AdminContent activeTab={activeTab} />
    </div>
  );
} 