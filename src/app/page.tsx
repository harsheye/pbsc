'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-20">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center relative tech-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto px-4 cyber-highlight"
        >
          <Image
            src="/ieee-logo.png"
            alt="IEEE Logo"
            width={120}
            height={120}
            className="mx-auto mb-8 brightness-200"
          />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-secondary text-transparent bg-clip-text">
            IEEE Prakash Bharti Scholar Chapter
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Advancing Technology for Humanity at Chandigarh University
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Link href="/papers">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-medium
                  hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg"
              >
                Publish Your Paper
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 text-white px-8 py-3 rounded-full font-medium
                  hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-secondary text-transparent bg-clip-text">
              Make Your Future Bright with PBSC
            </h2>
            <p className="text-xl text-white/70">
              Join us in shaping the future of technology and research
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Publish with PBSC",
                description: "Get your research papers published and recognized by the academic community",
                icon: "📚"
              },
              {
                title: "Expert Mentorship",
                description: "Learn from experienced professors and industry professionals",
                icon: "🎓"
              },
              {
                title: "Networking Opportunities",
                description: "Connect with like-minded researchers and professionals",
                icon: "🤝"
              }
            ].map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -10 }}
                className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-orange-500/10
                  hover:border-orange-500/30 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-orange-400">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 