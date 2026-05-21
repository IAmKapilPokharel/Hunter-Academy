import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import BattleIntro from './BattleIntro';
import BattleScene from './BattleScene';
import './Battle.css';

/**
 * Entry-point page component mapped to the /battle route.
 * Restricts unauthenticated access or missing location states,
 * mounts the CSS animation stylesheet, and launches the intro cinematic.
 */
const BattleIndex = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser } = useOutletContext();
  
  const quest = location.state?.quest;
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  // Assert location quest configuration exits
  useEffect(() => {
    if (!quest) {
      navigate('/quests');
    }
  }, [quest, navigate]);

  if (!quest) return null;

  return (
    <>
      {/* Cinematic entry sequence overlay */}
      <BattleIntro onComplete={() => setIsIntroComplete(true)} />

      {/* Primary battle manager layer */}
      <BattleScene
        user={user}
        updateUser={updateUser}
        quest={quest}
        isIntroComplete={isIntroComplete}
      />
    </>
  );
};

export default BattleIndex;
