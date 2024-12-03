'use client';
import { motion } from 'framer-motion';

export default function Papers() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-secondary text-transparent bg-clip-text">
            Research Papers Portal
          </h1>
          
          {/* Paper Submission Form */}
          <div className="bg-white/5 p-8 rounded-xl backdrop-blur-sm mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-orange-400">Submit Your Paper</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Paper Title
                </label>
                <input
                  type="text"
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2 
                    focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Abstract
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2 
                    focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Paper Category
                </label>
                <select className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2">
                  <option>Research Paper</option>
                  <option>Review Paper</option>
                  <option>Technical Note</option>
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg
                  font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              >
                Submit Paper
              </motion.button>
            </form>
          </div>

          {/* Published Papers */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((paper) => (
              <motion.div
                key={paper}
                whileHover={{ y: -5 }}
                className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-orange-500/10
                  hover:border-orange-500/30 transition-all duration-300"
              >
                <span className="px-3 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 rounded-full">
                  Research Paper
                </span>
                <h3 className="text-xl font-semibold mt-4 mb-2">
                  Quantum Computing Applications in Modern Cryptography
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  A comprehensive study of quantum computing applications in modern cryptographic systems...
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=1"
                    alt="Author"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium">Dr. John Doe</p>
                    <p className="text-xs text-gray-400">Published on March 15, 2024</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
} 