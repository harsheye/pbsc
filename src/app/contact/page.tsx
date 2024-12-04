'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import confetti from 'canvas-confetti';
import Footer from '@/components/Footer';

// Create a custom Meteors component since we don't have access to the UI library
const Meteors = ({ number = 20 }: { number?: number }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(number)].map((_, i) => (
        <span
          key={i}
          className={`
            absolute w-0.5 h-0.5 rotate-[215deg] animate-meteor rounded-[9999px]
            before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%]
            before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[rgba(249,115,22,0)]
            before:to-orange-500
          `}
          style={{
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animationDelay: Math.random() * 1 + 's',
            animationDuration: Math.random() * 2 + 3 + 's',
          }}
        />
      ))}
    </div>
  );
};

// Add this to your tailwind.config.js
// animation: {
//   meteor: 'meteor 5s linear infinite',
// },
// keyframes: {
//   meteor: {
//     '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
//     '70%': { opacity: '1' },
//     '100%': {
//       transform: 'rotate(215deg) translateX(-500px)',
//       opacity: '0',
//     },
//   },
// },

type FormStep = 'uid' | 'personal' | 'contact' | 'message' | 'complete';

interface FormData {
  uid: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
}

// Update form variants for slower transitions
const formVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeIn"
    }
  })
};

