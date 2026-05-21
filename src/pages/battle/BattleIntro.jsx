import React, { useEffect, useState } from 'react';

/**
 * Handles the RPG battle entry sequence.
 * Renders a black screen-skewed skew slide wipe and high-intensity white flash
 * while scheduling the appearance of HUD and sprites.
 */
const BattleIntro = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // SNAPPY PACING: 2.2 seconds total intro duration
    const timer = setTimeout(() => {
      setIsActive(false);
      if (onComplete) onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isActive) return null;

  return (
    <>
      {/* Skewed diagonal wipe slider block */}
      <div className="battle-wipe" />

      {/* Screen flash glow trigger */}
      <div className="intro-flash" />
    </>
  );
};

export default BattleIntro;
