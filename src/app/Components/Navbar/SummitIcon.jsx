import React from 'react';

const SummitIcon = ({ 
  size = 40, 
  className = "",
  variant = "default" // "default" or "dark"
}) => {
  const gradientId = `summit-grad-${Math.random().toString(36).substr(2, 9)}`;
  
  const colors = {
    default: ["#F59E0B", "#D97706"], // Orange gradient
    dark: ["#FCD34D", "#F59E0B"]     // Lighter orange for dark theme
  };

  const currentColors = colors[variant] || colors.default;

  return (
    <svg 
      viewBox="0 0 52 44" 
      width={size} 
      height={size} 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: currentColors[0]}} />
          <stop offset="100%" style={{stopColor: currentColors[1]}} />
        </linearGradient>
      </defs>
      
      {/* Mountain peaks */}
      <path 
        d="M8 32 L18 12 L28 20 L38 8 L44 32 Z" 
        fill={`url(#${gradientId})`} 
        opacity="0.8"
      />
      
      {/* Mountain outline */}
      <path 
        d="M8 32 L18 12 L28 20 L38 8 L44 32" 
        fill="none" 
        stroke={`url(#${gradientId})`} 
        strokeWidth="2"
      />
      
      {/* Summit flag */}
      <circle cx="38" cy="8" r="2" fill="#FFD700"/>
      <path 
        d="M36 6 L38 4 L40 6" 
        fill="none" 
        stroke="#FFD700" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default SummitIcon;
