'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Header = () => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full bg-black/90 backdrop-blur-sm z-50 top-0 left-0"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Image 
                src="/ieee-logo.png" 
                alt="IEEE Logo" 
                width={40} 
                height={40}
                className="invert"
              />
              <span className="text-white font-bold text-xl tracking-tight">
                IEEE PBSC
              </span>
            </motion.div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Home', path: '/' },
              { name: 'About', path: '/about' },
              { name: 'Events', path: '/events' },
              { name: 'Contact', path: '/contact' }
            ].map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.path}
                  className="text-gray-300 hover:text-white transition-colors duration-300 
                    text-sm font-medium relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all 
                    duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;