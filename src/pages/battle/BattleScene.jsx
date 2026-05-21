import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Loader2, Sparkles } from 'lucide-react';
import BattleHUD from './BattleHUD';
import LivingHunter from './LivingHunter';
import LivingMonster from './LivingMonster';
import DamageNumber from './DamageNumber';
import ParticleSystem from './ParticleSystem';
import BattleControls from './BattleControls';
import { useMonsterAI } from './useMonsterAI';
import ItemVisualizer from '../../components/ItemVisualizer';
import { API_URL } from '../../config';

/**
 * Main state machine orchestrating combat logic, phase progression,
 * animations triggers, particles overlay, and secure backend reward claims.
 */
const BattleScene = ({ user, updateUser, quest, isIntroComplete, onBattleBegin }) => {
  const navigate = useNavigate();
  const { getMonsterAction } = useMonsterAI();

  // Character status thresholds
  const playerMaxHp = (user?.level || 1) * 100 + 400;
  
  const getEnemyStats = (rank) => {
    switch (rank) {
      case 'S': return { hp: 5000, dmg: 400 };
      case 'A': return { hp: 2500, dmg: 250 };
      case 'B': return { hp: 1200, dmg: 120 };
      case 'C': return { hp: 600, dmg: 60 };
      default: return { hp: 300, dmg: 30 };
    }
  };

  const enemyStats = getEnemyStats(quest.rank);

  // Core Combat States
  const [playerHp, setPlayerHp] = useState(playerMaxHp);
  const [monsterHp, setMonsterHp] = useState(enemyStats.hp);
  
  const [playerAnim, setPlayerAnim] = useState('idle');
  const [monsterAnim, setMonsterAnim] = useState('idle');

  const [cooldowns, setCooldowns] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });
  const [turnCount, setTurnCount] = useState(1);
  const [logs, setLogs] = useState([`Encountered ${quest.title}! Ready your weapons.`]);
  const [phase, setPhase] = useState('INTRO'); // INTRO | PLAYER_TURN | MONSTER_TURN | RESOLVING | VICTORY | DEFEAT

  // Buff & Defense states
  const [evadingState, setEvadingState] = useState(false);
  const [shieldActive, setShieldActive] = useState(false); // Mage ward
  const [ironWallTurns, setIronWallTurns] = useState(0);    // Saber defensive buff

  // Arrays managing active DOM overlays
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [particles, setParticles] = useState([]);
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [activeProjectile, setActiveProjectile] = useState(null);
  const [activeAttackIndex, setActiveAttackIndex] = useState(1);

  // Ref locks to avoid multi-clicks
  const dmgIdRef = useRef(0);
  const partIdRef = useRef(0);

  // Trigger intro end
  useEffect(() => {
    if (isIntroComplete && phase === 'INTRO') {
      setPhase('PLAYER_TURN');
      if (onBattleBegin) onBattleBegin();
    }
  }, [isIntroComplete, phase, onBattleBegin]);

  // Logging utility
  const addLog = (msg, type = 'system') => {
    setLogs((prev) => [{ msg, type }, ...prev]);
  };

  // Trigger floating combat texts
  const triggerDamageBadge = (val, x, y, type = 'damage') => {
    const id = dmgIdRef.current++;
    setDamageNumbers((prev) => [...prev, { id, value: val, x, y, type }]);
    setTimeout(() => {
      setDamageNumbers((prev) => prev.filter((d) => d.id !== id));
    }, 900);
  };

  // Trigger visual spell/hit particles
  const triggerParticlesBurst = (type, x, y, angle = null) => {
    const id = partIdRef.current++;
    setParticles((prev) => [...prev, { id, type, x, y, angle }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 800);
  };

  // Execute screen impact shake
  const triggerImpactVibration = () => {
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 400);
  };

  // Player attack damage scale
  const baseAttackDmg = (user?.level || 1) * 30 + 100;
  const standardHealAmt = (user?.level || 1) * 50 + 150;

  // --- PLAYER SKILL EXECUTION ---
  const handlePlayerSkill = (skill) => {
    if (phase !== 'PLAYER_TURN' || playerHp <= 0 || monsterHp <= 0) return;
    setPhase('RESOLVING');

    // Determine animation category (melee lunge vs magic charge)
    const isMelee = skill.name === 'Slash' || skill.name === 'Heavy Strike' || skill.name === 'Quick Stab' || skill.name === 'Assassinate';
    setPlayerAnim(isMelee ? 'attacking' : 'casting');

    let pIndex = 1;
    if (skill.name.includes('Heavy') || skill.name.includes('Aimed') || skill.name.includes('Poison') || skill.name.includes('Wall')) {
      pIndex = 2;
    } else if (skill.isUltimate || skill.name.includes('Storm') || skill.name.includes('Meteor') || skill.name.includes('Shield')) {
      pIndex = 3;
    }
    setActiveAttackIndex(pIndex);

    addLog(`You execute ${skill.name}!`, 'player');

    // 1. First stage: Spellcasting/Swing build up
    setTimeout(() => {
      let finalDamage = 0;
      let particleType = 'impact';
      let angle = null;
      let hitSelf = false;
      let isCrit = Math.random() < 0.2 || skill.isUltimate; // critical hits

      // Execute skill mechanics
      switch (skill.name) {
        case 'Slash':
        case 'Quick Stab':
        case 'Swift Shot':
          finalDamage = Math.floor(baseAttackDmg * (0.85 + Math.random() * 0.3));
          particleType = 'slash';
          angle = 45;
          break;

        case 'Heavy Strike':
        case 'Aimed Shot':
          finalDamage = Math.floor(baseAttackDmg * 1.65 * (0.8 + Math.random() * 0.4));
          particleType = 'slash';
          angle = -45;
          break;

        case 'Iron Wall':
          setIronWallTurns(3); // Blocks 80% incoming damage for 3 turns
          hitSelf = true;
          particleType = 'heal'; // green shield aura
          addLog(`You raise an impregnable steel shield! Defensive block active.`, 'system');
          break;

        case 'Blade Storm':
          finalDamage = Math.floor(baseAttackDmg * 2.3);
          particleType = 'impact'; // golden ultimate burst
          triggerImpactVibration();
          break;

        case 'Arcane Bolt':
          finalDamage = Math.floor(baseAttackDmg * 0.95);
          particleType = 'impact';
          break;

        case 'Fireball':
          finalDamage = Math.floor(baseAttackDmg * 1.85);
          particleType = 'fire';
          break;

        case 'Mana Shield':
          setShieldActive(true); // Blocks next standard attack completely
          hitSelf = true;
          particleType = 'heal';
          addLog(`An invisible mana barrier forms around you!`, 'system');
          break;

        case 'Meteor Shower':
          finalDamage = Math.floor(baseAttackDmg * 2.5);
          particleType = 'fire';
          triggerImpactVibration();
          break;

        case 'Shadow Step':
          finalDamage = Math.floor(baseAttackDmg * 0.7);
          setEvadingState(true); // 100% evasion for next turn
          particleType = 'slash';
          angle = 90;
          addLog(`You slip into the shadows, preparing to evade!`, 'system');
          break;

        case 'Poison Dart':
          finalDamage = Math.floor(baseAttackDmg * 1.1);
          particleType = 'impact';
          addLog(`Toxin applied! The monster is poisoned.`, 'system');
          break;

        case 'Assassinate':
          finalDamage = Math.floor(baseAttackDmg * 2.6);
          particleType = 'slash';
          angle = 0;
          triggerImpactVibration();
          break;

        case 'Healing Herbs':
          const realHeal = Math.min(playerMaxHp - playerHp, standardHealAmt);
          setPlayerHp(prev => prev + realHeal);
          hitSelf = true;
          particleType = 'heal';
          triggerDamageBadge(realHeal, 20, 45, 'heal');
          addLog(`You consume restorative herbs, recovering ${realHeal} HP.`, 'player');
          break;

        default:
          finalDamage = Math.floor(baseAttackDmg);
      }

      // Track Skill Cooldowns
      if (skill.cooldown > 0) {
        setCooldowns((prev) => ({ ...prev, [skill.id]: skill.cooldown }));
      }

      // Render attack outputs on targets
      const isRanged = skill.name === 'Arcane Bolt' || skill.name === 'Fireball' || skill.name === 'Meteor Shower' || skill.name === 'Swift Shot' || skill.name === 'Aimed Shot';

      const resolveImpact = () => {
        const nextMonsterHp = Math.max(0, monsterHp - finalDamage);
        setMonsterHp(nextMonsterHp);
        
        // Spawn sparks and flashes
        triggerParticlesBurst(particleType, 75, 45, angle);
        setMonsterAnim(isCrit ? 'critical-hit' : 'hit');
        triggerDamageBadge(finalDamage, 75, 30, isCrit ? 'critical' : 'damage');

        addLog(`You hit ${quest.title} for ${finalDamage} damage!`, 'player');

        if (nextMonsterHp <= 0) {
          // MONSTER DEFEATED
          setTimeout(() => {
            setMonsterAnim('dead');
            setPlayerAnim('victory');
            setPhase('RESOLVING');
            addLog('Victory! The beast has collapsed.', 'system');

            // Wait 1.4s for death fading animation to complete
            setTimeout(() => {
              setPhase('VICTORY');
            }, 1400);
          }, 400);
        } else {
          // Reset character state templates back to idle
          setTimeout(() => {
            setPlayerAnim('idle');
            setMonsterAnim('idle');

            // Transition turn phase
            setTimeout(() => {
              setPhase('MONSTER_TURN');
              executeEnemyTurn();
            }, 300);

          }, 400);
        }
      };

      if (hitSelf) {
        triggerParticlesBurst(particleType, 25, 60);
        setTimeout(() => {
          setPlayerAnim('idle');
          setMonsterAnim('idle');

          setTimeout(() => {
            setPhase('MONSTER_TURN');
            executeEnemyTurn();
          }, 300);

        }, 400);
      } else if (isRanged) {
        // Trigger traveling projectile visually
        const projType = skill.name.includes('Shot') ? 'arrow' : (skill.name.includes('Fireball') || skill.name.includes('Meteor')) ? 'fire' : 'ice';
        setActiveProjectile({ type: projType });
        
        setTimeout(() => {
          setActiveProjectile(null);
          resolveImpact();
        }, 550); // matches projTravel transition speed
      } else {
        // Melee lunge physical dash peaks at 350ms
        setTimeout(() => {
          resolveImpact();
        }, 350);
      }

    }, 300);
  };

  // --- MONSTER TURN EXECUTION ---
  const executeEnemyTurn = () => {
    // Timeout to simulate boss thinking delay
    setTimeout(() => {
      if (playerHp <= 0 || monsterHp <= 0) return;

      // Decrement player buff counts
      let blockDefenseActive = false;
      if (ironWallTurns > 0) {
        setIronWallTurns(prev => prev - 1);
        blockDefenseActive = true;
      }

      // Execute AI
      const action = getMonsterAction(monsterHp, enemyStats.hp, turnCount, quest.title);
      setMonsterAnim(action.animation);

      let mIndex = 1;
      if (action.damageMultiplier > 1.0 && action.damageMultiplier < 2.0) {
        mIndex = 2;
      } else if (action.damageMultiplier >= 2.0) {
        mIndex = 3;
      }
      setActiveAttackIndex(mIndex);

      addLog(`${quest.title} prepares ${action.name}!`, 'enemy');

      const resolveEnemyImpact = () => {
        // Evaluate Evade/Dodge buffs
        if (evadingState) {
          triggerDamageBadge(0, 25, 45, 'dodge');
          addLog(`The monster strikes, but you evade it from the shadows!`, 'system');
          setEvadingState(false);
        } else if (shieldActive) {
          triggerParticlesBurst('heal', 25, 60); // barrier impact
          addLog(`Your magical Mana Shield absorbs the impact completely!`, 'system');
          setShieldActive(false);
        } else {
          // Calculate ultimate damage
          let enemyDamage = Math.floor(enemyStats.dmg * action.damageMultiplier * (0.8 + Math.random() * 0.4));
          
          if (blockDefenseActive) {
            enemyDamage = Math.floor(enemyDamage * 0.2); // 80% block mitigation
            addLog(`Your heavy shield blocks most of the impact! Damage mitigated.`, 'system');
          }

          const nextPlayerHp = Math.max(0, playerHp - enemyDamage);
          setPlayerHp(nextPlayerHp);

          setPlayerAnim('hit');
          triggerImpactVibration();
          triggerParticlesBurst(action.effectType, 25, 60);
          triggerDamageBadge(enemyDamage, 25, 40, 'damage');

          addLog(`${quest.title} strikes you with ${action.name} for ${enemyDamage} damage!`, 'enemy');

          if (nextPlayerHp <= 0) {
            // PLAYER DEFEATED
            setTimeout(() => {
              setPlayerAnim('dead');
              setPhase('RESOLVING');
              addLog('You have collapsed from your wounds...', 'system');
              
              setTimeout(() => {
                setPhase('DEFEAT');
              }, 1400);
            }, 400);
            return;
          }
        }

        // Recovery phase reset
        setTimeout(() => {
          setPlayerAnim('idle');
          setMonsterAnim('idle');

          // Decrement all active player skill cooldowns
          setCooldowns((prev) => {
            const nextCD = { ...prev };
            Object.keys(nextCD).forEach((k) => {
              if (nextCD[k] > 0) nextCD[k] -= 1;
            });
            return nextCD;
          });

          // Hand turn back to player
          setTurnCount((prev) => prev + 1);
          setPhase('PLAYER_TURN');

        }, 400);
      };

      const isEnemyRanged = action.animation === 'casting' || quest.title.toLowerCase().includes('spider') || quest.title.toLowerCase().includes('serpent');

      if (isEnemyRanged) {
        setActiveProjectile({ type: 'enemy' });
        setTimeout(() => {
          setActiveProjectile(null);
          resolveEnemyImpact();
        }, 600);
      } else {
        // Melee lunge peaks at 350ms
        setTimeout(() => {
          resolveEnemyImpact();
        }, 350);
      }

    }, 900);
  };

  // Securely Claim Rewards from Express Endpoint
  const handleClaimRewards = async () => {
    setIsClaiming(true);
    try {
      const token = localStorage.getItem('hunterToken');
      const res = await fetch(`${API_URL}/api/quests/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ questId: quest.id })
      });

      if (res.ok) {
        const data = await res.json();
        if (updateUser) updateUser(data.user);
        navigate('/dashboard');
      } else {
        setIsClaiming(false);
      }
    } catch (err) {
      console.error('Failed to securely process rewards:', err);
      setIsClaiming(false);
    }
  };

  return (
    <div className={`battle-container ${isScreenShaking ? 'screen-shake' : ''}`}>
      {/* 1. Dynamic Combatant HUD */}
      <BattleHUD
        username={user?.username}
        playerClass={user?.class}
        level={user?.level}
        playerHp={playerHp}
        playerMaxHp={playerMaxHp}
        monsterTitle={quest.title}
        monsterHp={monsterHp}
        monsterMaxHp={enemyStats.hp}
        isIntroComplete={isIntroComplete}
      />

      {/* 2. Visual Combat Arena */}
      <div className={`battle-arena ${!isIntroComplete ? 'intro-sliding' : ''}`}>
        {/* 3D perspective neon grid floor */}
        <div className="battle-floor" />

        {/* Real-time traveling vector projectiles */}
        {activeProjectile && (
          <div className={`vector-projectile proj-${activeProjectile.type}`} />
        )}

        {/* Procedural Living Hunter Model */}
        <LivingHunter
          playerClass={user?.class || 'Saber'}
          animState={playerAnim}
          attackIndex={activeAttackIndex}
          rank={user?.rank || 'D'}
          isLowHp={playerHp / playerMaxHp < 0.25}
        />

        {/* Procedural Living Monster Model */}
        <LivingMonster
          questTitle={quest.title}
          animState={monsterAnim}
          attackIndex={activeAttackIndex}
          isLowHp={monsterHp / enemyStats.hp < 0.25}
        />

        {/* Floating Numbers overlay portals */}
        <DamageNumber activeNumbers={damageNumbers} />

        {/* Spell visual particle overlays */}
        <ParticleSystem activeParticles={particles} />
      </div>

      {/* 3. Bottom controls and scrolling log panel */}
      <div className={`battle-bottom ${!isIntroComplete ? 'intro-sliding' : ''}`}>
        {/* Interactive combat records */}
        <div className="combat-log">
          {logs.map((log, i) => (
            <div key={i} className={`log-entry log-${log.type}`}>
              {log.msg}
            </div>
          ))}
        </div>

        {/* Player dynamic active skill set */}
        <BattleControls
          playerClass={user?.class || 'Saber'}
          cooldowns={cooldowns}
          disabled={phase !== 'PLAYER_TURN'}
          onSkillTrigger={handlePlayerSkill}
        />
      </div>

      {/* 4. Full screen overlays (Victory / Defeat covers) */}
      {phase === 'VICTORY' && (() => {
        const qRank = (quest.rank || 'D').toUpperCase();
        const title = (quest.title || '').toLowerCase();
        
        let lootItem = { name: 'Mana Potion', rarity: 'rare' };
        if (title.includes('dragon') || title.includes('drake') || qRank === 'S') {
          lootItem = { name: 'Dragon Core', rarity: 'legendary' };
        } else if (title.includes('wolf') || title.includes('fang') || qRank === 'D') {
          lootItem = { name: 'Wolf Fang', rarity: 'common' };
        } else if (title.includes('artifact') || qRank === 'A') {
          lootItem = { name: 'Dragon Core', rarity: 'epic' }; // crystal core
        } else if (title.includes('goblin') || qRank === 'C') {
          lootItem = { name: 'Health Potion', rarity: 'uncommon' };
        }

        return (
          <div className="victory-overlay">
            <h2 className="gold-text animate-pulse">Quest Cleared!</h2>
            <div className="claim-reward-hud" style={{ width: 'auto', maxWidth: '480px', padding: '20px var(--spacing-lg)' }}>
              <p className="text-muted text-center text-xs mb-4">Rewards & Loot Recovered:</p>
              <div className="rewards-grid-visuals" style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
                
                <div className="reward-token-card gold-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '95px' }}>
                  <ItemVisualizer itemName="gold" rarity={qRank === 'S' ? 'legendary' : qRank === 'A' ? 'epic' : qRank === 'B' ? 'rare' : 'common'} size={65} />
                  <span className="text-muted text-xxs tracking-wide">Gold</span>
                  <span className="gold-text font-bold text-sm">+{quest.reward_gold || quest.reward || 2000}</span>
                </div>
                
                <div className="reward-token-card item-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '95px', borderColor: 'var(--border-purple)' }}>
                  <ItemVisualizer itemName={lootItem.name} rarity={lootItem.rarity} size={65} />
                  <span className="text-muted text-xxs tracking-wide">{lootItem.name}</span>
                  <span className="font-bold text-sm text-success">x1 Drop</span>
                </div>

                <div className="reward-token-card exp-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '95px' }}>
                  <ItemVisualizer itemName="potion-blue" rarity="rare" size={65} />
                  <span className="text-muted text-xxs tracking-wide">EXP</span>
                  <span className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>+{quest.reward_exp || 500}</span>
                </div>
                
              </div>
            </div>
            <button 
              className="btn-primary" 
              onClick={handleClaimRewards}
              disabled={isClaiming}
              style={{ padding: '12px 36px', fontSize: '15px' }}
            >
              {isClaiming ? (
                <span className="flex-center">
                  <Loader2 className="animate-spin mr-2" size={16} /> Returning...
                </span>
              ) : 'Claim & Return to Academy'}
            </button>
          </div>
        );
      })()}

      {phase === 'DEFEAT' && (
        <div className="victory-overlay">
          <h2 className="text-danger" style={{ fontSize: '48px', textShadow: '0 0 25px rgba(255, 0, 0, 0.6)' }}>
            Defeated
          </h2>
          <p className="text-muted mb-4 text-center max-w-[280px]">
            You have suffered heavy injuries. Retreat to the Academy to recover your strengths.
          </p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/quests')}
            style={{ background: 'linear-gradient(135deg, #7a3bd6, #4a1b96)', color: 'white', border: '1px solid var(--border-purple)', padding: '12px 36px' }}
          >
            Retreat to Guild
          </button>
        </div>
      )}
    </div>
  );
};

export default BattleScene;
