import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Shield, Sword, Heart, Zap, Crosshair, Award, CheckCircle2, XCircle, Sparkles, HelpCircle, Loader2 } from 'lucide-react';
import ItemVisualizer from '../components/ItemVisualizer';
import { API_URL } from '../config';
import './Profile.css';

const Profile = ({ user: propUser }) => {
  const { user: contextUser, updateUser } = useOutletContext() || {};
  const user = contextUser || propUser;

  // Promotion States
  const [isPromoting, setIsPromoting] = useState(false);
  const [showPromoAura, setShowPromoAura] = useState(false);
  const [promoError, setPromoError] = useState('');

  const currentRank = user?.rank || 'D';
  const rankOrder = ['D', 'C', 'B', 'A', 'S', 'SS'];
  const currentIndex = rankOrder.indexOf(currentRank);
  const nextRank = currentIndex !== -1 && currentIndex < rankOrder.length - 1 ? rankOrder[currentIndex + 1] : null;

  // Rank promotion requirements definition
  const rankRequirements = {
    C: { level: 5, gold: 2000, quests: 2 },
    B: { level: 10, gold: 5000, quests: 5 },
    A: { level: 15, gold: 12000, quests: 10 },
    S: { level: 25, gold: 25000, quests: 20 },
    SS: { level: 40, gold: 60000, quests: 40 }
  };

  const reqs = nextRank ? rankRequirements[nextRank] : null;

  const requirementsMet = useMemo(() => {
    if (!reqs || !user) return false;
    return (
      user.level >= reqs.level &&
      user.gold >= reqs.gold &&
      (user.quests_completed || 0) >= reqs.quests
    );
  }, [reqs, user]);

  // Dynamic Gear generator based on class and rank
  const equippedGear = useMemo(() => {
    if (!user) return [];
    
    const pClass = user.class || 'Saber';
    const rank = user.rank || 'D';
    const isHighRank = ['S', 'SS'].includes(rank);
    const isMidRank = ['B', 'A'].includes(rank);
    const rarity = isHighRank ? 'legendary' : isMidRank ? 'epic' : 'rare';

    const gearSet = {
      Saber: {
        helmet: { name: isHighRank ? 'Vanguard Heavy Visor' : isMidRank ? 'Steel Visor Greathelm' : 'Recruit Helmet', slot: 'helmet' },
        weapon: { name: isHighRank ? 'Dragon Slayer Greatsword' : isMidRank ? 'Vanguard Steel Sword' : 'Iron Broadsword', slot: 'weapon' },
        armor: { name: isHighRank ? 'Iron Vanguard Breastplate' : isMidRank ? 'Knight Plate Tunic' : 'Iron Breastplate', slot: 'armor' },
        boots: { name: isHighRank ? 'Vanguard Armored Sabatons' : isMidRank ? 'Armored Sabatons' : 'Iron Greaves', slot: 'boots' }
      },
      Mage: {
        helmet: { name: isHighRank ? 'Archmage Sage Hood' : isMidRank ? 'Acolyte Magic Cowl' : 'Simple Cloth Hood', slot: 'helmet' },
        weapon: { name: isHighRank ? 'Archmage Sage Staff' : isMidRank ? 'Leyline Focus Staff' : 'Apprentice Wand', slot: 'weapon' },
        armor: { name: isHighRank ? 'Archmage Elder Robe' : isMidRank ? 'Leyline Magic Robes' : 'Apprentice Robe', slot: 'armor' },
        boots: { name: isHighRank ? 'Leyline Sage Slippers' : isMidRank ? 'Leyline Focus Shoes' : 'Cloth Slippers', slot: 'boots' }
      },
      Ranger: {
        helmet: { name: isHighRank ? 'Deadeye Goggles' : isMidRank ? 'Scout Goggles' : 'Leather Eyepatch', slot: 'helmet' },
        weapon: { name: isHighRank ? 'Galeforce Bow of Storms' : isMidRank ? 'Windrunner Longbow' : 'Recurve Bow', slot: 'weapon' },
        armor: { name: isHighRank ? 'Windrunner Cloaked Vest' : isMidRank ? 'Windrunner Vest' : 'Camo Tunic', slot: 'armor' },
        boots: { name: isHighRank ? 'Windstrider Ranger Boots' : isMidRank ? 'Windstrider Boots' : 'Leather Boots', slot: 'boots' }
      },
      Assassin: {
        helmet: { name: isHighRank ? 'Nightfall Assassin Cowl' : isMidRank ? 'Shadow Thief Mask' : 'Cloth Face Veil', slot: 'helmet' },
        weapon: { name: isHighRank ? 'Abyssal Dagger of Agony' : isMidRank ? 'Poisoned Shadow Dirk' : 'Rusty Dagger', slot: 'weapon' },
        armor: { name: isHighRank ? 'Abyssal Nightfall Plate' : isMidRank ? 'Nightfall Tunic' : 'Stealth Vest', slot: 'armor' },
        boots: { name: isHighRank ? 'Silent Abyssal Steps' : isMidRank ? 'Silent Steps' : 'Silent Socks', slot: 'boots' }
      }
    };

    const currentSet = gearSet[pClass] || gearSet.Saber;

    return [
      { key: 'helmet', title: 'Helmet', name: currentSet.helmet.name, slot: 'helmet', rarity },
      { key: 'weapon', title: 'Weapon', name: currentSet.weapon.name, slot: 'weapon', rarity },
      { key: 'armor', title: 'Armor', name: currentSet.armor.name, slot: 'armor', rarity },
      { key: 'boots', title: 'Boots', name: currentSet.boots.name, slot: 'boots', rarity }
    ];
  }, [user]);

  // Core progression variables
  const expNeeded = (user?.level || 1) * 1000;
  const expPercent = Math.min(100, Math.floor(((user?.exp || 0) / expNeeded) * 100));

  const stats = useMemo(() => {
    if (!user) return [];
    const level = user.level || 1;
    return [
      { name: 'Vitality', icon: Heart, value: level * 100 + 400, max: 6000, colorClass: 'text-danger', color1: '#ff1744', color2: '#ff5252' },
      { name: 'Mana', icon: Zap, value: level * 60 + 200, max: 4000, colorClass: 'text-success', color1: '#9b51e0', color2: '#e040fb' },
      { name: 'Strength', icon: Sword, value: level * 30 + 100, max: 2500, colorClass: 'text-primary', color1: '#00b0ff', color2: '#2979ff' },
      { name: 'Agility', icon: Crosshair, value: level * 70 + 300, max: 5000, colorClass: 'text-warning', color1: '#ffd54f', color2: '#ffb300' }
    ];
  }, [user]);

  // Rank Advancement Handler
  const handlePromotion = async () => {
    if (isPromoting || !requirementsMet || !nextRank) return;
    setIsPromoting(true);
    setPromoError('');

    try {
      const token = localStorage.getItem('hunterToken');
      const res = await fetch(`${API_URL}/api/user/promote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        // Trigger fullscreen promotional aura blast!
        setShowPromoAura(true);
        if (updateUser) updateUser(data.user);

        // Hide overlay after 3.2 seconds
        setTimeout(() => {
          setShowPromoAura(false);
          setIsPromoting(false);
        }, 3200);
      } else {
        setPromoError(data.error || 'Failed to complete promotion trial.');
        setIsPromoting(false);
      }
    } catch (err) {
      console.error('Failed to promote user:', err);
      setPromoError('Network error. Check connection to academy servers.');
      setIsPromoting(false);
    }
  };

  return (
    <div className="profile-container animate-fade-in">
      {/* 1. Fullscreen Rank Promotion Aura Blast Overlay */}
      {showPromoAura && (
        <div className="promo-aura-blast-overlay flex-center">
          <div className="cosmic-aura-ring"></div>
          <div className="promo-sparks">
            {Array.from({ length: 16 }).map((_, i) => (
              <div 
                key={i} 
                className="promo-particle" 
                style={{ 
                  transform: `rotate(${i * 22.5}deg) translateY(-140px)`,
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>
          <div className="promo-badge-container">
            <span className="promo-rank-letter">{nextRank}</span>
            <div className="badge-shield-glow"></div>
          </div>
          <h1 className="promo-headline">RANK ADVANCED!</h1>
          <p className="promo-subheadline">The Academy recognizes your outstanding progression.</p>
        </div>
      )}

      <div className="profile-layout">
        
        {/* LEFT COLUMN: Character Card & Rank Badge */}
        <div className="profile-card-col">
          <div className="profile-card glass-panel text-center">
            
            <div className="profile-model">
              <div className="model-backdrop crown-glow" style={{
                background: `radial-gradient(circle, ${user?.class === 'Mage' ? 'rgba(155,81,224,0.45)' : user?.class === 'Ranger' ? 'rgba(0,230,118,0.45)' : user?.class === 'Assassin' ? 'rgba(255,0,127,0.45)' : 'rgba(0,184,255,0.45)'} 0%, transparent 75%)`
              }}></div>
              <img 
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username || 'Kaelen'}&backgroundColor=transparent`} 
                alt="Character Model" 
                className="character-model"
              />
            </div>

            <div className="profile-header mt-4">
              <h2 className="gold-text text-xl font-bold tracking-wide">{user?.username || 'Hunter'}</h2>
              <span className="player-title text-muted text-xxs font-bold block mt-1">The Elite {user?.class || 'Saber'}</span>
              
              <div className="rank-badge-display mt-3">
                <span className="rank-shield-letter">{currentRank}</span>
                <span className="level-badge">Lvl {user?.level || 1}</span>
              </div>
            </div>

            {/* EXP bar */}
            <div className="exp-progress-meter mt-4">
              <div className="flex-between text-xxs text-muted mb-1 font-mono">
                <span>ACADEMY EXP</span>
                <span>{user?.exp || 0} / {expNeeded} ({expPercent}%)</span>
              </div>
              <div className="bar-bg" style={{ height: '5px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div className="bar-fill" style={{ width: `${expPercent}%`, height: '100%', background: 'linear-gradient(90deg, #7a3bd6, #00b0ff)', boxShadow: '0 0 10px rgba(0, 176, 255, 0.5)' }}></div>
              </div>
            </div>
            
          </div>
        </div>

        {/* RIGHT COLUMN: Stats, Equipment Grid, & Rank Advancement Terminal */}
        <div className="profile-details-col">
          
          {/* STATS SECTION */}
          <div className="glass-panel detail-section">
            <h3 className="gold-text mb-4 text-md flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
              <Sparkles size={18} /> Core Attributes & Poses
            </h3>
            <div className="attributes-grid">
              {stats.map(stat => (
                <div key={stat.name} className="attribute">
                  <stat.icon className={`attr-icon ${stat.colorClass}`} />
                  <div className="attr-info w-full">
                    <div className="flex-between">
                      <span className="label font-mono">{stat.name}</span>
                      <span className="value font-mono">{stat.value.toLocaleString()}</span>
                    </div>
                    <div className="stat-growth-bar mt-2" style={{ height: '6px', background: 'rgba(0,0,0,0.5)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div 
                        className="stat-fill" 
                        style={{ 
                          width: `${Math.min(100, (stat.value / stat.max) * 100)}%`, 
                          height: '100%', 
                          background: `linear-gradient(90deg, ${stat.color1}, ${stat.color2})`,
                          borderRadius: '3px',
                          boxShadow: `0 0 6px ${stat.color1}aa`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC EQUIPMENT SLOT GRID */}
          <div className="glass-panel detail-section mt-4">
            <h3 className="gold-text mb-4 text-md flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
              <Award size={18} /> Equipped Gear Vectors
            </h3>
            <div className="gear-grid">
              {equippedGear.map(item => (
                <div key={item.key} className="gear-slot">
                  <ItemVisualizer 
                    itemName={item.name} 
                    slot={item.slot} 
                    playerClass={user?.class || 'Saber'} 
                    rarity={item.rarity} 
                    size={80} 
                  />
                  <div className="gear-info mt-2">
                    <span className="gear-label font-mono block text-xxs text-muted">{item.title}</span>
                    <span className={`gear-name-display text-xs ${item.rarity}-text`} style={{ display: 'block', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px', fontWeight: '500' }}>
                      {item.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RANK ADVANCEMENT TERMINAL */}
          <div className="glass-panel detail-section mt-4 advancement-terminal">
            <h3 className="gold-text mb-3 text-md flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
              <Award size={18} className="gold-text" /> Rank Advancement Terminal
            </h3>

            {nextRank ? (
              <div className="terminal-body font-mono">
                <p className="terminal-desc mb-3 text-xs text-muted">
                  Advance your standing to unlock advanced runic energy auras, weapon glows, and higher rank multipliers.
                </p>
                
                <div className="terminal-requirements-grid">
                  <div className="requirement-check flex-between">
                    <span className="req-label flex-center gap-2">
                      <Sparkles size={14} className="text-muted" /> Level {reqs.level}+
                    </span>
                    <span className="req-status flex-center gap-1 font-bold">
                      {user?.level >= reqs.level ? (
                        <><CheckCircle2 size={14} className="text-success" /> OK ({user.level})</>
                      ) : (
                        <><XCircle size={14} className="text-danger" /> LACK ({user?.level || 0}/{reqs.level})</>
                      )}
                    </span>
                  </div>

                  <div className="requirement-check flex-between mt-2">
                    <span className="req-label flex-center gap-2">
                      <Sparkles size={14} className="text-muted" /> Quests Complete {reqs.quests}+
                    </span>
                    <span className="req-status flex-center gap-1 font-bold">
                      {(user?.quests_completed || 0) >= reqs.quests ? (
                        <><CheckCircle2 size={14} className="text-success" /> OK ({user.quests_completed})</>
                      ) : (
                        <><XCircle size={14} className="text-danger" /> LACK ({user?.quests_completed || 0}/{reqs.quests})</>
                      )}
                    </span>
                  </div>

                  <div className="requirement-check flex-between mt-2">
                    <span className="req-label flex-center gap-2">
                      <Sparkles size={14} className="text-muted" /> Trial Processing Fee ({reqs.gold.toLocaleString()} Gold)
                    </span>
                    <span className="req-status flex-center gap-1 font-bold">
                      {user?.gold >= reqs.gold ? (
                        <><CheckCircle2 size={14} className="text-success" /> OK ({user.gold.toLocaleString()})</>
                      ) : (
                        <><XCircle size={14} className="text-danger" /> LACK ({user?.gold || 0}/{reqs.gold.toLocaleString()})</>
                      )}
                    </span>
                  </div>
                </div>

                {promoError && (
                  <div className="promo-error-msg mt-3 text-xxs text-danger font-bold text-center border border-red-500 bg-red-950 p-2 rounded">
                    {promoError}
                  </div>
                )}

                <div className="flex-center mt-4">
                  <button 
                    className={`btn-promote-styled ${requirementsMet ? 'ready' : 'locked'}`} 
                    disabled={!requirementsMet || isPromoting}
                    onClick={handlePromotion}
                  >
                    {isPromoting ? (
                      <span className="flex-center gap-2"><Loader2 className="animate-spin" size={16} /> Channeling...</span>
                    ) : requirementsMet ? (
                      <span className="flex-center gap-2"><Sparkles size={16} /> Trigger Promotion Trial</span>
                    ) : (
                      <span className="flex-center gap-2">Requirements Locked</span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="terminal-body font-mono text-center py-4">
                <div className="max-rank-badge flex-center">
                  <span className="badge-star">★</span> ETERNAL GRANDMASTER ★
                </div>
                <p className="text-success font-bold mt-3 text-xs tracking-wide">
                  You have attained the pinnacle rank of Hunter Rank SS!
                </p>
                <p className="text-muted text-xxs mt-1">
                  You are legendary, and all runic aura pulses and combo glows are fully active.
                </p>
              </div>
            )}
            
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Profile;
