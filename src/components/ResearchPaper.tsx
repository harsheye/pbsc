'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publishedIn: string;
  date: string;
  doi: string;
  paperType: 'research' | 'review';
  image: string;
  citations?: number;
  impactFactor?: number;
  keywords: string[];
}

interface ResearchPaperProps {
  paper: ResearchPaper;
}

export default function ResearchPaper({ paper }: ResearchPaperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm border border-orange-500/10"
    >
      <div className="relative">
        {/* Paper Image */}
        <div className="relative h-48 w-full">
          <Image
            src={paper.image}
            alt={paper.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          
          {/* Paper Type Badge */}
          <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs ${
            paper.paperType === 'research' 
              ? 'bg-orange-500/20 text-orange-400' 
              : 'bg-blue-500/20 text-blue-400'
          }`}>
            {paper.paperType.toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{paper.title}</h3>
          
          {/* Authors */}
          <div className="mb-4">
            <p className="text-sm text-gray-400">
              {paper.authors.join(', ')}
            </p>
            <p className="text-xs text-gray-500">
              Published in {paper.publishedIn} • {new Date(paper.date).getFullYear()}
            </p>
          </div>

          {/* Abstract */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {paper.abstract}
          </p>

          {/* Metrics */}
          <div className="flex items-center gap-4 mb-4">
            {paper.citations !== undefined && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-400">{paper.citations} citations</span>
              </div>
            )}
            {paper.impactFactor !== undefined && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-400">IF: {paper.impactFactor.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2">
            {paper.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-white/5 text-gray-400"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* DOI Link */}
          <motion.a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm"
            whileHover={{ x: 5 }}
          >
            View Paper
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
} 