import React, { useMemo } from 'react';

/**
 * High-Fidelity Vector Hunter Component.
 * Dynamically builds class armor details and scales weapons based on active level / Hunter Rank.
 * Unlocks runic energy trails, neon glows, and cosmic particle rings for higher ranks (E to SS).
 */
const LivingHunter = ({ playerClass, animState, attackIndex = 1, rank = 'D', isLowHp }) => {

  // 1. STATE MACHINE TIMED MOTION CLASSES
  const activeStanceClass = useMemo(() => {
    if (isLowHp && animState === 'idle') {
      return 'state-exhausted';
    }

    if (animState === 'attacking') {
      return `state-attack-${attackIndex}`;
    }

    const animClasses = {
      idle: 'state-idle',
      casting: 'state-attacking-cast',
      hit: 'state-hit',
      dead: 'state-dead',
      victory: 'state-victory'
    };

    return animClasses[animState] || 'state-idle';
  }, [animState, attackIndex, isLowHp]);

  // 2. CLASS CONFIGURATION & WEAPON SYSTEM
  const classConfig = {
    Saber: {
      color: '#00b8ff',
      auraHue: 200,
      weaponGlow: '#00b8ff',
      isMelee: true
    },
    Mage: {
      color: '#9b51e0',
      auraHue: 280,
      weaponGlow: '#c678ff',
      isMelee: false
    },
    Assassin: {
      color: '#4a154b',
      auraHue: 310,
      weaponGlow: '#ff007f',
      isMelee: true
    },
    Ranger: {
      color: '#00e676',
      auraHue: 140,
      weaponGlow: '#2eff8b',
      isMelee: false
    }
  };

  const currentClass = classConfig[playerClass] || classConfig.Saber;

  // 3. PROGRESSIVE RANK SYSTEM (Aura Orbits & Weapon Runes)
  const rankTraits = useMemo(() => {
    const r = (rank || 'D').toUpperCase();
    let particleCount = 4;
    let auraScale = 1.0;
    let unlockRunes = false;
    let glowFilter = 'drop-shadow(0 0 10px ' + currentClass.weaponGlow + '66)';

    if (r === 'C' || r === 'B') {
      particleCount = 6;
      auraScale = 1.35;
    } else if (r === 'A' || r === 'S') {
      particleCount = 8;
      auraScale = 1.8;
      unlockRunes = true;
      glowFilter = 'drop-shadow(0 0 16px ' + currentClass.weaponGlow + 'aa)';
    } else if (r === 'SS') {
      particleCount = 12;
      auraScale = 2.4;
      unlockRunes = true;
      glowFilter = 'drop-shadow(0 0 25px ' + currentClass.weaponGlow + 'ff)';
    }

    return { particleCount, auraScale, unlockRunes, glowFilter };
  }, [rank, currentClass.weaponGlow]);

  const { particleCount, auraScale, unlockRunes, glowFilter } = rankTraits;

  // 4. LAYERED SVG VECTOR STRUCTURAL SYSTEM
  const renderHunterSVG = () => {
    const shieldColor = `hsl(${currentClass.auraHue}, 70%, 30%)`;
    const coreArmor = `hsl(${currentClass.auraHue}, 50%, 15%)`;
    const visualGlow = currentClass.weaponGlow;

    switch (playerClass) {
      case 'Mage':
        // High-fidelity levitating wizard
        return (
          <g className="levitating-mage" style={{ filter: glowFilter }}>
            {/* Spinning Arcane Rune Rings */}
            <circle cx="65" cy="100" r="40" fill="none" stroke={visualGlow} strokeWidth="1" strokeDasharray="10,8" opacity="0.3" style={{ transformOrigin: '65px 100px', animation: 'rotateAura 15s linear infinite' }} />
            <circle cx="65" cy="100" r="30" fill="none" stroke={visualGlow} strokeWidth="0.8" strokeDasharray="5,15" opacity="0.4" style={{ transformOrigin: '65px 100px', animation: 'rotateAura 8s linear infinite reverse' }} />

            {/* Levitating robes */}
            <path d="M 45,90 L 85,90 L 95,165 L 35,165 Z" fill={coreArmor} />
            <path d="M 50,90 Q 65,130 80,90" fill="#2c1a4d" />

            {/* Arcane cowl hood */}
            <path d="M 50,60 C 50,35 80,35 80,60 C 80,75 50,75 50,60" fill={shieldColor} />
            
            {/* Glowing hidden magical shadow eyes */}
            <ellipse cx="60" cy="58" rx="2" ry="3" fill={visualGlow} />
            <ellipse cx="70" cy="58" rx="2" ry="3" fill={visualGlow} />

            {/* Staff weapon with unlocked rune lines */}
            <g className="glow-pulse-weapon" style={{ '--weapon-glow': visualGlow }}>
              <line x1="88" y1="40" x2="88" y2="170" stroke="#795548" strokeWidth="5.5" strokeLinecap="round" />
              {/* Arcane core */}
              <circle cx="88" cy="35" r="10" fill={shieldColor} stroke={visualGlow} strokeWidth="2.5" />
              <circle cx="88" cy="35" r="5" fill="#ffffff" style={{ filter: `drop-shadow(0 0 8px ${visualGlow})` }} />
              {/* Wing details */}
              <path d="M 75,35 Q 88,20 101,35" fill="none" stroke="#ffd700" strokeWidth="3" />
              
              {/* S/SS Rank visual upgrades */}
              {unlockRunes && (
                <g>
                  <circle cx="88" cy="35" r="15" fill="none" stroke="#ffff00" strokeWidth="1.2" strokeDasharray="3,3" style={{ animation: 'rotateAura 3s linear infinite' }} />
                  <line x1="83" y1="90" x2="93" y2="90" stroke="#ffd700" strokeWidth="2" />
                  <line x1="83" y1="120" x2="93" y2="120" stroke="#ffd700" strokeWidth="2" />
                </g>
              )}
            </g>
          </g>
        );

      case 'Assassin':
        // Low-crouched Ninja holding Dual Daggers
        return (
          <g style={{ filter: glowFilter }}>
            {/* Dark stealth shadow ring */}
            <ellipse cx="65" cy="140" rx="35" ry="8" fill="none" stroke={visualGlow} strokeWidth="1.5" strokeDasharray="12,12" opacity="0.4" style={{ transformOrigin: '65px 140px', animation: 'rotateAura 6s linear infinite' }} />

            {/* Crouched body */}
            <path d="M 40,110 L 90,110 L 105,160 L 75,165 L 55,165 L 25,160 Z" fill={coreArmor} />
            <polygon points="50,90 80,90 90,110 40,110" fill={shieldColor} />

            {/* Mask */}
            <path d="M 52,65 C 52,45 78,45 78,65 C 78,78 52,78 52,65" fill={coreArmor} />
            <polygon points="58,62 65,65 59,68" fill={visualGlow} />
            <polygon points="72,62 65,65 71,68" fill={visualGlow} />

            {/* Dual daggers with unlocked energy trailing */}
            <g className="glow-pulse-weapon" style={{ '--weapon-glow': visualGlow }}>
              <line x1="30" y1="105" x2="15" y2="135" stroke="#455a64" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="15" y1="135" x2="5" y2="150" stroke={visualGlow} strokeWidth="3.5" strokeLinecap="round" />
              
              <line x1="100" y1="105" x2="115" y2="135" stroke="#455a64" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="115" y1="135" x2="125" y2="150" stroke={visualGlow} strokeWidth="3.5" strokeLinecap="round" />

              {/* S/SS Rank visual daggers trails */}
              {unlockRunes && (
                <g opacity="0.7">
                  <path d="M 5,150 Q -5,160 5,170" fill="none" stroke={visualGlow} strokeWidth="2.5" />
                  <path d="M 125,150 Q 135,160 125,170" fill="none" stroke={visualGlow} strokeWidth="2.5" />
                </g>
              )}
            </g>
          </g>
        );

      case 'Ranger':
        //Camouflage ranger pulling bowstring
        return (
          <g style={{ filter: glowFilter }}>
            <path d="M 42,85 L 88,85 L 98,165 L 32,165 Z" fill={coreArmor} />
            <polygon points="42,85 88,85 80,120 50,120" fill={shieldColor} />
            <path d="M 48,58 C 48,32 82,32 82,58 C 82,72 48,72 48,58" fill={coreArmor} />

            <circle cx="58" cy="56" r="4.5" fill="none" stroke={visualGlow} strokeWidth="1.5" />
            <circle cx="58" cy="56" r="1.5" fill={visualGlow} />

            {/* Recurve bow pulling arrow */}
            <g className="glow-pulse-weapon" style={{ '--weapon-glow': visualGlow }}>
              <path d="M 105,45 Q 125,100 105,155" fill="none" stroke="#795548" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M 105,45 Q 125,100 105,155" fill="none" stroke={visualGlow} strokeWidth="2.5" strokeLinecap="round" />
              
              <line x1="105" y1="45" x2="85" y2="100" stroke="#cfd8dc" strokeWidth="1.2" />
              <line x1="85" y1="100" x2="105" y2="155" stroke="#cfd8dc" strokeWidth="1.2" />

              <line x1="75" y1="100" x2="118" y2="100" stroke="#b0bec5" strokeWidth="3" strokeLinecap="round" />
              <polygon points="118,97 125,100 118,103" fill={visualGlow} />

              {/* S/SS Rank visual arrow laser core */}
              {unlockRunes && (
                <g>
                  <line x1="65" y1="100" x2="135" y2="100" stroke="#ffffff" strokeWidth="1.8" style={{ filter: 'drop-shadow(0 0 6px #ffffff)' }} />
                </g>
              )}
            </g>
          </g>
        );

      case 'Saber':
      default:
        // Steel plate Knight with glowing broadsword runes
        return (
          <g style={{ filter: glowFilter }}>
            {/* Sturdy armor */}
            <path d="M 40,80 L 90,80 L 100,165 L 30,165 Z" fill={coreArmor} />
            <path className="ear-twitch" d="M 30,75 L 50,75 L 42,95 L 26,90 Z" fill={shieldColor} />
            <path className="ear-twitch" d="M 100,75 L 80,75 L 88,95 L 104,90 Z" fill={shieldColor} />

            {/* visor helm */}
            <path d="M 48,52 C 48,25 82,25 82,52 L 80,74 L 50,74 Z" fill={coreArmor} />
            <polygon points="50,56 80,56 76,64 54,64" fill={shieldColor} />
            <ellipse cx="58" cy="60" rx="3" ry="1.5" fill={visualGlow} />
            <ellipse cx="72" cy="60" rx="3" ry="1.5" fill={visualGlow} />

            {/* Steel broadsword with unlocked rune carvings */}
            <g className="glow-pulse-weapon" style={{ '--weapon-glow': visualGlow }}>
              <line x1="82" y1="125" x2="108" y2="115" stroke="#ffd700" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="90" y1="122" x2="80" y2="135" stroke="#5d4037" strokeWidth="4.5" strokeLinecap="round" />
              
              <polygon points="92,121 97,119 135,35 125,32" fill="#cfd8dc" stroke={visualGlow} strokeWidth="1.5" />
              <line x1="95" y1="120" x2="128" y2="35" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

              {/* S/SS Rank visual glowing runes */}
              {unlockRunes && (
                <g>
                  {/* Glowing runic symbols on blade */}
                  <line x1="102" y1="102" x2="108" y2="92" stroke={visualGlow} strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 5px ' + visualGlow + ')' }} />
                  <line x1="112" y1="80" x2="118" y2="70" stroke={visualGlow} strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 5px ' + visualGlow + ')' }} />
                </g>
              )}
            </g>
          </g>
        );
    }
  };

  return (
    <div className={`entity-anchor player-anchor ${activeStanceClass}`}>
      {/* Dynamic orbital aura ring underneath (scales dynamically with active Rank) */}
      <div
        style={{
          position: 'absolute',
          width: `${70 * auraScale}px`,
          height: `${14 * auraScale}px`,
          borderRadius: '50%',
          background: 'transparent',
          border: `2.5px solid ${currentClass.weaponGlow}66`,
          boxShadow: `0 0 25px ${currentClass.weaponGlow}55, inset 0 0 15px ${currentClass.weaponGlow}33`,
          bottom: '15px',
          left: '50%',
          transform: 'translateX(-50%) rotateX(60deg)',
          pointerEvents: 'none',
          zIndex: 1,
          animation: 'rotateAura 8s linear infinite'
        }}
      />

      {/* Orbiting celestial particles for S/SS ranks */}
      {particleCount > 4 && (
        <div 
          className="celestial-particle-container"
          style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            left: '50%',
            top: '55%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
        >
          {Array.from({ length: particleCount }).map((_, i) => {
            const angle = (i * 360) / particleCount;
            const delay = (i * 0.15).toFixed(2);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: currentClass.weaponGlow,
                  boxShadow: `0 0 8px ${currentClass.weaponGlow}`,
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${angle}deg) translate(${55 * auraScale}px)`,
                  animation: 'rotateAura 5s linear infinite',
                  animationDelay: `${delay}s`,
                  opacity: 0.75
                }}
              />
            );
          })}
        </div>
      )}

      {/* Layered SVG Vector canvas */}
      <svg className="living-svg" viewBox="0 0 150 180">
        {renderHunterSVG()}
      </svg>
    </div>
  );
};

export default LivingHunter;
