import React from 'react';

/**
 * Combatant Stats HUD component.
 * Displays details such as active health bar fills, numeric HP levels,
 * level and class identifiers, and color-shifting alerts depending on current HP.
 */
const BattleHUD = ({ 
  username, 
  playerClass, 
  level, 
  playerHp, 
  playerMaxHp, 
  monsterTitle, 
  monsterHp, 
  monsterMaxHp,
  isIntroComplete
}) => {
  const playerHpPercent = Math.max(0, Math.min(100, (playerHp / playerMaxHp) * 100));
  const enemyHpPercent = Math.max(0, Math.min(100, (monsterHp / monsterMaxHp) * 100));

  // Determine health bar color status tags
  const getHpStatusClass = (percent) => {
    if (percent > 50) return 'hp-green';
    if (percent > 25) return 'hp-yellow';
    return 'hp-red'; // Crimson red + vibrating alert
  };

  return (
    <div className={`hud-panel ${!isIntroComplete ? 'intro-sliding' : ''}`}>
      {/* Player Stats card */}
      <div className="combatant-hud player-hud">
        <div className="flex-between">
          <h3 className="gold-text">{username || 'Hunter'}</h3>
          <span className="text-muted text-xs">Level {level} {playerClass}</span>
        </div>
        <div className="flex-between text-muted text-sm mt-1">
          <span>HP</span>
          <span>{playerHp} / {playerMaxHp}</span>
        </div>
        <div className="hp-bar-container">
          <div 
            className={`hp-fill ${getHpStatusClass(playerHpPercent)}`}
            style={{ width: `${playerHpPercent}%` }}
          />
        </div>
      </div>

      {/* Monster Stats card */}
      <div className="combatant-hud enemy-hud text-right">
        <div className="flex-between" style={{ flexDirection: 'row-reverse' }}>
          <h3 className="text-danger">{monsterTitle}</h3>
          <span className="text-muted text-xs">Boss Enemy</span>
        </div>
        <div className="flex-between text-muted text-sm mt-1" style={{ flexDirection: 'row-reverse' }}>
          <span>HP</span>
          <span>{monsterHp} / {monsterMaxHp}</span>
        </div>
        <div className="hp-bar-container" style={{ transform: 'scaleX(-1)' }}>
          <div 
            className={`hp-fill ${getHpStatusClass(enemyHpPercent)}`}
            style={{ width: `${enemyHpPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BattleHUD;
