'use client'

import React, { useEffect, useState } from 'react'

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

const StarryBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Create initial stars
    const numberOfStars = 70;
    const colors = ['#FFE5B4', '#FFF4E0', '#FFD700', '#FFFAFA'];
    const initialStars: Star[] = Array.from({ length: numberOfStars }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setStars(initialStars);

    // Animate stars
    const animationInterval = setInterval(() => {
      setStars(prevStars => 
        prevStars.map(star => ({
          ...star,
          opacity: Math.sin((Date.now() / (1000 * star.speed)) + star.id) * 0.3 + 0.5,
        }))
      );
    }, 50);

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map(star => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            borderRadius: '50%',
            opacity: star.opacity,
            transition: 'opacity 0.5s ease-in-out',
            boxShadow: `0 0 ${star.size * 2}px ${star.size}px ${star.color}`,
            animation: 'twinkle 4s infinite',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default StarryBackground; 