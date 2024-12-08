'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { ResearchIcon, PublicationIcon, MentorshipIcon, ScholarshipIcon } from '@/components/ui/icons';

const rotatingTexts = [
  "Explore the Future",
  "Drive Innovation",
  "Shape Technology",
  "Join the Inspiration",
  "Lead Research",
  "Empower Knowledge"
];

// Typing animation for rotating texts
const TypingText = ({ text }: { text: string }) => {
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    const timeout = setTimeout(() => setIsTyping(false), text.length * 100 + 1000);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="inline-block"
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            delay: index * 0.1,
            ease: "easeOut"
          }}
        >
          {char}
        </motion.span>
      ))}
      {isTyping && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-5 bg-orange-500 ml-1"
        />
      )}
    </motion.span>
  );
};

// Update Grid background for hero section with brighter grid
const GridBackground = () => (
  <div className="absolute inset-0">
    {/* Gradient overlay for fade-out effect - reduced opacity */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 z-10" />
    
    {/* Grid */}
    <div className="absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(40,1fr)] gap-0.5 opacity-15">
      {[...Array(1600)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: Math.random() * 0.4 + 0.2, // Increased base opacity range
            backgroundColor: [
              'rgba(249,115,22,0.2)', // Increased color intensity
              'rgba(249,115,22,0.4)',
              'rgba(249,115,22,0.2)'
            ]
          }}
          transition={{ 
            duration: 2,
            delay: i * 0.001,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: Math.random() * 3
          }}
          className="bg-orange-500/30 rounded-sm backdrop-blur-[1px]"
          style={{
            // Adjusted opacity fade to maintain brightness
            opacity: `${Math.max(0.15, 1 - (Math.floor(i / 40) / 40) * 0.8)}` // Increased min opacity, reduced fade intensity
          }}
        />
      ))}
    </div>

    {/* Additional ambient glow */}
    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />
  </div>
);

// Dot pattern for quote section
const DotPattern = () => (
  <div className="absolute inset-0 opacity-5">
    {[...Array(100)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-orange-500 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

// Flickering grid for process section
const FlickeringGrid = () => (
  <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] gap-1 opacity-5">
    {[...Array(400)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          opacity: [0.3, 1, 0.3],
          backgroundColor: ['rgba(249,115,22,0.2)', 'rgba(249,115,22,0.4)', 'rgba(249,115,22,0.2)']
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
        className="rounded-sm"
      />
    ))}
  </div>
);

// Add mouse-following glow effect to feature cards
const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      onMouseMove={handleMouseMove}
      className="relative group"
    >
      {/* Animated gradient background */}
      <div
        className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(
            600px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(249,115,22,0.15),
            rgba(234,88,12,0.15),
            rgba(249,115,22,0.05),
            transparent 40%
          )`,
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 
          blur-lg transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(
            200px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(249,115,22,0.3),
            transparent 40%
          )`,
        }}
      />

      {/* Content */}
      <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-orange-500/10
        hover:border-orange-500/30 transition-all duration-300 h-full overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 translate-x-full group-hover:translate-x-[-100%] 
            transition-transform duration-1500 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        {/* Icon */}
        <div className="relative w-16 h-16 mb-6 text-orange-500 transform group-hover:scale-110 
          transition-transform duration-300">
          <feature.icon />
          <div className="absolute inset-0 blur-lg opacity-50 bg-orange-500/20 group-hover:opacity-100 
            transition-opacity duration-300" />
        </div>

        {/* Text content */}
        <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 
          bg-clip-text text-transparent">{feature.title}</h3>
        <p className="text-gray-400 leading-relaxed relative z-10">{feature.description}</p>
      </div>
    </motion.div>
  );
};

