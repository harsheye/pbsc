'use client';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

interface LeadershipMember {
  name: string;
  position: string;
  education: string;
  year: string;
  image: string;
  linkedin: string;
  description: string;
  course?: string;
}

interface ChapterMember {
  name: string;
  position: string;
  image: string;
  linkedIn: string;
  education: string;
  year: string;
  course: string;
}

const leadership: LeadershipMember[] = [
  {
    name: "Dr. R.S. Bawa",
    position: "Vice Chancellor",
    education: "Ph.D. in Computer Science",
    year: "",
    image: "/images/placeholder.jpg",
    linkedin: "https://linkedin.com/in/rsbawa",
    description: "Leading Chandigarh University with excellence and innovation.",
    course: "Computer Science"
  },
  {
    name: "Dr. Sugandha Sharma",
    position: "Senior Faculty Advisor",
    education: "Ph.D. in Computer Science",
    year: "",
    image: "/leaders/sugandha.jpg",
    linkedin: "https://linkedin.com/in/sugandha",
    description: "Guiding IEEE PBSC with extensive academic experience.",
    course: "Computer Science"
  },
  {
    name: "Dr. [Other Mam]",
    position: "Faculty Advisor",
    education: "Ph.D. in Electronics",
    year: "",
    image: "/leaders/faculty.jpg",
    linkedin: "https://linkedin.com/in/faculty",
    description: "Supporting technical initiatives and student development.",
    course: "Electronics"
  }
];

const hierarchicalStructure = {
  topLevel: [
    {
      name: "Kavya",
      position: "Chairperson",
      image: "https://via.placeholder.com/400x400",
      linkedIn: "https://linkedin.com/in/kavya",
      education: "B.Tech",
      year: "4th Year",
      course: "Computer Science"
    },
    {
      name: "[Name]",
      position: "Vice Chairperson",
      image: "/leaders/vice-chair.jpg",
      linkedIn: "https://linkedin.com/in/vicechair",
      education: "B.Tech",
      year: "4th Year",
      course: "Computer Science"
    }
  ],
  midLevel: [
    {
      name: "[Name]",
      position: "Secretary",
      image: "/leaders/secretary.jpg",
      linkedIn: "https://linkedin.com/in/secretary",
      education: "B.Tech",
      year: "3rd Year",
      course: "Electronics"
    },
    {
      name: "[Name]",
      position: "Joint Secretary",
      image: "/leaders/joint-secretary.jpg",
      linkedIn: "https://linkedin.com/in/jointsec",
      education: "B.Tech",
      year: "3rd Year",
      course: "Electronics"
    },
    {
      name: "[Name]",
      position: "Treasurer",
      image: "/leaders/treasurer.jpg",
      linkedIn: "https://linkedin.com/in/treasurer",
      education: "B.Tech",
      year: "3rd Year",
      course: "Electronics"
    }
  ],
  bottomLevel: [
    {
      name: "[Name]",
      position: "Media Head",
      image: "/leaders/media-head.jpg",
      linkedIn: "https://linkedin.com/in/mediahead",
      education: "B.Tech",
      year: "2nd Year",
      course: "Electronics"
    },
    {
      name: "[Name]",
      position: "Student Coordinator",
      image: "/leaders/coordinator.jpg",
      linkedIn: "https://linkedin.com/in/coordinator",
      education: "B.Tech",
      year: "2nd Year",
      course: "Electronics"
    },
    {
      name: "[Name]",
      position: "Webmaster",
      image: "/leaders/webmaster.jpg",
      linkedIn: "https://linkedin.com/in/webmaster",
      education: "B.Tech",
      year: "2nd Year",
      course: "Electronics"
    }
  ]
};

const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedConnector = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center">
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        whileInView={{ height: '100%', opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-0.5 bg-gradient-to-b from-orange-500/50 to-orange-500/20 h-full relative"
      >
        <motion.div
          initial={{ top: "0%" }}
          animate={{ 
            top: "100%",
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }
          }}
          className="absolute w-4 h-4 -left-[7px] rounded-full bg-orange-500/30
            shadow-[0_0_10px_4px_rgba(249,115,22,0.5)] z-10"
        />
      </motion.div>
    </div>
  );
};

