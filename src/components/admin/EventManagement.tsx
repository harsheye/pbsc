import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ImageUpload from '../ImageUpload';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  timing: string;
  category: 'workshop' | 'seminar' | 'conference' | 'other';
  isUpcoming: boolean;
  mainImage: string;
  imageStack: string[];
}

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editingEvent) {
        await axios.patch(`http://localhost:5000/api/events/${editingEvent._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('http://localhost:5000/api/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchEvents();
      setIsModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-orange-500">Event Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Add Event
        </button>
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(event => (
          <motion.div
            key={event._id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/30 rounded-lg overflow-hidden border border-orange-500/20"
          >
            <div className="aspect-video relative">
              <img
                src={event.mainImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-orange-500">{event.category}</p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-gray-400">{event.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{new Date(event.date).toLocaleDateString()}</span>
                <span>{event.timing}</span>
              </div>
              <p className="text-gray-400">Venue: {event.venue}</p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditingEvent(event);
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1 bg-orange-500/20 rounded hover:bg-orange-500/30 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <EventModal
          event={editingEvent}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function EventModal({ 
  event, 
  onClose, 
  onSubmit 
}: { 
  event: Event | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl font-semibold mb-4">
          {event ? 'Edit Event' : 'Add Event'}
        </h3>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              type="text"
              name="title"
              defaultValue={event?.title || ''}
              className="w-full bg-black/50 rounded px-3 py-2 border border-orange-500/30"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              defaultValue={event?.description || ''}
              className="w-full bg-black/50 rounded px-3 py-2 border border-orange-500/30 h-32"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Date</label>
              <input
                type="date"
                name="date"
                defaultValue={event?.date?.split('T')[0] || ''}
                className="w-full bg-black/50 rounded px-3 py-2 border border-orange-500/30"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Time</label>
              <input
                type="time"
                name="timing"
                defaultValue={event?.timing || ''}
                className="w-full bg-black/50 rounded px-3 py-2 border border-orange-500/30"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Venue</label>
            <input
              type="text"
              name="venue"
              defaultValue={event?.venue || ''}
              className="w-full bg-black/50 rounded px-3 py-2 border border-orange-500/30"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              name="category"
              defaultValue={event?.category || 'workshop'}
              className="w-full bg-black/50 rounded px-3 py-2 border border-orange-500/30"
              required
            >
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="conference">Conference</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Main Image</label>
            <ImageUpload
              currentImage={event?.mainImage}
              onSuccess={(url) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'mainImage';
                input.value = url;
                formRef.current?.appendChild(input);
              }}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 rounded hover:bg-orange-600 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 