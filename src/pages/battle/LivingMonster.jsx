import React, { useMemo } from 'react';

/**
 * Procedural High-Fidelity Vector Monster Component.
 * Dynamically constructs unique structural SVG shapes based on the monster's name and element.
 * Drives multi-joint skeletal animation cycles (wing flaps, bird flight, bone shatters, jaw bites)
 * and maps specific attack motions (bites, tail smashes, flame breaths) reactive to attackIndex.
 */
const LivingMonster = ({ questTitle, animState, attackIndex = 1, isLowHp }) => {
  
  // 1. DYNAMIC IDENTITY PARSER (Species, Element, Glow)
  const monsterTraits = useMemo(() => {
    const title = (questTitle || '').toLowerCase();
    
    // Determine Species Anatomy Structure
    let species = 'Dire Wolf';
    if (title.includes('dragon') || title.includes('drake') || title.includes('wyvern')) {
      species = 'Ancient Dragon';
    } else if (title.includes('skeleton') || title.includes('knight') || title.includes('undead') || title.includes('lich') || title.includes('golem')) {
      species = 'Skeleton Knight';
    } else if (title.includes('spider') || title.includes('arachnid') || title.includes('web') || title.includes('hive')) {
      species = 'Shadow Assassin Spider';
    } else if (title.includes('falcon') || title.includes('bird') || title.includes('eagle') || title.includes('hawk') || title.includes('griffin')) {
      species = 'Thunder Falcon';
    } else if (title.includes('serpent') || title.includes('snake') || title.includes('worm')) {
      species = 'Inferno Serpent';
    }

    // Determine Elemental Core & Hue mapping
    let element = 'void';
    let hue = 280; // purple void
    let glowColor = '#d500f9';

    if (title.includes('inferno') || title.includes('fire') || title.includes('flame') || title.includes('ember') || title.includes('igneous')) {
      element = 'fire';
      hue = 15; // red/orange fire
      glowColor = '#ff5722';
    } else if (title.includes('frost') || title.includes('ice') || title.includes('frozen') || title.includes('cold') || title.includes('snow')) {
      element = 'ice';
      hue = 195; // icy blue
      glowColor = '#00e5ff';
    } else if (title.includes('stone') || title.includes('rock') || title.includes('earth') || title.includes('sand')) {
      element = 'earth';
      hue = 40; // sandy gold
      glowColor = '#ffd54f';
    } else if (title.includes('thunder') || title.includes('lightning') || title.includes('storm')) {
      element = 'thunder';
      hue = 60; // electric yellow
      glowColor = '#ffff00';
    }

    return { species, element, hue, glowColor };
  }, [questTitle]);

  const { species, element, hue, glowColor } = monsterTraits;

  // 2. TIMED ATTACK ACTION STATE CLASSES
  const activeStanceClass = useMemo(() => {
    if (isLowHp && animState === 'idle') {
      return 'state-exhausted';
    }
    
    if (animState === 'dashing') {
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

  // 3. LAYERED SVG VECTOR STRUCTURAL SYSTEM
  const renderMonsterSVG = () => {
    const baseColor = `hsl(${hue}, 70%, 25%)`;
    const accentColor = `hsl(${hue}, 90%, 45%)`;
    const underbelly = `hsl(${hue}, 50%, 15%)`;
    const eyeColor = element === 'void' ? '#ff00ff' : element === 'fire' ? '#ff3d00' : element === 'ice' ? '#00e5ff' : '#ffd54f';

    switch (species) {
      case 'Ancient Dragon':
        // Grand high-fidelity scaled dragon with wing physics
        return (
          <g>
            {/* Wing elements flaring (flaps staggered) */}
            <g className="wing-flap-left" style={{ transformOrigin: '60px 85px' }}>
              <path d="M 60,85 C 30,50 10,60 5,95 C 15,115 45,105 60,85" fill={accentColor} opacity="0.8" />
              <path d="M 50,80 C 25,55 12,65 8,90" stroke="#ffd700" strokeWidth="2.5" fill="none" />
            </g>
            <g className="wing-flap-right" style={{ transformOrigin: '140px 85px' }}>
              <path d="M 140,85 C 170,50 190,60 195,95 C 185,115 155,105 140,85" fill={accentColor} opacity="0.8" />
              <path d="M 150,80 C 175,55 188,65 192,90" stroke="#ffd700" strokeWidth="2.5" fill="none" />
            </g>

            {/* Dragon tail sweeping */}
            <path className="tail-wag" d="M 70,140 C 40,165 10,150 15,130 C 20,120 45,135 70,140" fill={underbelly} />

            {/* Quadruped heavy dragon legs */}
            <path className="limb-joint-left" d="M 75,135 L 65,178" stroke={baseColor} strokeWidth="15" strokeLinecap="round" />
            <path className="limb-joint-right" d="M 125,135 L 135,178" stroke={baseColor} strokeWidth="15" strokeLinecap="round" />

            {/* Scaled broad dragon chest body */}
            <ellipse cx="100" cy="120" rx="36" ry="26" fill={baseColor} />
            <ellipse cx="100" cy="120" rx="30" ry="20" fill={underbelly} />
            {/* Scale plates */}
            <path d="M 90,110 Q 100,105 110,110" stroke={accentColor} strokeWidth="2" fill="none" />
            <path d="M 85,120 Q 100,115 115,120" stroke={accentColor} strokeWidth="2.5" fill="none" />

            {/* Horned dragon head & neck */}
            <path d="M 100,95 Q 115,65 125,50 L 135,50 Q 120,70 100,105" fill={baseColor} />
            {/* Head block */}
            <ellipse cx="130" cy="52" rx="18" ry="12" fill={baseColor} />
            <polygon points="128,40 148,22 138,44" fill={accentColor} />
            <polygon points="120,40 138,20 128,44" fill={underbelly} />

            {/* Glowing flame jaw nozzle */}
            <polygon points="135,54 150,60 135,62" fill={eyeColor} />
            {/* Predator eyes */}
            <ellipse cx="134" cy="48" rx="2.5" ry="4" fill={eyeColor} style={{ filter: 'drop-shadow(0 0 4px ' + eyeColor + ')' }} />
          </g>
        );

      case 'Skeleton Knight':
        // Armored skeleton swordsman with ribcages
        return (
          <g className="cycle-shatter-breathe">
            {/* Spine backbone */}
            <line x1="100" y1="75" x2="100" y2="135" stroke="#eceff1" strokeWidth="8" />

            {/* Skeletal bony ribcage ribs */}
            <path d="M 85,90 Q 100,95 115,90 M 80,102 Q 100,107 120,102 M 82,114 Q 100,119 118,114" fill="none" stroke="#eceff1" strokeWidth="5.5" strokeLinecap="round" />

            {/* Armored steel shoulder pads */}
            <rect className="ear-twitch" x="65" y="70" width="22" height="20" rx="4" fill="#37474f" stroke="#cfd8dc" strokeWidth="1.5" />
            <rect className="ear-twitch" x="113" y="70" width="22" height="20" rx="4" fill="#37474f" stroke="#cfd8dc" strokeWidth="1.5" />

            {/* Iron vanguard shield (Left hand) */}
            <path className="limb-joint-left" d="M 68,90 Q 42,95 48,135 Q 68,145 68,130 Z" fill="#cfd8dc" stroke="#37474f" strokeWidth="2" />
            <polygon points="53,105 63,105 58,125" fill={accentColor} />

            {/* Steel executioner sword (Right hand) */}
            <g className="limb-joint-right" style={{ transformOrigin: '125px 95px' }}>
              <line x1="125" y1="95" x2="155" y2="40" stroke="#eceff1" strokeWidth="5.5" />
              <path d="M 125,95 L 175,35 M 120,95 L 130,100" fill="none" stroke="#cfd8dc" strokeWidth="3" />
            </g>

            {/* Armored pelvis block */}
            <polygon points="85,135 115,135 108,155 92,155" fill="#37474f" stroke="#cfd8dc" strokeWidth="1.5" />

            {/* Leg bones */}
            <line x1="90" y1="155" x2="85" y2="185" stroke="#eceff1" strokeWidth="7" strokeLinecap="round" />
            <line x1="110" y1="155" x2="115" y2="185" stroke="#eceff1" strokeWidth="7" strokeLinecap="round" />

            {/* Undead skull skull-head */}
            <circle cx="100" cy="58" r="14" fill="#eceff1" stroke="#b0bec5" strokeWidth="1.5" />
            {/* Jaw bone */}
            <path d="M 92,66 L 95,74 L 105,74 L 108,66" fill="#eceff1" stroke="#b0bec5" strokeWidth="1.5" />
            
            {/* Glowing hollow red socket eyes */}
            <circle cx="95" cy="55" r="2.5" fill={eyeColor} style={{ filter: 'drop-shadow(0 0 6px ' + eyeColor + ')' }} />
            <circle cx="105" cy="55" r="2.5" fill={eyeColor} style={{ filter: 'drop-shadow(0 0 6px ' + eyeColor + ')' }} />
          </g>
        );

      case 'Shadow Assassin Spider':
        // Joint-legged arachnid core
        return (
          <g className="cycle-spider-legs" style={{ filter: `drop-shadow(0 0 10px ${glowColor}66)` }}>
            {/* 8 spider leg joints with staggered animation delays */}
            <path className="limb-joint-left" d="M 60,110 Q 20,80 15,130" fill="none" stroke={baseColor} strokeWidth="7" strokeLinecap="round" />
            <path className="limb-joint-left" d="M 60,115 Q 15,95 10,145" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" style={{ animationDelay: '0.2s' }} />
            <path className="limb-joint-left" d="M 60,120 Q 10,110 5,160" fill="none" stroke={baseColor} strokeWidth="6" strokeLinecap="round" style={{ animationDelay: '0.4s' }} />
            <path className="limb-joint-left" d="M 60,125 Q 15,130 10,175" fill="none" stroke={underbelly} strokeWidth="5" strokeLinecap="round" style={{ animationDelay: '0.6s' }} />

            <path className="limb-joint-right" d="M 140,110 Q 180,80 185,130" fill="none" stroke={baseColor} strokeWidth="7" strokeLinecap="round" />
            <path className="limb-joint-right" d="M 140,115 Q 185,95 190,145" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" style={{ animationDelay: '0.1s' }} />
            <path className="limb-joint-right" d="M 140,120 Q 190,110 195,160" fill="none" stroke={baseColor} strokeWidth="6" strokeLinecap="round" style={{ animationDelay: '0.3s' }} />
            <path className="limb-joint-right" d="M 140,125 Q 185,130 190,175" fill="none" stroke={underbelly} strokeWidth="5" strokeLinecap="round" style={{ animationDelay: '0.5s' }} />

            {/* bulbous web sac */}
            <ellipse cx="100" cy="140" rx="30" ry="24" fill={underbelly} />
            <ellipse cx="100" cy="140" rx="24" ry="18" fill={baseColor} />
            <path d="M 85,130 Q 100,120 115,130" fill="none" stroke={accentColor} strokeWidth="3" />

            {/* Core spider head */}
            <circle cx="100" cy="98" r="16" fill={baseColor} />

            {/* Compound glowing red eyes */}
            <circle cx="92" cy="92" r="3.5" fill={eyeColor} />
            <circle cx="100" cy="90" r="3" fill={eyeColor} />
            <circle cx="108" cy="92" r="3.5" fill={eyeColor} />
            <circle cx="94" cy="98" r="2" fill={eyeColor} />
            <circle cx="106" cy="98" r="2" fill={eyeColor} />
          </g>
        );

      case 'Thunder Falcon':
        // Electric aerial bird creature
        return (
          <g className="levitating-mage">
            {/* Wing Flaps */}
            <g className="wing-flap-left" style={{ transformOrigin: '80px 105px' }}>
              <path d="M 80,105 C 40,75 25,95 20,125 C 35,145 65,125 80,105" fill={accentColor} />
              <line x1="80" y1="105" x2="30" y2="95" stroke="#ffffff" strokeWidth="2" />
            </g>
            <g className="wing-flap-right" style={{ transformOrigin: '120px 105px' }}>
              <path d="M 120,105 C 160,75 175,95 180,125 C 165,145 135,125 120,105" fill={accentColor} />
              <line x1="120" y1="105" x2="170" y2="95" stroke="#ffffff" strokeWidth="2" />
            </g>

            {/* Tail feathers */}
            <polygon points="90,135 110,135 105,175 95,175" fill={underbelly} />

            {/* Bird body torso */}
            <ellipse cx="100" cy="115" rx="22" ry="28" fill={baseColor} />
            <ellipse cx="100" cy="115" rx="16" ry="20" fill={underbelly} />

            {/* Beaked Eagle Head */}
            <circle cx="100" cy="74" r="14" fill={baseColor} />
            {/* Golden predator beak */}
            <polygon points="100,68 116,74 100,80" fill="#ffd700" stroke="#b78a00" strokeWidth="1" />
            {/* Glowing bird eyes */}
            <circle cx="102" cy="70" r="2.5" fill={eyeColor} style={{ filter: 'drop-shadow(0 0 4px ' + eyeColor + ')' }} />
          </g>
        );

      case 'Inferno Serpent':
        // Segmented slithering fire snake
        return (
          <g className="cycle-slither">
            {/* Sinusoidal slithering paths */}
            <path d="M 40,150 C 40,110 80,100 80,70 C 80,40 120,30 120,60 C 120,90 160,100 160,140" fill="none" stroke={underbelly} strokeWidth="26" strokeLinecap="round" />
            <path d="M 50,140 C 50,110 90,95 90,70 C 90,45 110,40 110,65 C 110,90 150,110 150,140" fill="none" stroke={baseColor} strokeWidth="20" strokeLinecap="round" />
            
            {/* Heat scales */}
            <path d="M 50,140 C 50,110 90,95 90,70 C 90,45 110,40 110,65" fill="none" stroke={accentColor} strokeWidth="6" strokeDasharray="10,8" strokeLinecap="round" />

            {/* Serpent head block */}
            <ellipse cx="100" cy="65" rx="22" ry="15" fill={baseColor} />
            {/* Splitting fire tongue */}
            <path className="ear-twitch" d="M 85,55 L 72,50 M 85,55 L 72,60" fill="none" stroke="#ff3366" strokeWidth="3.5" strokeLinecap="round" />

            {/* Visor eyes */}
            <ellipse cx="108" cy="61" rx="3.5" ry="5.5" fill={eyeColor} style={{ filter: 'drop-shadow(0 0 5px ' + eyeColor + ')' }} />
          </g>
        );

      case 'Dire Wolf':
      default:
        // Realistic quad-ped heavy breathing wolf structure
        return (
          <g className="cycle-breathe-wolf">
            {/* Tail wagging */}
            <path className="tail-wag" d="M 40,120 C 20,110 5,80 15,60 C 25,60 35,90 45,115" fill={baseColor} />
            
            {/* Front & Rear leg structures */}
            <path className="limb-joint-left" d="M 60,130 L 50,175" stroke={underbelly} strokeWidth="12" strokeLinecap="round" />
            <path className="limb-joint-right" d="M 80,130 L 75,175" stroke={baseColor} strokeWidth="14" strokeLinecap="round" />
            <path className="limb-joint-right" d="M 115,130 L 120,175" stroke={underbelly} strokeWidth="12" strokeLinecap="round" />
            <path className="limb-joint-left" d="M 130,130 L 138,175" stroke={baseColor} strokeWidth="14" strokeLinecap="round" />

            {/* Massive aggressive wolf torso */}
            <ellipse cx="95" cy="115" rx="42" ry="26" fill={baseColor} />
            <ellipse cx="95" cy="115" rx="34" ry="18" fill={underbelly} />

            {/* Neck spiky ruff */}
            <polygon points="120,88 148,98 132,122 108,110" fill={accentColor} />

            {/* Head structure & muzzles */}
            <path className="ear-twitch" d="M 130,85 C 130,65 168,65 162,95 C 150,105 135,100 130,85" fill={baseColor} />
            
            {/* Spiky wolf ears */}
            <polygon className="ear-twitch" points="134,75 142,48 148,70" fill={accentColor} />
            <polygon className="ear-twitch" points="144,72 152,46 156,68" fill={underbelly} />

            {/* Aggressive glowing slit eyes */}
            <polygon points="146,80 156,83 148,88" fill={eyeColor} style={{ filter: 'drop-shadow(0 0 5px ' + eyeColor + ')' }} />
          </g>
        );
    }
  };

  return (
    <div className={`entity-anchor monster-anchor ${activeStanceClass}`}>
      {/* 1. Orbiting elemental magical aura rings */}
      <div className="ambient-elemental-weather">
        {Array.from({ length: 6 }).map((_, i) => {
          const rotationAngle = (i * 360) / 6;
          const delay = (i * 0.2).toFixed(1);
          
          return (
            <div
              key={i}
              className={`elemental-orbiting-particle particle-${element}`}
              style={{
                position: 'absolute',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: glowColor,
                boxShadow: `0 0 10px ${glowColor}`,
                left: '50%',
                top: '50%',
                transform: `rotate(${rotationAngle}deg) translate(95px)`,
                animation: `rotateAura 4s linear infinite`,
                animationDelay: `${delay}s`,
                opacity: 0.65
              }}
            />
          );
        })}
      </div>

      {/* 2. SVG Vector Canvas */}
      <svg className="living-svg" viewBox="0 0 200 200">
        {renderMonsterSVG()}
      </svg>
    </div>
  );
};

export default LivingMonster;
