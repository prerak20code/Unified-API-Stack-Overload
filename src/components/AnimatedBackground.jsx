import React from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  // Generate emotion-themed shapes with random properties
  const shapes = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    type: ['smiley-happy', 'smiley-sad', 'speech-bubble', 'heart', 'music-note'][i % 5],
    size: Math.random() * 50 + 25, // 25-75px
    delay: Math.random() * 12, // 0-12s delay
    duration: Math.random() * 25 + 20, // 20-45s duration
    opacity: Math.random() * 0.45 + 0.18, // 0.08-0.33 opacity (more subtle)
  }));

  return (
    <div className="animated-background">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={`floating-shape ${shape.type}`}
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            animationDelay: `${shape.delay}s`,
            animationDuration: `${shape.duration}s`,
            opacity: shape.opacity,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
