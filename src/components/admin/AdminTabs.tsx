import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface AdminTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function AdminTabs({ tabs, activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="bg-black/50 backdrop-blur-lg border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto">
        <div className="py-8 px-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text mb-8">
            Admin Dashboard
          </h1>
          
          <div className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-6 py-3 rounded-lg flex items-center gap-3 transition-all
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
    </div>
  );
} 