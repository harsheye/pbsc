'use client';
import { useState, useEffect } from 'react';
import AdminTabs from '@/components/admin/AdminTabs';
import AdminContent from '@/components/admin/AdminContent';
import LayoutWrapper from '@/components/LayoutWrapper';

type Tab = 'team' | 'faculty' | 'events' | 'contact';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('adminActiveTab') as Tab) || 'team';
    }
    return 'team';
  });

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  const getTabTitle = () => {
    switch(activeTab) {
      case 'team':
        return 'Team Members';
      case 'faculty':
        return 'Faculty Management';
      case 'events':
        return 'Event Management';
      case 'contact':
        return 'Contact Messages';
      default:
        return '';
    }
  };

  return (
    <LayoutWrapper includeHeader={true}>
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-orange-500 mb-8">Admin Dashboard</h1>
          
          <div className="flex gap-8">
            {/* Left Navigation */}
            <div className="w-64 shrink-0">
              <div className="bg-black/30 rounded-xl border border-orange-500/20 p-4">
                <h2 className="text-xl font-semibold mb-4">Navigation</h2>
                <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1">
              <div className="bg-black/30 rounded-xl border border-orange-500/20 p-6">
                {/* Dynamic Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-orange-500">{getTabTitle()}</h2>
                  {/* Only show Add button for faculty and events */}
                  {(activeTab === 'faculty' || activeTab === 'events') && (
                    <button
                      className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                    >
                      <span>Add {activeTab === 'faculty' ? 'Faculty' : 'Event'}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Content */}
                <AdminContent activeTab={activeTab} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
} 