// Update features data with more detailed descriptions
const features = [
  {
    title: "Research Support",
    description: "Get comprehensive guidance and support for your research papers. Our experienced mentors help you develop research methodologies, conduct literature reviews, and structure your papers effectively.",
    icon: ResearchIcon
  },
  {
    title: "Publication Assistance",
    description: "Navigate the complex world of academic publishing with our expert guidance. Learn about journal selection, submission processes, and receive support throughout the publication journey.",
    icon: PublicationIcon
  },
  {
    title: "Mentorship Program",
    description: "Connect with experienced researchers and academics who provide personalized guidance. Build lasting relationships that foster your academic and professional growth.",
    icon: MentorshipIcon
  },
  {
    title: "Scholarship Guidance",
    description: "Discover and apply for research funding opportunities and scholarships. Get expert help with application processes and increase your chances of securing financial support.",
    icon: ScholarshipIcon
  }
];

// Add shimmer border animation
const shimmerStyle = {
  backgroundImage: `
    linear-gradient(
      135deg,
      rgba(249, 115, 22, 0) 0%,
      rgba(249, 115, 22, 0.2) 50%,
      rgba(249, 115, 22, 0) 100%
    )
  `,
  backgroundSize: '200% 200%',
  animation: 'shimmer 2s infinite',
};

// Add keyframes for shimmer animation
const shimmerKeyframes = `
  @keyframes shimmer {
    0% {
      background-position: 200% 200%;
    }
    100% {
      background-position: -200% -200%;
    }
  }
`;

// Add Meteor component for tech section
const TechMeteors = ({ number = 30 }: { number?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(number)].map((_, i) => (
      <motion.span
        key={i}
        className="absolute w-1 h-1 bg-orange-500 rounded-full"
        initial={{
          top: `${Math.random() * 100}%`,
          left: "-2%",
          opacity: 0.7,
          scale: Math.random() * 0.5 + 0.5
        }}
        animate={{
          left: "102%",
          opacity: [0.7, 0.2, 0.7],
        }}
        transition={{
          duration: Math.random() * 2 + 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "linear"
        }}
        style={{
          filter: "blur(1px)",
          boxShadow: "0 0 10px rgba(249,115,22,0.5)"
        }}
      />
    ))}
  </div>
);

// Update TechSection with meteors
const TechSection = () => (
  <section className="relative z-10 py-24 px-4 overflow-hidden">
    <style>
      {`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}
    </style>

    {/* Meteors Background */}
    <TechMeteors />

    {/* Content */}
    <div className="relative max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      {[
        '/images/tech/ai.jpg',
        '/images/tech/robotics.jpg',
        '/images/tech/iot.jpg',
        '/images/tech/blockchain.jpg'
      ].map((src, index) => (
        <motion.div
          key={src}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2 }}
          className="relative rounded-xl overflow-hidden group"
        >
          {/* Shimmer Border */}
          <div 
            className="absolute inset-0 rounded-xl"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent)`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite linear'
            }}
          />
          
          {/* Image Container */}
          <div className="relative aspect-square m-[2px] rounded-xl overflow-hidden">
            <Image
              src={src}
              alt="Technology"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

// Add quote section between features and publication process
const QuoteSection = () => (
  <section className="relative z-10 py-32 px-4 overflow-hidden">
    <DotPattern />
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-6xl text-orange-500 opacity-30">
          "
        </div>
        <blockquote className="text-2xl md:text-3xl font-light italic text-gray-300 mb-6">
          Education is not the learning of facts, but the training of the mind to think.
        </blockquote>
        <cite className="text-orange-400 font-medium">- Albert Einstein</cite>
      </motion.div>
    </div>
  </section>
);

