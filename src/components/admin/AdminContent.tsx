import { motion, AnimatePresence } from 'framer-motion';
import TeamManagement from './TeamManagement';
import FacultyManagement from './FacultyManagement';
import EventManagement from './EventManagement';
import ContactManagement from './ContactManagement';

interface AdminContentProps {
  activeTab: string;
}

export default function AdminContent({ activeTab }: AdminContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      case 'team':
        return <TeamManagement />;
      case 'faculty':
        return <FacultyManagement />;
      case 'events':
        return <EventManagement />;
      case 'contact':
        return <ContactManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-black/30 rounded-2xl border border-orange-500/20 p-8"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 