import { useCallback } from 'react';

/**
 * Custom hook to calculate the monster's dynamic AI behavior.
 * Gated by HP percentage (Normal, Enraged, Desperate).
 */
export const useMonsterAI = () => {
  const getMonsterAction = useCallback((monsterHp, maxHp, turnCount, questTitle) => {
    const hpPercent = monsterHp / maxHp;
    const isBoss = questTitle.includes('Dragon') || questTitle.includes('Artifact') || questTitle.includes('Arthur');
    
    // Low HP Enraged threshold
    if (hpPercent < 0.3) {
      // Ultimate attack every 2 turns
      if (turnCount % 2 === 0) {
        return {
          name: isBoss ? 'Abyssal Calamity' : 'Enraged Stomp',
          damageMultiplier: 2.2,
          animation: 'casting',
          effectType: 'fire',
          isEnragedAction: true,
          log: `The enraged monster unleashes a catastrophic attack!`
        };
      } else {
        return {
          name: 'Berserk Bite',
          damageMultiplier: 1.5,
          animation: 'dashing',
          effectType: 'slash',
          isEnragedAction: true,
          log: `The bloodshot-eyed beast lunges at you in a blind fury!`
        };
      }
    } 
    
    // Medium HP threshold (30% - 70%)
    if (hpPercent < 0.7) {
      const rand = Math.random();
      if (rand < 0.4) {
        return {
          name: 'Spike Sweep',
          damageMultiplier: 1.2,
          animation: 'dashing',
          effectType: 'slash',
          log: `The enemy spins rapidly, sweeping you with tail spikes!`
        };
      } else if (rand < 0.7) {
        return {
          name: 'Charged Focus',
          damageMultiplier: 0, // no damage, just charging up!
          animation: 'casting',
          effectType: 'heal', // visual glow aura
          isCharging: true,
          log: `The enemy draws surrounding mana, preparing a deadly charge!`
        };
      }
    }

    // High HP threshold (70%+)
    const rand = Math.random();
    if (rand < 0.3) {
      return {
        name: 'Claw Swipe',
        damageMultiplier: 1.0,
        animation: 'dashing',
        effectType: 'slash',
        log: `The monster swipes with massive claws!`
      };
    } else if (rand < 0.6) {
      return {
        name: 'Bite Strike',
        damageMultiplier: 1.1,
        animation: 'dashing',
        effectType: 'slash',
        log: `The monster snaps forward with razor-sharp fangs!`
      };
    } else {
      return {
        name: 'Dark Pulse',
        damageMultiplier: 0.9,
        animation: 'casting',
        effectType: 'impact',
        log: `The monster emits a dark magical shockwave!`
      };
    }
  }, []);

  return { getMonsterAction };
};
