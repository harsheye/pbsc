'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const ADMIN_USERNAME = 'kavya';
const ADMIN_PASSWORD = 'kavya';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set both cookie and session storage
      Cookies.set('isAdminLoggedIn', 'true', { expires: 1 }); // Expires in 1 day
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/50 rounded-xl border border-orange-500/20 p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-orange-500 mb-6">Admin Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2.5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-orange-500/20 rounded-lg p-2.5"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white rounded-lg py-2.5 hover:bg-orange-600 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 