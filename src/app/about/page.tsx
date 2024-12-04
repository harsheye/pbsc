'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Footer from '@/components/Footer';
import { loadFull } from "tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";

const DEFAULT_IMAGE = '/images/default.png';

// Add CSS for retro grid
const retroGridStyle = {
  backgroundImage: `
    linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)
  `,
  backgroundSize: '50px 50px',
  backgroundPosition: '-1px -1px',
  maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
};

// Add scroll animation variants
const scrollVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Add shimmer animation keyframes to the style object
const shimmerStyle = {
  backgroundImage: `
    linear-gradient(
      135deg,
      rgba(249, 115, 22, 0) 0%,
      rgba(249, 115, 22, 0.1) 50%,
      rgba(249, 115, 22, 0) 100%
    )
  `,
  backgroundSize: '200% 200%',
  animation: 'shimmer 2s infinite',
};

// Add keyframes animation to the style tag
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

interface Member {
  _id: string;
  id: string;
  name: string;
  position: string;
  education: string;
  image: string;
  linkedIn: string;
  year?: number;
  course?: string;
}

// Update the hierarchy levels and their positions
const HIERARCHY_LEVELS = {
  'Chairperson': { level: 0, order: 1 },
  'Vice Chairperson': { level: 1, order: 1 },
  'Secretary': { level: 2, order: 1 },
  'Joint Secretary': { level: 2, order: 2 },
  'Treasurer': { level: 3, order: 1 },
  'Media Head': { level: 3, order: 2 },
  'Web Master': { level: 3, order: 3 },
  'Student Coordinator': { level: 3, order: 4 }
};

// Add animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3
    }
  }
};

const levelVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const memberVariants = {
  0: { // Chairperson
    hidden: { opacity: 0, y: -100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 1
      }
    }
  },
  1: { // Vice Chairperson
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 1
      }
    }
  },
  2: { // Secretary and Joint Secretary
    hidden: { opacity: 0, x: -100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 1
      }
    }
  },
  3: { // Bottom level members
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 1
      }
    }
  }
};

// Add this new component for the traveling point that follows hierarchy
const HierarchyPoint = ({ positions }: { positions: { x: number; y: number }[] }) => {
  return (
    <motion.circle
      r={4}
      fill="white"
      filter="url(#glow)"
      animate={{
        cx: positions.map(p => p.x),
        cy: positions.map(p => p.y)
      }}
      transition={{
        duration: positions.length * 2,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop"
      }}
    >
      {/* Enhanced glow filter */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#f97316" floodOpacity="0.5" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </motion.circle>
  );
};

// Update Arrow component for smoother, direct connections
const Arrow = ({ start, end, color = "rgba(249,115,22,0.3)" }: { 
  start: { x: number; y: number }; 
  end: { x: number; y: number }; 
  color?: string;
}) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  // Calculate control points for a smooth curve
  const midY = start.y + dy / 2;
  const cp1y = midY;
  const cp2y = midY;
  const cp1x = start.x;
  const cp2x = end.x;

  // Create a cubic Bezier curve path
  const path = `
    M ${start.x},${start.y}
    C ${cp1x},${cp1y} ${cp2x},${cp2y} ${end.x},${end.y}
  `;

  return (
    <g>
      {/* Main path */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        className="transition-all duration-300"
      />
      
      {/* Arrowhead */}
      <circle
        cx={end.x}
        cy={end.y}
        r="3"
        fill={color}
        className="transition-all duration-300"
      />
    </g>
  );
};

// Add hierarchy-specific styles
const hierarchyStyles = {
  line: "stroke-orange-500/30 stroke-[2px]",
  node: "w-40 h-40 rounded-full bg-white/5 backdrop-blur-sm border border-orange-500/30",
  nodeHover: "hover:border-orange-500 hover:bg-white/10 transition-all duration-300",
  text: "text-center",
  title: "font-bold text-orange-500",
  name: "text-sm text-gray-300 mt-2"
};

// Particles configuration
const particlesConfig = {
  particles: {
    number: {
      value: 50,
      density: { enable: true, value_area: 800 }
    },
    color: { value: "#f97316" },
    shape: { type: "circle" },
    opacity: {
      value: 0.5,
      random: true
    },
    size: {
      value: 3,
      random: true
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#f97316",
      opacity: 0.2,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false
    }
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      onHover: {
        enable: true,
        mode: "grab"
      },
      onClick: {
        enable: true,
        mode: "push"
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 140,
        links: { opacity: 0.5 }
      },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
};

// Card animation variants
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.9,
    transition: {
      duration: 0.3
    }
  }
};

// Add section animation variants
const sectionVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

