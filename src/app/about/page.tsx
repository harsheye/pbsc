'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Footer from '@/components/Footer';

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

// Add this new component for the traveling point animation
const TravelingPoint = ({ paths }: { paths: string[] }) => {
  return (
    <motion.circle
      r={3}
      fill="white"
      filter="url(#glow)"
      animate={{
        offsetPath: paths.map(p => `path("${p}")`),
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: 8,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop"
      }}
    >
      {/* Glow filter */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f97316" floodOpacity="0.5" />
        </filter>
      </defs>
    </motion.circle>
  );
};

// Update the hierarchy visualization
const HierarchyVisualization = ({ members }: { members: LeadershipMember[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [connections, setConnections] = useState<{ from: string; to: string; path: string }[]>([]);

  useEffect(() => {
    if (!svgRef.current) return;

    const positions = new Map<string, { x: number; y: number }>();
    const newPaths: string[] = [];
    const newConnections: typeof connections = [];

    // Calculate positions for each member
    members.forEach((member, i) => {
      const level = HIERARCHY_LEVELS[member.position as keyof typeof HIERARCHY_LEVELS] || 0;
      const angle = (i / members.length) * Math.PI * 2;
      const radius = 150 + level * 50; // Adjust radius based on hierarchy level
      const x = Math.cos(angle) * radius + 300; // Center point
      const y = Math.sin(angle) * radius + 300;
      positions.set(member._id, { x, y });
    });

    // Create connections between all nodes
    members.forEach((member, i) => {
      members.slice(i + 1).forEach(otherMember => {
        const fromPos = positions.get(member._id)!;
        const toPos = positions.get(otherMember._id)!;
        
        // Create curved path
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        const curve = 30; // Curve intensity
        const controlX = midX + curve * Math.cos((Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x) + Math.PI/2));
        const controlY = midY + curve * Math.sin((Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x) + Math.PI/2));
        
        const path = `M ${fromPos.x} ${fromPos.y} Q ${controlX} ${controlY} ${toPos.x} ${toPos.y}`;
        newPaths.push(path);
        newConnections.push({
          from: member._id,
          to: otherMember._id,
          path
        });
      });
    });

    setPaths(newPaths);
    setConnections(newConnections);
  }, [members]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      <svg ref={svgRef} className="absolute inset-0 w-full h-full" viewBox="0 0 600 600">
        {/* Connection lines */}
        {connections.map((connection, i) => (
          <g key={`connection-${i}`}>
            <path
              d={connection.path}
              fill="none"
              stroke="rgba(249,115,22,0.1)"
              strokeWidth="1"
              className="transition-all duration-300"
            />
          </g>
        ))}

        {/* Traveling points */}
        {paths.map((path, i) => (
          <TravelingPoint key={`point-${i}`} paths={[path]} />
        ))}

        {/* Member nodes */}
        {members.map((member, i) => {
          const level = HIERARCHY_LEVELS[member.position as keyof typeof HIERARCHY_LEVELS] || 0;
          const angle = (i / members.length) * Math.PI * 2;
          const radius = 150 + level * 50;
          const x = Math.cos(angle) * radius + 300;
          const y = Math.sin(angle) * radius + 300;

          return (
            <g key={member._id} transform={`translate(${x},${y})`}>
              <motion.circle
                r={20}
                fill="rgba(249,115,22,0.1)"
                stroke="rgba(249,115,22,0.3)"
                strokeWidth="2"
                whileHover={{ scale: 1.2 }}
                className="cursor-pointer transition-all duration-300"
              />
              <text
                textAnchor="middle"
                dy=".3em"
                className="text-xs fill-white font-medium pointer-events-none"
              >
                {member.position}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
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
      {/* Add keyframes to the page */}
      <style jsx global>{shimmerKeyframes}</style>

      {/* Retro Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={retroGridStyle}
      />

      {/* Content with increased z-index */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Faculty Section */}
        <motion.section 
          className="mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scrollVariants}
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-secondary text-transparent bg-clip-text">
            Faculty Members
          </h2>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {facultyMembers.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
              />
            ))}
          </div>
        </motion.section>

        {/* Team Section with Hierarchy */}
        <motion.section
          className="mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl font-bold mb-16 bg-gradient-to-r from-orange-500 to-secondary text-transparent bg-clip-text">
            Team Members
          </h2>
          <div className="relative space-y-32">
            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {Object.entries(organizeTeamByHierarchy(teamMembers)).map(([level, members], levelIndex) => {
                if (levelIndex === 0) return null; // Skip first level (Chairperson)
                
                const prevLevelMembers = teamMembers.filter(
                  m => HIERARCHY_LEVELS[m.position as keyof typeof HIERARCHY_LEVELS]?.level === levelIndex - 1
                );
                
                return members.map((member, memberIndex) => {
                  const parentIndex = Math.floor(memberIndex / 2);
                  const parent = prevLevelMembers[parentIndex];
                  if (!parent) return null;

                  const startX = `${(parentIndex + 0.5) * (100 / prevLevelMembers.length)}%`;
                  const endX = `${(memberIndex + 0.5) * (100 / members.length)}%`;
                  const startY = levelIndex * 350 - 100; // Adjust based on card height
                  const endY = levelIndex * 350;

                  return (
                    <g key={member._id}>
                      <line
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke="rgba(249, 115, 22, 0.4)"
                        strokeWidth="3"
                        strokeDasharray="4 4"
                      />
                    </g>
                  );
                });
              })}
            </svg>

            {/* Team Members Grid */}
            {Object.entries(organizeTeamByHierarchy(teamMembers)).map(([level, members]) => (
              <motion.div 
                key={level}
                className="relative"
                variants={levelVariants}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className={`grid ${
                  level === '0' ? 'justify-center' : 
                  level === '1' ? 'justify-center' :
                  level === '2' ? 'grid-cols-2 gap-24 justify-center max-w-4xl mx-auto' :
                  'grid-cols-4 gap-8'
                }`}>
                  {members.map((member) => (
                    <motion.div
                      key={member._id}
                      variants={memberVariants[Number(level)]}
                      whileHover={{ 
                        y: -10, 
                        transition: { duration: 0.2 }
                      }}
                    >
                      <MemberCard member={member} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Spacer for visual breathing room */}
        <div className="h-32" />
      </div>

      {/* Add a subtle gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/50" />

      {/* Footer */}
      <Footer />
    </main>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="relative h-72 w-72 rounded-lg overflow-hidden group">
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
          className="w-full h-full object-cover"
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
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                className="w-8 h-8 text-white hover:text-orange-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 