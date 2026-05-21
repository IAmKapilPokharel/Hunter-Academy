import React from 'react';
import { Lock } from 'lucide-react';
import ItemVisualizer from './ItemVisualizer';
import './AchievementCard.css';

const AchievementCard = ({ achievement }) => {
  const getVisualItemName = (iconType) => {
    switch (iconType) {
      case 'dragon': return 'dragon core';
      case 'stealth': return 'shadow dagger';
      case 'guild': return 'guild trophy';
      case 'abyss': return 'abyssal crystal';
      case 'craft': return 'forged sword';
      case 'arena': return 'arena trophy';
      case 'book': return 'lore crystal';
      case 'titan': return 'titan wolf fang';
      default: return 'trophy';
    }
  };

  return (
    <div className={`achievement-card glass-panel ${achievement.unlocked ? 'unlocked gold-border' : 'locked'}`}>
      <div className="achievement-icon" style={{ display: 'flex', justifyContent: 'center', position: 'relative', width: '70px', height: '70px', margin: '0 auto 12px' }}>
        <ItemVisualizer 
          itemName={getVisualItemName(achievement.icon)} 
          rarity={achievement.unlocked ? "legendary" : "common"} 
          size={70} 
        />
        {!achievement.unlocked && (
          <div className="lock-overlay" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(9, 5, 16, 0.4)', borderRadius: '12px', pointerEvents: 'none' }}>
            <Lock size={20} className="text-muted" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
          </div>
        )}
      </div>
      <div className="achievement-info text-center mt-2">
        <h3 className={achievement.unlocked ? 'gold-text font-bold' : 'text-muted'}>{achievement.title}</h3>
        <p className="text-muted mt-2" style={{ fontSize: '13px', lineHeight: '1.4' }}>{achievement.description}</p>
        
        {achievement.unlocked ? (
          <div className="unlock-date mt-4" style={{ fontSize: '11px', color: 'var(--text-success)' }}>Unlocked: {achievement.date}</div>
        ) : (
          <div className="progress-bar-container mt-4">
            <div className="progress-info flex-between" style={{ fontSize: '12px' }}>
               <span>Progress</span>
               <span>{achievement.progress} / {achievement.total}</span>
            </div>
            <div className="progress-bar" style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', marginTop: '4px' }}>
               <div className="progress-fill" style={{ width: `${(achievement.progress / achievement.total) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #7a3bd6, #00b0ff)', borderRadius: '3px' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;
