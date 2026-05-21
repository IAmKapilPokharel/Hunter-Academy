import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ShieldAlert, Coins } from 'lucide-react';
import './QuestCard.css';

const QuestCard = ({ quest }) => {
  const navigate = useNavigate();

  const handleAccept = () => {
    navigate('/battle', { state: { quest } });
  };
  const getRankClass = (rank) => {
    switch (rank) {
      case 'S': return 'rank-s';
      case 'A': return 'rank-a';
      case 'B': return 'rank-b';
      case 'C': return 'rank-c';
      default: return 'rank-d';
    }
  };

  return (
    <div className="quest-card glass-panel">
      <div className="card-header flex-between">
        <span className={`quest-rank ${getRankClass(quest.rank)}`}>{quest.rank}-Rank</span>
        <span className="quest-type">{quest.type}</span>
      </div>
      
      <div className="card-body">
        <h3>{quest.title}</h3>
        
        <div className="quest-detail mt-2">
          <MapPin size={14} className="detail-icon" />
          <span>{quest.location}</span>
        </div>
        
        <div className="quest-detail">
          <ShieldAlert size={14} className="detail-icon" />
          <span>Combat Recommended</span>
        </div>
      </div>

      <div className="card-footer flex-between">
        <div className="reward gold-text">
          <Coins size={16} />
          <span>{quest.reward}</span>
        </div>
        <button 
          className="btn-accept"
          onClick={handleAccept}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default QuestCard;
