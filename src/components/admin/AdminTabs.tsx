'use client';
import { motion } from 'framer-motion';

type Tab = 'team' | 'faculty' | 'events' | 'contact';

interface AdminTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabs = [
    { id: 'team', label: 'Team Members', icon: '👥' },
    { id: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'contact', label: 'Contact', icon: '📞' }
  ];

  return (
    <div className="flex flex-col space-y-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as Tab)}
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
  );
} 