'use client';

import React from 'react';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    xs: 'w-5 h-5 rounded-md shadow-sm',
    sm: 'w-8 h-8 rounded-xl shadow-md',
    md: 'w-10 h-10 rounded-xl shadow-lg',
    lg: 'w-12 h-12 rounded-2xl shadow-xl',
  };

  const iconSizeMap = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-5 h-5',
    md: 'w-6.5 h-6.5',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`${sizeMap[size]} bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-500 flex items-center justify-center shadow-rose-500/20 shrink-0 relative overflow-hidden group select-none ${className}`}
    >
      <svg
        className={`${iconSizeMap[size]} text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-105`}
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rotated Horseshoe + Heart (18° Angle) */}
        <g transform="translate(16 16) rotate(18) scale(0.74) translate(-16 -16)">
          {/* Horseshoe Body with 8 Perforations */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="
              M 3.8 4.2 
              C 6.2 3.0 9.8 4.4 10.2 7.8 
              C 9.8 11.2 9.2 13.8 9.5 16.8 
              C 10.0 21.2 12.6 23.8 16.0 23.8 
              C 19.4 23.8 22.0 21.2 22.5 16.8 
              C 22.8 13.8 22.2 11.2 21.8 7.8 
              C 22.2 4.4 25.8 3.0 28.2 4.2 
              C 30.4 5.4 31.0 8.4 29.8 11.2 
              C 28.8 13.6 28.6 16.4 29.0 19.0 
              C 29.8 25.5 24.2 30.5 16.0 30.5 
              C 7.8 30.5 2.2 25.5 3.0 19.0 
              C 3.4 16.4 3.2 13.6 2.2 11.2 
              C 1.0 8.4 1.6 5.4 3.8 4.2 Z

              M 6.4 7.5 A 1.25 1.25 0 1 0 6.4 10.0 A 1.25 1.25 0 1 0 6.4 7.5 Z
              M 5.0 14.0 A 1.25 1.25 0 1 0 5.0 16.5 A 1.25 1.25 0 1 0 5.0 14.0 Z
              M 6.5 20.8 A 1.25 1.25 0 1 0 6.5 23.3 A 1.25 1.25 0 1 0 6.5 20.8 Z
              M 10.8 26.5 A 1.25 1.25 0 1 0 10.8 29.0 A 1.25 1.25 0 1 0 10.8 26.5 Z

              M 25.6 7.5 A 1.25 1.25 0 1 0 25.6 10.0 A 1.25 1.25 0 1 0 25.6 7.5 Z
              M 27.0 14.0 A 1.25 1.25 0 1 0 27.0 16.5 A 1.25 1.25 0 1 0 27.0 14.0 Z
              M 25.5 20.8 A 1.25 1.25 0 1 0 25.5 23.3 A 1.25 1.25 0 1 0 25.5 20.8 Z
              M 21.2 26.5 A 1.25 1.25 0 1 0 21.2 29.0 A 1.25 1.25 0 1 0 21.2 26.5 Z
            "
          />

          {/* Centered Oshi Heart */}
          <path
            d="
              M 16.0 18.2 
              L 15.3 17.5 
              C 12.8 15.2 11.2 13.7 11.2 11.8 
              C 11.2 10.2 12.4 9.0 13.9 9.0 
              C 14.8 9.0 15.5 9.4 16.0 10.0 
              C 16.5 9.4 17.2 9.0 18.1 9.0 
              C 19.6 9.0 20.8 10.2 20.8 11.8 
              C 20.8 13.7 19.2 15.2 16.7 17.5 
              Z
            "
          />
        </g>

        {/* Upright Victory Sparkle Star */}
        <path
          d="M 24.5 3.0 L 25.6 6.4 L 29.0 7.5 L 25.6 8.6 L 24.5 12.0 L 23.4 8.6 L 20.0 7.5 L 23.4 6.4 Z"
          fill="#FDE047"
        />
      </svg>
    </div>
  );
};