// Add grid animation variants
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<Member[]>([]);
  const [facultyMembers, setFacultyMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both team and faculty data
        const [teamResponse, facultyResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/team'),
          axios.get('http://localhost:5000/api/faculty')
        ]);
        
        // Sort team members by position
        if (teamResponse.data && Array.isArray(teamResponse.data)) {
          const sortedMembers = teamResponse.data.sort((a: Member, b: Member) => {
            const posA = HIERARCHY_LEVELS[a.position as keyof typeof HIERARCHY_LEVELS] || 0;
            const posB = HIERARCHY_LEVELS[b.position as keyof typeof HIERARCHY_LEVELS] || 0;
            return posA - posB;
          });
          setTeamMembers(sortedMembers);
        }

        // Set faculty members
        if (facultyResponse.data && Array.isArray(facultyResponse.data)) {
          setFacultyMembers(facultyResponse.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
          console.error('Error fetching data:', error.message);
        } else {
          setError('An unexpected error occurred');
          console.error('Error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const organizeTeamByHierarchy = (members: Member[]) => {
    const levels: { [key: number]: Member[] } = {};
    
    members.forEach(member => {
      const level = HIERARCHY_LEVELS[member.position as keyof typeof HIERARCHY_LEVELS]?.level || 0;
      if (!levels[level]) {
        levels[level] = [];
      }
      levels[level].push(member);
    });

    // Sort members within each level by their order
    Object.keys(levels).forEach(level => {
      levels[Number(level)].sort((a, b) => {
        const orderA = HIERARCHY_LEVELS[a.position as keyof typeof HIERARCHY_LEVELS]?.order || 99;
        const orderB = HIERARCHY_LEVELS[b.position as keyof typeof HIERARCHY_LEVELS]?.order || 99;
        return orderA - orderB;
      });
    });

    return levels;
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log(container);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl"
          >
            Loading members...
          </motion.div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-red-400"
          >
            Error: {error}
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24 relative">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesConfig}
        className="absolute inset-0"
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Faculty Section */}
        <motion.section 
          className="mb-32"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-16 bg-gradient-to-r from-orange-500 to-secondary text-transparent bg-clip-text">
            Faculty Members
          </h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
            variants={gridVariants}
          >
            {facultyMembers.map((member) => (
              <MemberCard key={member._id} member={member} />
            ))}
          </motion.div>
        </motion.section>

        {/* Team Section with Hierarchy */}
        <motion.section
          className="mb-32"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-16 bg-gradient-to-r from-orange-500 to-secondary text-transparent bg-clip-text">
            Team Members
          </h2>
          
          {/* Hierarchical Layout */}
          <div className="relative space-y-32">
            {/* Level 1 - Chairperson */}
            <div className="flex justify-center">
              {teamMembers
                .filter(m => m.position === 'Chairperson')
                .map(member => (
                  <motion.div
                    key={member._id}
                    className="w-72"
                    variants={memberVariants[0]}
                  >
                    <MemberCard member={member} />
                  </motion.div>
                ))}
            </div>

            {/* Level 2 - Vice Chairperson */}
            <div className="flex justify-center">
              {teamMembers
                .filter(m => m.position === 'Vice Chairperson')
                .map(member => (
                  <motion.div
                    key={member._id}
                    className="w-72"
                    variants={memberVariants[1]}
                  >
                    <MemberCard member={member} />
                  </motion.div>
                ))}
            </div>

            {/* Level 3 - Secretary and Joint Secretary */}
            <div className="flex justify-center gap-8">
              {teamMembers
                .filter(m => ['Secretary', 'Joint Secretary'].includes(m.position))
                .map(member => (
                  <motion.div
                    key={member._id}
                    className="w-72"
                    variants={memberVariants[2]}
                  >
                    <MemberCard member={member} />
                  </motion.div>
                ))}
            </div>

            {/* Level 4 - Other Positions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
              {teamMembers
                .filter(m => !['Chairperson', 'Vice Chairperson', 'Secretary', 'Joint Secretary'].includes(m.position))
                .map(member => (
                  <motion.div
                    key={member._id}
                    className="w-72"
                    variants={memberVariants[3]}
                  >
                    <MemberCard member={member} />
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Optional: Add a visual indicator of hierarchy */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-full w-px bg-gradient-to-b from-transparent via-orange-500/20 to-transparent mx-auto" />
          </div>
        </motion.section>
      </div>

      <Footer />
    </main>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ y: -10 }}
      className="relative h-72 w-72 rounded-lg overflow-hidden group"
    >
      {/* Shimmer Border */}
      <div className="absolute inset-0 rounded-lg p-[2px] z-0">
        <div className="absolute inset-0 rounded-lg" style={shimmerStyle} />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/20 to-orange-600/20" />
      </div>

      {/* Card Content */}
      <div className="relative h-full w-full rounded-lg overflow-hidden z-10">
        {/* Background Image */}
        <img
          src={member.image.replace('/public', '') || DEFAULT_IMAGE}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = DEFAULT_IMAGE;
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="text-2xl font-bold text-white mb-2 truncate">{member.name}</h3>
          <p className="text-orange-400 text-base mb-2 truncate">{member.position}</p>
          <p className="text-gray-300 text-sm truncate">{member.education}</p>
          {member.course && (
            <p className="text-gray-400 text-sm truncate">
              {member.course} • Year {member.year}
            </p>
          )}
          
          {/* LinkedIn Icon - Show on Hover */}
          {member.linkedIn && (
            <a
              href={member.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300
                w-10 h-10 bg-black/50 rounded-full flex items-center justify-center
                hover:bg-orange-500/50 hover:scale-110"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
} 