// Add retro grid animation
const RetroGrid = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 grid grid-cols-[repeat(30,1fr)] grid-rows-[repeat(30,1fr)] gap-[1px] opacity-10">
      {[...Array(900)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-orange-500/20"
          animate={{
            opacity: [0.3, 1, 0.3],
            backgroundColor: [
              'rgba(249,115,22,0.2)',
              'rgba(249,115,22,0.4)',
              'rgba(249,115,22,0.2)'
            ]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  </div>
);

// Update ProcessSection with equal dimensions and progress indicator
const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative z-10 py-24 px-4 bg-gradient-to-b from-black/50 to-transparent overflow-hidden">
      {/* Retro Grid Background */}
      <RetroGrid />

      <div className="relative max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r 
            from-orange-500 to-orange-600 text-transparent bg-clip-text"
        >
          Publication Process
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative h-[400px]" // Increased fixed height
            >
              {/* Background Grid */}
              <div className="absolute inset-0 grid grid-cols-[repeat(10,1fr)] grid-rows-[repeat(10,1fr)] gap-[1px] opacity-5">
                {[...Array(100)].map((_, i) => (
                  <div key={i} className="bg-orange-500/20" />
                ))}
              </div>

              {/* Card Content */}
              <div className={`absolute inset-0 bg-white/5 backdrop-blur-sm rounded-xl p-8 border 
                transition-all duration-500 flex flex-col
                ${activeStep === index ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'border-orange-500/10'}`}
              >
                {/* Step Number with Progress Indicator */}
                <div className="relative mb-6">
                  <div className="text-5xl font-bold text-orange-500 opacity-20">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                  <motion.div
                    className="absolute inset-0 text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 
                      text-transparent bg-clip-text"
                    animate={{
                      opacity: activeStep === index ? 1 : 0.2
                    }}
                  >
                    {(index + 1).toString().padStart(2, '0')}
                  </motion.div>
                </div>

                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-400 flex-grow">{step.description}</p>

                {/* Progress Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5">
                    <motion.div
                      className="h-full bg-orange-500"
                      animate={{
                        opacity: activeStep === index ? 1 : 0.2
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-4 mt-12">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full ${
                activeStep === index ? 'bg-orange-500' : 'bg-orange-500/20'
              }`}
              animate={{
                scale: activeStep === index ? [1, 1.2, 1] : 1
              }}
              transition={{
                duration: 0.5,
                repeat: activeStep === index ? Infinity : 0
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Update steps data with more detailed descriptions
const steps = [
  {
    title: "Research Guidance",
    description: "Get comprehensive guidance on research methodology, topic selection, and literature review from experienced mentors. We help you build a strong foundation for your research paper."
  },
  {
    title: "Paper Writing",
    description: "Learn the art of academic writing with our structured approach. Get help with paper organization, formatting, citation styles, and creating impactful abstracts and conclusions."
  },
  {
    title: "Review Process",
    description: "Benefit from thorough peer reviews and expert feedback. Our review process helps identify areas for improvement and ensures your paper meets high academic standards."
  },
  {
    title: "Publication",
    description: "Navigate the publication process with confidence. Get assistance with journal selection, submission guidelines, and addressing reviewer comments for successful publication."
  }
];

interface PaperConfig {
  id: string;
  size: 'large' | 'small';
  x: number;
  y: number;
  rotate: number;
  scale: number;
  duration: number;
  delay: number;
}

// Create stable configs for server-side rendering
const initialPaperConfigs: PaperConfig[] = Array.from({ length: 25 }, (_, i) => ({
  id: `paper-${i}`,
  size: 'small',
  x: 0,
  y: -100,
  rotate: 0,
  scale: 0.5,
  duration: 10,
  delay: 0
}));

export default function Home() {
  const [textIndex, setTextIndex] = useState(0);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  const [paperConfigs, setPaperConfigs] = useState<PaperConfig[]>(initialPaperConfigs);

  // Initialize random values only after component mounts
  useEffect(() => {
    setIsClient(true);
    setPaperConfigs(
      Array.from({ length: 25 }, (_, i) => ({
        id: `paper-${i}`,
        size: Math.random() > 0.5 ? 'large' : 'small',
        x: Math.random() * 100,
        y: -100,
        rotate: Math.random() * 360,
        scale: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 10
      }))
    );

    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Render papers with stable keys
  const renderFloatingPapers = () => {
    if (!isClient) return null;

    return paperConfigs.map((config) => (
      <motion.div
        key={config.id}
        className="absolute"
        initial={{
          opacity: 0,
          x: config.x * windowDimensions.width / 100,
          y: config.y,
          rotate: config.rotate,
          scale: config.scale
        }}
        animate={{
          opacity: [0, 0.7, 0],
          y: windowDimensions.height + 100,
          rotate: config.rotate * 2,
          x: `${config.x}%`
        }}
        transition={{
          duration: config.duration,
          repeat: Infinity,
          delay: config.delay,
          ease: "linear"
        }}
      >
        <svg
          className={`${config.size === 'large' ? 'w-12 h-12' : 'w-8 h-8'} text-orange-500/20`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          {/* ... SVG paths ... */}
        </svg>
      </motion.div>
    ));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 4000); // Increased time to allow for typing animation
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Grid Background */}
        <GridBackground />
        
        {isClient && windowDimensions.height > 0 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {renderFloatingPapers()}
          </div>
        )}

        <div className="text-center space-y-6 max-w-4xl mx-auto relative z-10">
          {/* Main Title with Grid Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 opacity-10">
              {[...Array(64)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.01 }}
                  className="bg-orange-500/20 rounded-sm"
                />
              ))}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 
              text-transparent bg-clip-text relative z-10 p-4">
              IEEE Prakash Bharti<br />Scholar Chapter
            </h1>
          </motion.div>

          {/* Rotating Text */}
          <div className="h-16"> {/* Increased height for typing animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={textIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-2xl md:text-3xl text-gray-300"
              >
                <TypingText text={rotatingTexts[textIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mt-12"
          >
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg
                  text-white font-medium text-lg hover:from-orange-600 hover:to-orange-700
                  transition-all duration-300"
              >
                Contact Us
              </motion.button>
            </Link>
            <Link href="/events">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-transparent border border-white/20 rounded-lg
                  text-white font-medium text-lg hover:bg-white/5 transition-all duration-300
                  shadow-[0_0_15px_rgba(255,165,0,0.3)] hover:shadow-[0_0_20px_rgba(255,165,0,0.5)]"
              >
                Explore Events
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section with shadow overlay and more papers */}
      <section className="relative z-10 py-24 px-4">
        {/* Top shadow overlay - much lighter and more gradual fade */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black/20 via-black/10 to-transparent" />
        
        {/* Bottom shadow for transition - lighter */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 via-black/20 to-transparent" />
        
        {/* Additional ambient gradient for smoother transition - very subtle */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />
        
        {/* Additional floating papers specific to this section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`feature-paper-${i}`}
              className="absolute"
              initial={{
                opacity: 0,
                x: Math.random() * 100 + '%',
                y: -50,
                rotate: Math.random() * 360,
                scale: Math.random() * 0.4 + 0.3
              }}
              animate={{
                opacity: [0, 0.5, 0],
                y: '120%',
                rotate: Math.random() * 720 - 360,
                x: `${Math.random() * 100}%`
              }}
              transition={{
                duration: Math.random() * 20 + 15,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: "linear"
              }}
            >
              <svg
                className="w-10 h-10 text-orange-500/15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {i % 2 === 0 ? (
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
                ) : (
                  <path d="M21 4H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-1 14H4V6h16v12z M6 8h12v2H6V8zm0 4h12v2H6v-2z" />
                )}
              </svg>
            </motion.div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r 
              from-orange-500 to-orange-600 text-transparent bg-clip-text"
          >
            What We Do
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Technology Images Section */}
      <TechSection />

      {/* Einstein Quote */}
      <QuoteSection />

      {/* Replace the old publication process section with the new one */}
      <ProcessSection />

      {/* Footer */}
      <Footer />
    </main>
  );
} 