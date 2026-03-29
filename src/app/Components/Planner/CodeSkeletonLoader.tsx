'use client';

import { motion } from 'framer-motion';

interface CodeSkeletonLoaderProps {
  className?: string;
}

export function CodeSkeletonLoader({ className = '' }: CodeSkeletonLoaderProps) {
  // Define code-like line patterns with different "syntax" colors
  const lines = [
    // Line 1: import statement style
    { segments: [
      { width: 'w-12', color: 'bg-purple-500/80', isCircle: false },
      { width: 'w-20', color: 'bg-slate-400/60', isCircle: false },
      { width: 'w-16', color: 'bg-purple-500/80', isCircle: false },
      { width: 'w-24', color: 'bg-emerald-400/70', isCircle: false },
    ]},
    // Line 2: variable declaration
    { segments: [
      { width: 'w-14', color: 'bg-purple-500/80', isCircle: false },
      { width: 'w-32', color: 'bg-cyan-400/70', isCircle: false },
    ]},
    // Line 3: function with params
    { segments: [
      { width: 'w-44', color: 'bg-slate-400/60', isCircle: false },
      { width: 'w-28', color: 'bg-cyan-400/70', isCircle: false },
    ]},
    // Line 4: short line
    { segments: [
      { width: 'w-8', color: 'bg-slate-500/50', isCircle: false },
      { width: 'w-4', color: 'bg-slate-400/40', isCircle: true },
    ]},
    // Line 5: indented
    { indent: true, segments: [
      { width: 'w-24', color: 'bg-slate-400/60', isCircle: false },
    ]},
    // Line 6: indented with value
    { indent: true, segments: [
      { width: 'w-20', color: 'bg-slate-400/60', isCircle: false },
    ]},
    // Line 7: indented
    { indent: true, segments: [
      { width: 'w-28', color: 'bg-slate-400/60', isCircle: false },
    ]},
    // Line 8: with highlight
    { indent: true, segments: [
      { width: 'w-32', color: 'bg-slate-400/60', isCircle: false },
    ]},
    // Line 9: closing
    { segments: [
      { width: 'w-4', color: 'bg-slate-500/40', isCircle: true },
    ]},
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative bg-slate-950 rounded-xl p-6 overflow-hidden ${className}`}
    >
      {/* Window header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-700" />
          <div className="w-3 h-3 rounded-full bg-slate-700" />
          <div className="w-3 h-3 rounded-full bg-slate-700" />
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-slate-500 text-sm font-mono">/compo...modal.tsx</span>
        </div>
      </div>

      {/* Code lines */}
      <div className="space-y-3">
        {lines.map((line, lineIndex) => (
          <motion.div
            key={lineIndex}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: lineIndex * 0.08,
              duration: 0.4,
              ease: 'easeOut',
            }}
            className={`flex items-center gap-2 ${line.indent ? 'ml-6' : ''}`}
          >
            {line.segments.map((segment, segIndex) => (
              <motion.div
                key={segIndex}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: lineIndex * 0.08 + segIndex * 0.05,
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                style={{ originX: 0 }}
                className={`
                  h-4 rounded-full ${segment.width} ${segment.color}
                  ${segment.isCircle ? '!w-4 !rounded-full' : ''}
                `}
              />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Glow effect at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
    </motion.div>
  );
}