import React from 'react';

/**
 * Renders floating damage/healing/evasion text badges at coordinates
 * on top of the combat scene using CSS keyframe animations.
 */
const DamageNumber = ({ activeNumbers }) => {
  if (!activeNumbers || activeNumbers.length === 0) return null;

  return (
    <div className="floating-damage-container">
      {activeNumbers.map((num) => {
        let styleClass = 'dmg-number-red';
        let isCrit = false;
        let displayVal = num.value;

        if (num.type === 'heal') {
          styleClass = 'dmg-number-green';
          displayVal = `+${num.value}`;
        } else if (num.type === 'critical') {
          styleClass = 'dmg-number-gold';
          isCrit = true;
        } else if (num.type === 'dodge') {
          styleClass = 'dmg-number-dodge';
          displayVal = 'EVADE';
        }

        return (
          <div
            key={num.id}
            className={`damage-badge ${styleClass}`}
            style={{
              left: `${num.x}%`,
              top: `${num.y}%`,
            }}
          >
            {displayVal}
            {isCrit && <span className="critical-label">CRITICAL!</span>}
          </div>
        );
      })}
    </div>
  );
};

export default DamageNumber;