const MemberCard = ({ 
  member, 
  index = 0, 
  glowDelay = 0 
}: { 
  member: ChapterMember | LeadershipMember; 
  index?: number;
  glowDelay?: number;
}) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const linkedInUrl = 'linkedIn' in member ? member.linkedIn : member.linkedin;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, rotateY: -30 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        rotateY: 0,
        transition: { 
          delay: index * 0.2,
          duration: 0.8,
          type: "spring",
          stiffness: 100
        }
      } : {}}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="relative"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          delay: glowDelay,
          duration: 1,
          times: [0, 0.5, 1],
          repeat: Infinity,
          repeatDelay: 6
        }}
        className="absolute inset-0 bg-orange-500/20 rounded-xl blur-xl"
      />
      
      <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-orange-500/10
        hover:border-orange-500/30 transition-all duration-300 relative z-10
        hover:shadow-xl hover:shadow-orange-500/10"
      >
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/400x400";
            }}
          />
        </div>
        <div className="space-y-2">
          <h4 className="text-xl font-bold">{member.name}</h4>
          <p className="text-orange-400">{member.position}</p>
          <div className="text-sm text-gray-400">
            <p>{member.education} • {member.year}</p>
            <p>{member.course}</p>
          </div>
          <Link
            href={linkedInUrl}
            target="_blank"
            className="inline-flex items-center space-x-2 text-sm text-orange-400/70 hover:text-orange-400 mt-2
              bg-orange-500/10 px-3 py-1 rounded-full hover:bg-orange-500/20 transition-all"
          >
            <span>Connect on LinkedIn</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default function About() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: -50 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <motion.h1 
            className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-secondary text-transparent bg-clip-text"
            initial={{ opacity: 0, x: -50 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            About IEEE PBSC
          </motion.h1>

          {/* Faculty Leadership Section */}
          <ScrollReveal>
            <section className="mb-20">
              <motion.h2 
                className="text-3xl font-bold mb-12 text-center text-orange-400"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                Faculty Leadership
              </motion.h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {leadership.map((leader, index) => (
                  <MemberCard key={leader.name} member={leader as ChapterMember} index={index} />
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Chapter Leadership Structure */}
          <ScrollReveal delay={0.2}>
            <section className="mb-20">
              <motion.h2 
                className="text-3xl font-bold mb-16 text-center text-orange-400"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                Chapter Leadership Structure
              </motion.h2>
              <div className="max-w-6xl mx-auto px-4">
                <div className="relative">
                  {/* Animated connecting lines */}
                  <AnimatedConnector />

                  {/* Enhanced grid layouts with staggered animations and glow effects */}
                  <div className="grid grid-cols-2 gap-8 mb-24">
                    {hierarchicalStructure.topLevel.map((member, index) => (
                      <MemberCard 
                        key={member.position} 
                        member={member} 
                        index={index}
                        glowDelay={2 + index * 0.5} // Start glowing after line reaches
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-8 mb-24">
                    {hierarchicalStructure.midLevel.map((member, index) => (
                      <MemberCard 
                        key={member.position} 
                        member={member} 
                        index={index + 2}
                        glowDelay={3 + index * 0.5} // Delayed glow for mid level
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                    {hierarchicalStructure.bottomLevel.map((member, index) => (
                      <MemberCard 
                        key={member.position} 
                        member={member} 
                        index={index + 5}
                        glowDelay={4.5 + index * 0.5} // Further delayed glow for bottom level
                      />
                    ))}
                  </div>

                  {/* Horizontal connecting lines with traveling light */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[1, 2, 3].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileInView={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: i * 0.3 }}
                        className="relative"
                      >
                        <div className={`absolute h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent
                          transform origin-left`}
                          style={{ top: `${25 * (i + 1)}%` }}
                        >
                          <motion.div
                            initial={{ left: "0%" }}
                            animate={{ 
                              left: "100%",
                              transition: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 0.5
                              }
                            }}
                            className="absolute w-4 h-4 -top-[7px] rounded-full bg-orange-500/30
                              shadow-[0_0_10px_4px_rgba(249,115,22,0.5)]"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>
        </motion.div>
      </div>
    </main>
  );
} 