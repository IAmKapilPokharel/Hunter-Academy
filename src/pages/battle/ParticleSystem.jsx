import React from 'react';

/**
 * Renders particle bursts (slashes, fire, healing glows, physical impact stars)
 * over combatants during skill triggers.
 */
const ParticleSystem = ({ activeParticles }) => {
  if (!activeParticles || activeParticles.length === 0) return null;

  return (
    <div className="particles-overlay">
      {activeParticles.map((part) => {
        // Render Sword Slash strokes
        if (part.type === 'slash') {
          return (
            <div
              key={part.id}
              className="slash-stroke"
              style={{
                left: `${part.x}%`,
                top: `${part.y}%`,
                '--angle': part.angle ? `${part.angle}deg` : '-45deg',
              }}
            />
          );
        }

        // Render multi-particle radial bursts (fire, heal, impact)
        let particleColor = '#ff5722'; // default fire orange
        if (part.type === 'heal') particleColor = '#2eff8b'; // holy green
        if (part.type === 'impact') particleColor = '#ffd54f'; // sparks gold

        // Generate 12 radial spark directions
        const sparksCount = 12;
        const sparks = Array.from({ length: sparksCount }).map((_, i) => {
          const angle = (i * 2 * Math.PI) / sparksCount;
          const radius = 60 + Math.random() * 40; // dispersion distance
          const tx = `${Math.cos(angle) * radius}px`;
          const ty = `${Math.sin(angle) * radius}px`;
          const size = `${6 + Math.random() * 8}px`;
          
          return {
            id: i,
            tx,
            ty,
            size,
          };
        });

        return (
          <div
            key={part.id}
            style={{
              position: 'absolute',
              left: `${part.x}%`,
              top: `${part.y}%`,
              width: '10px',
              height: '10px',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {sparks.map((s) => (
              <div
                key={s.id}
                className="particle-unit"
                style={{
                  width: s.size,
                  height: s.size,
                  background: particleColor,
                  boxShadow: `0 0 10px ${particleColor}`,
                  '--tx': s.tx,
                  '--ty': s.ty,
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ParticleSystem;
