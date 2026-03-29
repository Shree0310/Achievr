'use client';

import { motion } from 'framer-motion';

interface PlannerSkeletonProps {
  className?: string;
}

export function PlannerSkeleton({ className = '' }: PlannerSkeletonProps) {
  // Task card skeleton patterns
  const taskLines = [
    // Card 1
    {
      delay: 0,
      segments: [
        { width: 'w-3/4', color: 'bg-slate-400/70' },
        { width: 'w-16', color: 'bg-red-400/60', rounded: true },
      ],
      subline: { width: 'w-24', color: 'bg-slate-500/50' },
    },
    // Card 2
    // {
    //   delay: 0.15,
    //   segments: [
    //     { width: 'w-2/3', color: 'bg-slate-400/70' },
    //     { width: 'w-20', color: 'bg-amber-400/60', rounded: true },
    //   ],
    //   subline: { width: 'w-20', color: 'bg-slate-500/50' },
    // },
    // Card 3
    // {
    //   delay: 0.3,
    //   segments: [
    //     { width: 'w-4/5', color: 'bg-slate-400/70' },
    //     { width: 'w-14', color: 'bg-emerald-400/60', rounded: true },
    //   ],
    //   subline: { width: 'w-28', color: 'bg-slate-500/50' },
    // },
    // Card 4
    // {
    //   delay: 0.45,
    //   segments: [
    //     { width: 'w-1/2', color: 'bg-slate-400/70' },
    //     { width: 'w-16', color: 'bg-cyan-400/60', rounded: true },
    //   ],
    //   subline: { width: 'w-20', color: 'bg-slate-500/50' },
    // },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Header skeleton */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-6"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
        />
        <div className="h-4 w-40 bg-slate-600/50 rounded-full" />
      </motion.div>

      {/* Task cards */}
      <div className="space-y-3">
        {taskLines.map((task, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              delay: task.delay,
              duration: 0.5,
              ease: [0.23, 1, 0.32, 1], // Custom spring-like easing
            }}
            className="relative bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 overflow-hidden"
          >
            {/* Card content */}
            <div className="flex items-start justify-between gap-3 mb-3">
              {task.segments.map((segment, segIndex) => (
                <motion.div
                  key={segIndex}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: task.delay + 0.2 + segIndex * 0.1,
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                  style={{ originX: 0 }}
                  className={`
                    h-5 ${segment.width} ${segment.color}
                    ${segment.rounded ? 'rounded-full' : 'rounded'}
                  `}
                />
              ))}
            </div>

            {/* Subline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: task.delay + 0.4, duration: 0.3 }}
              className={`h-3 ${task.subline.width} ${task.subline.color} rounded`}
            />

            {/* Shimmer effect per card */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
              animate={{ translateX: ['−100%', '200%'] }}
              transition={{
                delay: task.delay + 0.5,
                duration: 1,
                ease: 'easeInOut',
              }}
            />

            {/* Left accent line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                delay: task.delay + 0.1,
                duration: 0.3,
                ease: 'easeOut',
              }}
              style={{ originY: 0 }}
              className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400/80 to-purple-500/80 rounded-l-lg"
            />
          </motion.div>
        ))}
      </div>

      {/* Pulsing glow underneath */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-cyan-500/20 blur-3xl rounded-full"
      />
    </div>
  );
}