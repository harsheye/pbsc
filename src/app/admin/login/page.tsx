'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ADMIN_CREDENTIALS } from '@/constants/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Store credentials in localStorage
      localStorage.setItem('adminUsername', username);
      localStorage.setItem('adminPassword', password);
      router.push('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/30 p-8 rounded-lg border border-orange-500/20 w-full max-w-md backdrop-blur-sm"
      >
        <h1 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center"
            >
              {error}
            </motion.p>
          )}

          <div>
            <label className="block text-sm mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2 
                focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-orange-500/30 rounded-lg px-4 py-2 
                focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg
              font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
} 