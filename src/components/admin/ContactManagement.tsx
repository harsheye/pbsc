'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface ContactInfo {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function ContactManagement() {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contacts');
      setContacts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-400">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map(contact => (
          <motion.div
            key={contact._id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/30 rounded-xl p-6 border border-orange-500/20"
          >
            <div className="space-y-4">
              <div className="border-b border-orange-500/10 pb-4">
                <h3 className="text-lg font-semibold text-orange-400">{contact.name}</h3>
                <p className="text-sm text-gray-400">{contact.email}</p>
                {contact.phone && (
                  <p className="text-sm text-gray-400">{contact.phone}</p>
                )}
              </div>
              <div>
                <h4 className="font-medium text-orange-400/80">Subject</h4>
                <p className="text-gray-300">{contact.subject}</p>
              </div>
              <div>
                <h4 className="font-medium text-orange-400/80">Message</h4>
                <p className="text-gray-300 line-clamp-3">{contact.message}</p>
              </div>
              <div className="text-sm text-gray-500 pt-4 border-t border-orange-500/10">
                Received: {new Date(contact.createdAt).toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {contacts.length === 0 && (
        <div className="text-center text-gray-400 py-12 bg-black/20 rounded-xl border border-orange-500/10">
          No contact messages found.
        </div>
      )}
    </div>
  );
} 