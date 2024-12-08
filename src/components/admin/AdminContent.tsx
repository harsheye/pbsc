'use client';
import { useState, useEffect } from 'react';
import TeamManagement from './TeamManagement';
import FacultyManagement from './FacultyManagement';
import EventManagement from './EventManagement';
import ContactManagement from './ContactManagement';

type Tab = 'team' | 'faculty' | 'events' | 'contact';

interface AdminContentProps {
  activeTab: Tab;
}

export default function AdminContent({ activeTab }: AdminContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const components = {
    team: TeamManagement,
    faculty: FacultyManagement,
    events: EventManagement,
    contact: ContactManagement
  };

  const Component = components[activeTab];

  return (
    <div className="py-8">
      <Component />
    </div>
  );
} 