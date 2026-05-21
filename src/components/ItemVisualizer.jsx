import React, { useMemo } from 'react';

/**
 * High-Fidelity Vector Item Visualizer.
 * Renders highly detailed, interactive, and glowing procedural SVG vector designs 
 * for weapons, helmets, armor, boots, bubbling potions, dragon cores, and fangs.
 * Completely replaces text labels and empty boxes with premium collectible assets.
 */
const ItemVisualizer = ({ itemName = '', slot = '', playerClass = 'Saber', size = 80, rarity = 'rare' }) => {
  
  // 1. DETERMINE SYSTEM ITEM KEY
  const itemKey = useMemo(() => {
    const name = (itemName || '').toLowerCase();
    const slotType = (slot || '').toLowerCase();

    if (name.includes('sword') || name.includes('blade') || slotType === 'weapon' && playerClass === 'Saber') return 'sword';
    if (name.includes('staff') || name.includes('wand') || slotType === 'weapon' && playerClass === 'Mage') return 'staff';
    if (name.includes('dagger') || name.includes('blade') || slotType === 'weapon' && playerClass === 'Assassin') return 'dagger';
    if (name.includes('bow') || slotType === 'weapon' && playerClass === 'Ranger') return 'bow';

    if (name.includes('greathelm') || name.includes('helmet') || slotType === 'helmet' && playerClass === 'Saber') return 'helmet-knight';
    if (name.includes('sage hood') || name.includes('sage') || slotType === 'helmet' && playerClass === 'Mage') return 'helmet-mage';
    if (name.includes('cowl') || name.includes('mask') || slotType === 'helmet' && playerClass === 'Assassin') return 'helmet-assassin';
    if (name.includes('goggles') || slotType === 'helmet' && playerClass === 'Ranger') return 'helmet-ranger';

    if (name.includes('plate') || name.includes('tunic') || slotType === 'armor' && playerClass === 'Saber') return 'armor-knight';
    if (name.includes('robe') || slotType === 'armor' && playerClass === 'Mage') return 'armor-mage';
    if (name.includes('nightfall') || slotType === 'armor' && playerClass === 'Assassin') return 'armor-assassin';
    if (name.includes('vest') || slotType === 'armor' && playerClass === 'Ranger') return 'armor-ranger';

    if (name.includes('sabatons') || slotType === 'boots' && playerClass === 'Saber') return 'boots-knight';
    if (name.includes('slippers') || slotType === 'boots' && playerClass === 'Mage') return 'boots-mage';
    if (name.includes('silent') || slotType === 'boots' && playerClass === 'Assassin') return 'boots-assassin';
    if (name.includes('boots') || slotType === 'boots' && playerClass === 'Ranger') return 'boots-ranger';

    if (name.includes('potion') || name.includes('health') || name.includes('elixir')) return 'potion-red';
    if (name.includes('mana') || name.includes('remedy')) return 'potion-blue';
    if (name.includes('core') || name.includes('crystal')) return 'dragon-core';
    if (name.includes('fang') || name.includes('tooth')) return 'wolf-fang';
    if (name.includes('gold') || name.includes('coins')) return 'gold';
    if (name.includes('trophy') || name.includes('cup') || name.includes('award')) return 'trophy';

    return 'potion-red'; // default
  }, [itemName, slot, playerClass]);

  // 2. DEFINE RARITY BORDERS AND EFFECTS
  const rarityColors = {
    common: { border: '#78909c', glow: 'rgba(120, 144, 156, 0.2)', tag: 'Common' },
    uncommon: { border: '#4caf50', glow: 'rgba(76, 175, 80, 0.3)', tag: 'Uncommon' },
    rare: { border: '#00b0ff', glow: 'rgba(0, 176, 255, 0.4)', tag: 'Rare' },
    epic: { border: '#9c27b0', glow: 'rgba(156, 39, 176, 0.5)', tag: 'Epic' },
    legendary: { border: '#ffb300', glow: 'rgba(255, 179, 0, 0.7)', tag: 'Legendary' }
  };

  const activeRarity = rarityColors[rarity] || rarityColors.rare;

  // 3. LAYERED SVG VECTOR PATH GENERATION
  const renderItemSVG = () => {
    switch (itemKey) {
      case 'sword':
        return (
          <g>
            {/* Sword blade base */}
            <polygon points="45,15 55,15 52,65 48,65" fill="#eceff1" stroke="#37474f" strokeWidth="1" />
            {/* Glowing fuller center core */}
            <line x1="50" y1="18" x2="50" y2="60" stroke="#00b0ff" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 4px #00b0ff)' }} />
            {/* Winged crossguard */}
            <path d="M 33,65 L 67,65 Q 50,68 33,65" fill="#ffd700" stroke="#b78a00" strokeWidth="1" />
            <circle cx="33" cy="65" r="2.5" fill="#ffd700" />
            <circle cx="67" cy="65" r="2.5" fill="#ffd700" />
            {/* Leather grip */}
            <rect x="47" y="66" width="6" height="15" rx="1.5" fill="#5d4037" />
            <line x1="47" y1="70" x2="53" y2="70" stroke="#3e2723" />
            <line x1="47" y1="75" x2="53" y2="75" stroke="#3e2723" />
            {/* Pommel gem */}
            <circle cx="50" cy="83" r="3.5" fill="#00b0ff" stroke="#ffd700" strokeWidth="1" />
          </g>
        );

      case 'staff':
        return (
          <g>
            {/* Mahogany shaft */}
            <line x1="38" y1="85" x2="62" y2="25" stroke="#4e342e" strokeWidth="4" strokeLinecap="round" />
            {/* Gold wraps */}
            <line x1="46" y1="65" x2="51" y2="61" stroke="#ffd700" strokeWidth="1.5" />
            <line x1="52" y1="50" x2="57" y2="46" stroke="#ffd700" strokeWidth="1.5" />
            {/* Golden wings socket */}
            <path d="M 52,28 C 45,20 48,10 65,15 C 65,15 68,30 52,28" fill="#ffd700" stroke="#b78a00" strokeWidth="1.2" />
            <path d="M 68,28 C 75,20 72,10 55,15 C 55,15 52,30 68,28" fill="#ffd700" stroke="#b78a00" strokeWidth="1.2" />
            {/* Levitating mana core gem */}
            <g style={{ animation: 'levitateMage 3s ease-in-out infinite' }}>
              <circle cx="60" cy="18" r="8" fill="#e040fb" stroke="#ffd700" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 8px #e040fb)' }} />
              <polygon points="60,13 63,18 60,23 57,18" fill="#ffffff" />
            </g>
          </g>
        );

      case 'dagger':
        return (
          <g>
            {/* Wavy wavy dark flame blade */}
            <path d="M 50,15 Q 45,25 53,35 Q 46,45 52,55 L 53,68 L 47,68 L 48,55 Q 54,45 47,35 Q 55,25 50,15" fill="#4a148c" stroke="#d500f9" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 6px #d500f9)' }} />
            {/* Hilt and handle */}
            <rect x="42" y="68" width="16" height="5" rx="1.5" fill="#212121" stroke="#ffd700" strokeWidth="1" />
            <rect x="47" y="73" width="6" height="11" rx="1" fill="#3e2723" />
            <circle cx="50" cy="86" r="3" fill="#ffd700" />
          </g>
        );

      case 'bow':
        return (
          <g>
            {/* Curved bow arc */}
            <path d="M 35,25 Q 75,50 35,75" fill="none" stroke="#2e7d32" strokeWidth="4" strokeLinecap="round" />
            <path d="M 35,25 Q 75,50 35,75" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" />
            {/* String */}
            <line x1="35" y1="25" x2="35" y2="75" stroke="#e0e0e0" strokeWidth="0.8" />
            {/* Resting wooden arrow */}
            <line x1="30" y1="50" x2="68" y2="50" stroke="#795548" strokeWidth="2.2" strokeLinecap="round" />
            {/* Golden glowing fletching */}
            <polygon points="68,47 75,50 68,53" fill="#00e676" style={{ filter: 'drop-shadow(0 0 4px #00e676)' }} />
            <polygon points="30,47 34,50 30,53" fill="#455a64" />
          </g>
        );

      case 'helmet-knight':
        return (
          <g>
            {/* Heavy iron helm */}
            <path d="M 35,65 C 35,35 65,35 65,65 L 60,78 L 40,78 Z" fill="#78909c" stroke="#37474f" strokeWidth="1.5" />
            {/* Vanguard Gold Crest wing */}
            <polygon points="50,38 42,22 58,22" fill="#ffd700" stroke="#b78a00" strokeWidth="1" />
            <polygon points="50,38 46,26 54,26" fill="#eceff1" />
            {/* Glowing visor slit */}
            <polygon points="40,55 60,55 58,62 42,62" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 6px #00e5ff)' }} />
            <line x1="50" y1="55" x2="50" y2="62" stroke="#37474f" strokeWidth="1.5" />
          </g>
        );

      case 'helmet-mage':
        return (
          <g>
            {/* Robe hood curve */}
            <path d="M 34,68 C 32,40 68,40 66,68 L 62,76 L 38,76 Z" fill="#4a148c" stroke="#d500f9" strokeWidth="1.5" />
            <path d="M 38,68 C 40,48 60,48 62,68" fill="#311b92" />
            {/* Arcane gold trimming */}
            <path d="M 34,68 Q 50,38 66,68" fill="none" stroke="#ffd700" strokeWidth="1.2" />
            {/* Glowing orbital eyes inside hood shadow */}
            <circle cx="45" cy="60" r="2.2" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 4px #00e5ff)' }} />
            <circle cx="55" cy="60" r="2.2" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 4px #00e5ff)' }} />
          </g>
        );

      case 'helmet-assassin':
        return (
          <g>
            {/* Black wrap silhouette */}
            <path d="M 36,66 C 36,44 64,44 64,66 L 60,76 L 40,76 Z" fill="#212121" stroke="#000000" strokeWidth="1.5" />
            <ellipse cx="50" cy="55" rx="10" ry="4" fill="#37474f" />
            {/* Glowing red tactical assassin eye slit */}
            <ellipse cx="50" cy="55" rx="6" ry="1.5" fill="#ff1744" style={{ filter: 'drop-shadow(0 0 5px #ff1744)' }} />
          </g>
        );

      case 'helmet-ranger':
        return (
          <g>
            {/* Leather cap */}
            <path d="M 35,62 C 35,38 65,38 65,62 L 60,74 L 40,74 Z" fill="#3e2723" stroke="#271206" strokeWidth="1.5" />
            {/* Tactical crosshair lenses */}
            <circle cx="45" cy="56" r="5" fill="none" stroke="#00e676" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 4px #00e676)' }} />
            <circle cx="45" cy="56" r="1.5" fill="#00e676" />
            <circle cx="56" cy="56" r="3.5" fill="none" stroke="#cfd8dc" strokeWidth="1" />
          </g>
        );

      case 'armor-knight':
        return (
          <g>
            {/* Knight Plate breastplate */}
            <path d="M 32,35 L 68,35 L 64,75 L 36,75 Z" fill="#78909c" stroke="#37474f" strokeWidth="1.5" />
            {/* Gold crest shield in center */}
            <polygon points="50,42 57,48 55,60 50,65 45,60 43,48" fill="#ffd700" stroke="#b78a00" strokeWidth="1" />
            {/* Heavy gold pauldrons */}
            <rect x="26" y="32" width="10" height="12" rx="2" fill="#ffd700" />
            <rect x="64" y="32" width="10" height="12" rx="2" fill="#ffd700" />
          </g>
        );

      case 'armor-mage':
        return (
          <g>
            {/* Rich robe body */}
            <path d="M 33,35 L 67,35 L 72,78 L 28,78 Z" fill="#4a148c" stroke="#ffd700" strokeWidth="1.5" />
            {/* Arcane energy sash */}
            <polygon points="45,35 55,35 58,78 42,78" fill="#e040fb" opacity="0.6" />
            {/* Star sigils */}
            <circle cx="50" cy="48" r="2.5" fill="#ffffff" />
            <circle cx="50" cy="62" r="2" fill="#ffffff" />
          </g>
        );

      case 'armor-assassin':
        return (
          <g>
            {/* Tight stealth strap vest */}
            <path d="M 34,35 L 66,35 L 62,75 L 38,75 Z" fill="#212121" stroke="#000000" strokeWidth="1.5" />
            {/* Stealth cross straps */}
            <line x1="34" y1="40" x2="62" y2="70" stroke="#d500f9" strokeWidth="2.5" opacity="0.8" />
            <line x1="66" y1="40" x2="38" y2="70" stroke="#d500f9" strokeWidth="2.5" opacity="0.8" />
          </g>
        );

      case 'armor-ranger':
        return (
          <g>
            {/* Ranger vest camo details */}
            <path d="M 34,35 L 66,35 L 63,75 L 37,75 Z" fill="#2e7d32" stroke="#1b5e20" strokeWidth="1.5" />
            <polygon points="40,35 60,35 56,52 44,52" fill="#8d6e63" />
            {/* Buckle */}
            <rect x="47" y="58" width="6" height="4" fill="#ffd700" />
          </g>
        );

      case 'boots-knight':
        return (
          <g>
            {/* Armored steel boot greaves */}
            <rect x="34" y="30" width="12" height="45" rx="3" fill="#78909c" stroke="#37474f" strokeWidth="1.5" />
            <rect x="54" y="30" width="12" height="45" rx="3" fill="#78909c" stroke="#37474f" strokeWidth="1.5" />
            <polygon points="34,70 30,75 46,75" fill="#455a64" />
            <polygon points="66,70 70,75 54,75" fill="#455a64" />
          </g>
        );

      case 'boots-mage':
        return (
          <g>
            {/* Glowing magic slippers */}
            <path d="M 34,50 Q 40,30 46,72 L 32,72 Z" fill="#4a148c" stroke="#d500f9" strokeWidth="1.2" />
            <path d="M 54,50 Q 60,30 66,72 L 52,72 Z" fill="#4a148c" stroke="#d500f9" strokeWidth="1.2" />
            <circle cx="40" cy="52" r="3" fill="#ffd700" />
            <circle cx="60" cy="52" r="3" fill="#ffd700" />
          </g>
        );

      case 'boots-assassin':
        return (
          <g>
            {/* Dark silent socks wrap */}
            <path d="M 34,42 Q 40,75 30,75 L 44,75 Z" fill="#212121" stroke="#000000" strokeWidth="1.5" />
            <path d="M 54,42 Q 60,75 70,75 L 56,75 Z" fill="#212121" stroke="#000000" strokeWidth="1.5" />
          </g>
        );

      case 'boots-ranger':
        return (
          <g>
            {/* Robust traveling boots */}
            <rect x="34" y="35" width="12" height="40" rx="2" fill="#5d4037" stroke="#3e2723" strokeWidth="1.5" />
            <rect x="54" y="35" width="12" height="40" rx="2" fill="#5d4037" stroke="#3e2723" strokeWidth="1.5" />
            {/* Green folded cuff */}
            <rect x="32" y="35" width="16" height="8" fill="#2e7d32" />
            <rect x="52" y="35" width="16" height="8" fill="#2e7d32" />
          </g>
        );

      case 'potion-red':
        return (
          <g>
            {/* Flask neck and glass rim */}
            <ellipse cx="50" cy="20" rx="6" ry="2.5" fill="none" stroke="#cfd8dc" strokeWidth="2" />
            <line x1="44" y1="20" x2="44" y2="35" stroke="#cfd8dc" strokeWidth="2.5" />
            <line x1="56" y1="20" x2="56" y2="35" stroke="#cfd8dc" strokeWidth="2.5" />
            {/* Spherical bottom container */}
            <circle cx="50" cy="55" r="22" fill="none" stroke="#cfd8dc" strokeWidth="2.5" />
            
            {/* Waving bubble potion layers */}
            <g clipPath="url(#potion-clip)">
              {/* Fluid base */}
              <rect x="25" y="45" width="50" height="35" fill="#ff1744" />
              {/* Waves and bubbles */}
              <path d="M 25,45 Q 37.5,41 50,45 Q 62.5,49 75,45 L 75,80 L 25,80 Z" fill="#ff5252" style={{ animation: 'slitherWave 2s linear infinite' }} />
              <circle cx="42" cy="55" r="2.5" fill="#ffffff" opacity="0.6" />
              <circle cx="58" cy="62" r="1.8" fill="#ffffff" opacity="0.5" />
              <circle cx="48" cy="68" r="3.2" fill="#ffffff" opacity="0.4" />
            </g>
            {/* Cork */}
            <polygon points="46,12 54,12 52,20 48,20" fill="#a1887f" />
          </g>
        );

      case 'potion-blue':
        return (
          <g>
            {/* Flask neck and glass rim */}
            <ellipse cx="50" cy="20" rx="6" ry="2.5" fill="none" stroke="#cfd8dc" strokeWidth="2" />
            <line x1="44" y1="20" x2="44" y2="35" stroke="#cfd8dc" strokeWidth="2.5" />
            <line x1="56" y1="20" x2="56" y2="35" stroke="#cfd8dc" strokeWidth="2.5" />
            {/* Spherical bottom container */}
            <circle cx="50" cy="55" r="22" fill="none" stroke="#cfd8dc" strokeWidth="2.5" />
            
            {/* Waving bubble potion layers */}
            <g clipPath="url(#potion-clip)">
              {/* Fluid base */}
              <rect x="25" y="45" width="50" height="35" fill="#2979ff" />
              {/* Waves and bubbles */}
              <path d="M 25,45 Q 37.5,41 50,45 Q 62.5,49 75,45 L 75,80 L 25,80 Z" fill="#448aff" style={{ animation: 'slitherWave 2s linear infinite' }} />
              <circle cx="40" cy="56" r="2.2" fill="#ffffff" opacity="0.6" />
              <circle cx="54" cy="64" r="3" fill="#ffffff" opacity="0.5" />
              <circle cx="46" cy="70" r="1.5" fill="#ffffff" opacity="0.4" />
            </g>
            {/* Cork */}
            <polygon points="46,12 54,12 52,20 48,20" fill="#a1887f" />
          </g>
        );

      case 'dragon-core':
        return (
          <g style={{ animation: 'rotateAura 8s linear infinite', transformOrigin: '50px 50px' }}>
            {/* Glowing crystal shard core */}
            <polygon points="50,15 68,40 50,85 32,40" fill="#ff3d00" stroke="#ffea00" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 10px #ff3d00)' }} />
            {/* Inner crystalline reflection */}
            <polygon points="50,22 60,40 50,75 40,40" fill="#ffd600" opacity="0.7" />
            <polygon points="50,22 53,40 50,75 47,40" fill="#ffffff" />
            {/* Orbital magical fragments */}
            <circle cx="24" cy="30" r="3.5" fill="#ff3d00" />
            <circle cx="76" cy="70" r="2.5" fill="#ffea00" />
            <circle cx="28" cy="65" r="3" fill="#ff3d00" />
            <circle cx="72" cy="25" r="4" fill="#ffd600" />
          </g>
        );

      case 'wolf-fang':
        return (
          <g>
            {/* White curved canine tooth fang */}
            <path d="M 38,30 C 44,45 62,65 65,76 C 58,74 46,55 38,45 Z" fill="#f5f5f5" stroke="#cfd8dc" strokeWidth="1" />
            {/* Bronze metadata clasp wrapper */}
            <rect x="32" y="22" width="16" height="10" rx="1.5" fill="#cd7f32" stroke="#8b4513" strokeWidth="1" />
            <circle cx="40" cy="27" r="2" fill="#ffd700" />
            {/* Leather pendant chord neck loop */}
            <path d="M 22,12 Q 40,24 58,12" fill="none" stroke="#3e2723" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      case 'gold':
        return (
          <g>
            {/* Stacked physical gold coin relief */}
            {/* Bottom coin */}
            <ellipse cx="42" cy="68" rx="16" ry="7" fill="#ffd700" stroke="#b78a00" strokeWidth="1" />
            <ellipse cx="42" cy="68" rx="11" ry="4.5" fill="#ffb300" />
            {/* Mid coin */}
            <ellipse cx="58" cy="62" rx="16" ry="7" fill="#ffd700" stroke="#b78a00" strokeWidth="1" />
            <ellipse cx="58" cy="62" rx="11" ry="4.5" fill="#ffb300" />
            {/* Top stack coin */}
            <ellipse cx="50" cy="48" rx="18" ry="8" fill="#ffea00" stroke="#b78a00" strokeWidth="1" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }} />
            <ellipse cx="50" cy="48" rx="13" ry="5.5" fill="#ffd700" />
            <circle cx="50" cy="48" r="3.5" fill="#ffea00" />
          </g>
        );

      case 'trophy':
        return (
          <g style={{ animation: 'levitateMage 4s ease-in-out infinite' }}>
            {/* Detailed Gold Cup Trophy */}
            {/* Top bowl rim */}
            <ellipse cx="50" cy="24" rx="20" ry="6" fill="#ffd700" stroke="#b78a00" strokeWidth="1.5" />
            {/* Base goblet body */}
            <path d="M 30,24 Q 30,62 50,62 Q 70,62 70,24 Z" fill="#ffea00" stroke="#b78a00" strokeWidth="1.5" />
            {/* Handles */}
            <path d="M 30,30 Q 15,38 30,48" fill="none" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" />
            <path d="M 70,30 Q 85,38 70,48" fill="none" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" />
            {/* Stem and block platform */}
            <line x1="50" y1="62" x2="50" y2="76" stroke="#b78a00" strokeWidth="6" />
            <rect x="36" y="76" width="28" height="10" rx="1" fill="#37474f" stroke="#212121" strokeWidth="1.5" />
            {/* Star badge detail */}
            <polygon points="50,32 53,38 60,39 55,44 56,51 50,47 44,51 45,44 40,39 47,38" fill="#00e5ff" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="visual-item-container flex-center"
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '12px',
        border: `2px solid ${activeRarity.border}`,
        background: `radial-gradient(circle at 50% 50%, rgba(30, 20, 52, 0.95), rgba(15, 10, 28, 0.98))`,
        boxShadow: `inset 0 0 12px ${activeRarity.glow}, 0 4px 15px rgba(0, 0, 0, 0.45)`,
        overflow: 'visible',
        cursor: 'pointer',
        animation: 'itemPulse 4s infinite ease-in-out'
      }}
    >
      {/* Dynamic continuous background rotating starfield / sparkle aura */}
      <div 
        style={{
          position: 'absolute',
          width: '120%',
          height: '120%',
          border: `1.5px dashed ${activeRarity.border}22`,
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'rotateAura 18s linear infinite'
        }}
      />

      {/* SVG Canvas */}
      <svg 
        viewBox="0 0 100 100" 
        style={{
          width: '85%',
          height: '85%',
          pointerEvents: 'none',
          filter: `drop-shadow(0 4px 10px ${activeRarity.border}55)`
        }}
      >
        <defs>
          {/* Flask clip path to lock liquid container inside round bulbous core */}
          <clipPath id="potion-clip">
            <circle cx="50" cy="55" r="21" />
          </clipPath>
        </defs>

        {renderItemSVG()}
      </svg>

      {/* Small subtle hover tool badge */}
      <div className="item-hover-glow-effect" />
    </div>
  );
};

export default ItemVisualizer;
