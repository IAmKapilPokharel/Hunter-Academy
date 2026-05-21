import React from 'react';
import { 
  Sword, 
  ShieldAlert, 
  Swords, 
  Flame, 
  Zap, 
  Sparkles, 
  Shield, 
  Skull, 
  Crosshair, 
  Heart, 
  Wind,
  Plus
} from 'lucide-react';

/**
 * Combat Controls layout.
 * Populates 4 class-specific skill cards equipped with circular SVG progress trackers.
 * Includes a disabled visual placeholder for consumable items (potions) to be activated in Phase B.
 */
const BattleControls = ({ playerClass, cooldowns, disabled, onSkillTrigger }) => {
  // Class Skills database
  const skillsConfig = {
    Saber: [
      { id: 0, name: 'Slash', cooldown: 0, icon: Sword, desc: 'Quick physical sweep', color: '#00b8ff' },
      { id: 1, name: 'Heavy Strike', cooldown: 2, icon: Swords, desc: 'High physical hit', color: '#7a3bd6' },
      { id: 2, name: 'Iron Wall', cooldown: 3, icon: ShieldAlert, desc: 'Bolster block shield', color: '#ffd54f' },
      { id: 3, name: 'Blade Storm', cooldown: 4, icon: Sparkles, desc: 'Ultimate sword storm', color: '#ff3c3c', isUltimate: true }
    ],
    Mage: [
      { id: 0, name: 'Arcane Bolt', cooldown: 0, icon: Zap, desc: 'Basic raw magic bolt', color: '#00b8ff' },
      { id: 1, name: 'Fireball', cooldown: 3, icon: Flame, desc: 'Heavy combustion flash', color: '#ff5722' },
      { id: 2, name: 'Mana Shield', cooldown: 2, icon: Shield, desc: 'Arcane defense ward', color: '#2eff8b' },
      { id: 3, name: 'Meteor Shower', cooldown: 5, icon: Sparkles, desc: 'Ultimate cosmic collapse', color: '#ffd54f', isUltimate: true }
    ],
    Assassin: [
      { id: 0, name: 'Quick Stab', cooldown: 0, icon: Sword, desc: 'Fast dagger swipe', color: '#00b8ff' },
      { id: 1, name: 'Shadow Step', cooldown: 3, icon: Wind, desc: 'Dodge next active strike', color: '#7a3bd6' },
      { id: 2, name: 'Poison Dart', cooldown: 2, icon: Skull, desc: 'Afflict poison toxin', color: '#2eff8b' },
      { id: 3, name: 'Assassinate', cooldown: 4, icon: Swords, desc: 'Lethal ultimate finish', color: '#ff3c3c', isUltimate: true }
    ],
    Ranger: [
      { id: 0, name: 'Swift Shot', cooldown: 0, icon: Crosshair, desc: 'Standard arrow strike', color: '#00b8ff' },
      { id: 1, name: 'Aimed Shot', cooldown: 2, icon: Crosshair, desc: 'High precision crit hit', color: '#7a3bd6' },
      { id: 2, name: 'Healing Herbs', cooldown: 3, icon: Heart, desc: 'Apply healing compress', color: '#2eff8b' },
      { id: 3, name: 'Rain of Arrows', cooldown: 4, icon: Wind, desc: 'Ultimate volley barrage', color: '#ffd54f', isUltimate: true }
    ]
  };

  const activeClassSkills = skillsConfig[playerClass] || skillsConfig.Saber;

  return (
    <div className="battle-controls-grid">
      {activeClassSkills.map((skill) => {
        const activeCooldown = cooldowns[skill.id] || 0;
        const isOnCooldown = activeCooldown > 0;
        const isBtnDisabled = disabled || isOnCooldown;
        const IconComponent = skill.icon;
        
        // Circular progress SVG values
        const radius = 15;
        const circumference = 2 * Math.PI * radius;
        const offset = isOnCooldown 
          ? circumference - (activeCooldown / skill.cooldown) * circumference 
          : 0;

        return (
          <button
            key={skill.id}
            className={`action-btn-styled ${skill.isUltimate ? 'btn-ultimate-glowing' : ''}`}
            disabled={isBtnDisabled}
            onClick={() => onSkillTrigger(skill)}
            title={skill.desc}
          >
            {/* SVG Cooldown Progress Overlay */}
            {isOnCooldown && (
              <div className="cooldown-ring-overlay">
                <svg className="cooldown-svg">
                  <circle className="cooldown-circle-bg" cx="18" cy="18" r={radius} />
                  <circle 
                    className="cooldown-circle-progress" 
                    cx="18" 
                    cy="18" 
                    r={radius} 
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                  />
                </svg>
                <span className="cooldown-count-label">{activeCooldown}</span>
              </div>
            )}

            {/* Visual Skill Icon wrapper */}
            <div className="skill-icon-wrap" style={{ color: skill.color }}>
              {typeof IconComponent === 'function' && !IconComponent.prototype?.render ? (
                <IconComponent size={20} />
              ) : (
                <IconComponent size={20} />
              )}
            </div>

            {/* Label texts */}
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold tracking-wide" style={{ color: skill.isUltimate ? '#ffd54f' : 'inherit' }}>
                {skill.name}
              </span>
              <span className="text-xxs text-muted font-normal lowercase tracking-tight block max-w-[120px] truncate">
                {skill.desc}
              </span>
            </div>
          </button>
        );
      })}

      {/* Visual disabled placeholder for inventory items to be activated in Phase B */}
      <button 
        className="action-btn-styled" 
        disabled={true}
        style={{ 
          gridColumn: 'span 2', 
          justifyContent: 'center', 
          background: 'rgba(255, 255, 255, 0.02)',
          borderStyle: 'dashed',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          opacity: 0.5
        }}
        title="Items slot locked until inventory is unlocked!"
      >
        <Plus size={16} className="text-muted" />
        <span className="text-muted tracking-wide text-xs">Inventory Potions (Shop Locked)</span>
      </button>
    </div>
  );
};

export default BattleControls;