// Add preview panel component
const PreviewPanel = ({ data }: { data: FormData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-orange-400 mb-4">Your Information</h3>
        <div className="space-y-2">
          {data.uid && (
            <div>
              <p className="text-sm text-gray-500">University ID</p>
              <p className="text-gray-300">{data.uid}</p>
            </div>
          )}
          {data.name && (
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-gray-300">{data.name}</p>
            </div>
          )}
          {data.email && (
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-300">{data.email}</p>
            </div>
          )}
          {data.phone && (
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-300">{data.phone}</p>
            </div>
          )}
        </div>
      </div>

      {(data.subject || data.description) && (
        <div>
          <h3 className="text-lg font-semibold text-orange-400 mb-4">Message Details</h3>
          <div className="space-y-2">
            {data.subject && (
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="text-gray-300">{data.subject}</p>
              </div>
            )}
            {data.description && (
              <div>
                <p className="text-sm text-gray-500">Message</p>
                <p className="text-gray-300 line-clamp-4">{data.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Contact() {
  const [currentStep, setCurrentStep] = useState<FormStep>('uid');
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    uid: '',
    name: '',
    email: '',
    phone: '',
    subject: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateUID = (uid: string) => {
    const uidRegex = /^\d{2}[a-zA-Z]{3}\d{5}$/;
    if (!uidRegex.test(uid)) {
      setErrors(prev => ({
        ...prev,
        uid: 'UID should be in format: 22BAI70568'
      }));
      return false;
    }
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
      return false;
    }
    return true;
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setErrors(prev => ({
        ...prev,
        phone: 'Please enter a valid 10-digit mobile number'
      }));
      return false;
    }
    return true;
  };

  const handleNext = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate fields
    if (field === 'uid' && !validateUID(value)) return;
    if (field === 'email' && !validateEmail(value)) return;
    if (field === 'phone' && !validatePhone(value)) return;

    setDirection(1);
    const steps: FormStep[] = ['uid', 'personal', 'contact', 'message', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    const steps: FormStep[] = ['uid', 'personal', 'contact', 'message', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      
      if (response.data) {
        setCurrentStep('complete');
        // Trigger confetti with multiple bursts
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          zIndex: 9999
        };

        function fire(particleRatio: number, opts: confetti.Options) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });

        fire(0.2, {
          spread: 60,
        });

        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8
        });

        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2
        });

        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit form. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, field: keyof FormData) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value;
      
      switch (currentStep) {
        case 'uid':
          if (validateUID(value)) {
            handleNext('uid', value);
          }
          break;
        case 'personal':
          if (value.trim().length > 0) {
            handleNext('name', value);
          }
          break;
        case 'contact':
          if (field === 'email' && validateEmail(value)) {
            // Focus phone input if email is valid
            const phoneInput = document.getElementById('phone-input');
            if (phoneInput) {
              phoneInput.focus();
            }
          } else if (field === 'phone' && validatePhone(value)) {
            handleNext('phone', value);
          }
          break;
        case 'message':
          if (field === 'subject' && value.trim().length > 0) {
            // Focus description input if subject is valid
            const descInput = document.getElementById('description-input');
            if (descInput) {
              descInput.focus();
            }
          } else if (field === 'description' && value.trim().length > 0) {
            handleSubmit();
          }
          break;
      }
    }
  };

  const renderContactStep = () => (
    <motion.div
      key="contact"
      custom={direction}
      variants={formVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold text-orange-400">How can we reach you?</h2>
      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Email Address</label>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => {
              setErrors({});
              setFormData(prev => ({ ...prev, email: e.target.value }));
            }}
            onKeyPress={(e) => handleKeyPress(e, 'email')}
            className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-3 
              focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Phone Number</label>
          <input
            id="phone-input"
            type="tel"
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={(e) => {
              setErrors({});
              setFormData(prev => ({ ...prev, phone: e.target.value }));
            }}
            onKeyPress={(e) => handleKeyPress(e, 'phone')}
            className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-3 
              focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          {errors.phone && (
            <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBack}
          className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium 
            hover:bg-gray-700 transition-all duration-300"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (validateEmail(formData.email) && validatePhone(formData.phone)) {
              handleNext('phone', formData.phone);
            }
          }}
          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg
            font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );

  const renderMessageStep = () => (
    <motion.div
      key="message"
      custom={direction}
      variants={formVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold text-orange-400">What would you like to discuss?</h2>
      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Subject</label>
          <input
            type="text"
            placeholder="Brief subject of your message"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            onKeyPress={(e) => handleKeyPress(e, 'subject')}
            className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-3 
              focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Message</label>
          <textarea
            id="description-input"
            placeholder="Your message in detail"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (formData.subject.trim() && formData.description.trim()) {
                  handleSubmit();
                }
              }
            }}
            className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-3 h-32 
              focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBack}
          className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium 
            hover:bg-gray-700 transition-all duration-300"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.subject.trim() || !formData.description.trim()}
          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg
            font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </motion.button>
      </div>
    </motion.div>
  );

  // Update renderStep to include new steps
  const renderStep = () => {
    switch (currentStep) {
      case 'uid':
        return (
          <motion.div
            key="uid"
            custom={direction}
            variants={formVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-orange-400">Welcome to IEEE PBSC</h2>
            <p className="text-gray-400">Let's start with your University ID</p>
            <div className="relative">
              <input
                type="text"
                placeholder="22BAI70568"
                value={formData.uid}
                onChange={(e) => {
                  setErrors({});
                  setFormData(prev => ({ ...prev, uid: e.target.value.toUpperCase() }));
                }}
                className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-3 
                  focus:ring-2 focus:ring-orange-500 focus:border-transparent text-2xl tracking-wider"
              />
              {errors.uid && (
                <p className="text-red-400 text-sm mt-2">{errors.uid}</p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNext('uid', formData.uid)}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg
                font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
            >
              Continue
            </motion.button>
          </motion.div>
        );

      case 'personal':
        return (
          <motion.div
            key="personal"
            custom={direction}
            variants={formVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-orange-400">Nice to meet you!</h2>
            <p className="text-gray-400">What's your name?</p>
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-3 
                focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="flex justify-between gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBack}
                className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium 
                  hover:bg-gray-700 transition-all duration-300"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNext('name', formData.name)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg
                  font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        );

      case 'contact':
        return renderContactStep();
      case 'message':
        return renderMessageStep();
      case 'complete':
        return (
          <motion.div
            key="complete"
            variants={formVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-green-400">Thank You!</h2>
            <p className="text-gray-400">Your message has been received. We'll get back to you soon.</p>
          </motion.div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Meteor Effect */}
      <Meteors number={20} />

      <div className="max-w-6xl mx-auto px-4 pt-24">
        <div className="w-full flex gap-8">
          {/* Main Form */}
          <motion.div className="flex-1 relative">
            {/* Progress Indicator */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-orange-500"
                initial={{ width: '0%' }}
                animate={{
                  width: `${
                    (((['uid', 'personal', 'contact', 'message', 'complete'].indexOf(currentStep) + 1) / 5) * 100)
                  }%`
                }}
                transition={{ duration: 0.8 }}
              />
            </div>

            {/* Form Container */}
            <div className="bg-white/5 p-8 rounded-xl backdrop-blur-sm mt-8">
              <AnimatePresence mode="wait" custom={direction}>
                {renderStep()}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Preview Panel */}
          <AnimatePresence>
            {currentStep !== 'uid' && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-80 bg-white/5 p-6 rounded-xl backdrop-blur-sm h-fit sticky top-24"
              >
                <PreviewPanel data={formData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
} 