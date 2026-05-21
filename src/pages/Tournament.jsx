import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swords } from 'lucide-react';
import './Tournament.css';

const Tournament = () => {
  const navigate = useNavigate();

  const handleEnterArena = () => {
    const bossQuest = {
      id: 99,
      title: 'Arthur Pendragon',
      rank: 'S',
      location: 'Grand Colosseum',
      reward: '100000 Crystals',
      type: 'Boss Battle'
    };
    navigate('/battle', { state: { quest: bossQuest } });
  };

  return (
    <div className="tournament-container animate-fade-in">
      <div className="page-header text-center mb-4">
        <h1 className="gold-text"><Swords className="inline-icon mr-2" /> Grand Colosseum</h1>
        <p className="text-muted">Season 12 Championship Bracket</p>
      </div>

      <div className="tournament-bracket glass-panel">
        <div className="bracket-round semi-finals">
          <h3 className="gold-text text-center mb-4">Semi-Finals</h3>
          <div className="matchup">
             <div className="competitor winner">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Arthur&backgroundColor=0f0a18" alt="Arthur" className="mini-avatar" />
                <span>Arthur Pendragon</span>
                <span className="score">3</span>
             </div>
             <div className="competitor">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Grom&backgroundColor=0f0a18" alt="Grom" className="mini-avatar" />
                <span>Grom Ironhide</span>
                <span className="score">1</span>
             </div>
          </div>
          <div className="matchup mt-4">
             <div className="competitor winner">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Kaelen&backgroundColor=0f0a18" alt="Kaelen" className="mini-avatar" />
                <span>Kaelen Shadowbane</span>
                <span className="score">3</span>
             </div>
             <div className="competitor">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Lyra&backgroundColor=0f0a18" alt="Lyra" className="mini-avatar" />
                <span>Lyra Moonwhisper</span>
                <span className="score">2</span>
             </div>
          </div>
        </div>
        
        <div className="bracket-connector">
           <div className="line top-line"></div>
           <div className="line bottom-line"></div>
           <div className="line center-line"></div>
        </div>

        <div className="bracket-round finals">
          <h3 className="gold-text text-center mb-4">Finals</h3>
          <div className="matchup final-matchup">
             <div className="competitor">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Arthur&backgroundColor=0f0a18" alt="Arthur" className="mini-avatar" />
                <span>Arthur Pendragon</span>
                <span className="score">-</span>
             </div>
             <div className="versus gold-text">VS</div>
             <div className="competitor current-player">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Kaelen&backgroundColor=0f0a18" alt="Kaelen" className="mini-avatar" />
                <span>Kaelen Shadowbane</span>
                <span className="score">-</span>
             </div>
          </div>
          <div className="text-center mt-4">
            <button className="btn-primary" onClick={handleEnterArena}>Enter Arena</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tournament;
