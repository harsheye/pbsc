'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { contactService } from '@/services/contactService';

type FormStep = 'uid' | 'personal' | 'contact' | 'message' | 'complete';

export default function Contact() {
  const [currentStep, setCurrentStep] = useState<FormStep>('uid');
  const [formData, setFormData] = useState({
    uid: '',
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateMobile = (mobile: string) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      setErrors(prev => ({
        ...prev,
        mobile: 'Please enter a valid 10-digit mobile number'
      }));
      return false;
    }
    return true;
  };

  const handleNext = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'uid' && !validateUID(value)) return;
    if (field === 'mobile' && !validateMobile(value)) return;

    const steps: FormStep[] = ['uid', 'personal', 'contact', 'message', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleSubmit = () => {
    const submission = {
      ...formData,
      timestamp: new Date()
    };
    contactService.submitContact(submission);
    setCurrentStep('complete');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'uid':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
                font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 mt-6"
            >
              Continue
            </motion.button>
          </motion.div>
        );

      case 'personal':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNext('name', formData.name)}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg
                font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
            >
              Continue
            </motion.button>
          </motion.div>
        );

      case 'contact':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-orange-400">How can we reach you?</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-3 
                    focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={formData.mobile}
                  onChange={(e) => {
                    setErrors({});
                    setFormData(prev => ({ ...prev, mobile: e.target.value }));
                  }}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-3 
                    focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {errors.mobile && (
                  <p className="text-red-400 text-sm mt-2">{errors.mobile}</p>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNext('mobile', formData.mobile)}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg
                font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
            >
              Continue
            </motion.button>
          </motion.div>
        );

      case 'message':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-orange-400">What would you like to tell us?</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-3 
                  focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <textarea
                rows={6}
                placeholder="Your message..."
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-3 
                  focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg
                font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
            >
              Submit
            </motion.button>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-orange-400">Thank You!</h2>
            <p className="text-gray-400">We'll get back to you soon.</p>
          </motion.div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="w-full flex gap-8">
          {/* Main Form */}
          <motion.div className="flex-1 relative">
            {/* Progress dots remain the same */}
            
            {/* Form Container */}
            <div className="bg-white/5 p-8 rounded-xl backdrop-blur-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Filled Details Panel */}
          <AnimatePresence>
            {currentStep !== 'uid' && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                className="w-80 bg-white/5 p-6 rounded-xl backdrop-blur-sm h-fit sticky top-24"
              >
                <h3 className="text-xl font-bold text-orange-400 mb-4">Your Details</h3>
                <div className="space-y-4">
                  {Object.entries(formData).map(([key, value]) => 
                    value && (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/30 p-4 rounded-lg"
                      >
                        <p className="text-gray-400 text-sm mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </p>
                        <p className="text-white">{value}</p>
                      </motion.div>
                    )
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
} 