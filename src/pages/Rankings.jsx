import React, { useState, useEffect } from 'react';
import { Crown, Medal, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { API_URL } from '../config';
import './Rankings.css';

const Rankings = ({ user }) => {
  const [hunters, setHunters] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/rankings`);
        if (res.ok) {
          const data = await res.json();
          setHunters(data);
        }
      } catch (err) {
        console.error('Failed to fetch rankings', err);
      }
    };
    fetchRankings();
  }, []);

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUp size={16} className="text-success" />;
    if (trend === 'down') return <ArrowDown size={16} className="text-danger" />;
    return <Minus size={16} className="text-muted" />;
  };

  return (
    <div className="rankings-container animate-fade-in">
      <div className="page-header text-center mb-4">
        <h1 className="gold-text"><Crown className="inline-icon mr-2" /> Global Rankings</h1>
        <p className="text-muted">Top hunters of the academy.</p>
      </div>

      <div className="podium flex-center mb-4">
        <div className="podium-spot rank-2 glass-panel">
          <div className="podium-avatar">
             <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${hunters[1]?.name || 'Hunter'}&backgroundColor=0f0a18`} alt="2nd Place"/>
          </div>
          <h3 className="gold-text mt-2">{hunters[1]?.name || '---'}</h3>
          <span className="silver-badge">2nd</span>
        </div>
        <div className="podium-spot rank-1 glass-panel">
           <div className="podium-avatar crown-glow">
             <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${hunters[0]?.name || 'Hunter'}&backgroundColor=0f0a18`} alt="1st Place"/>
          </div>
          <h3 className="gold-text mt-2">{hunters[0]?.name || '---'}</h3>
          <span className="gold-badge">1st</span>
        </div>
        <div className="podium-spot rank-3 glass-panel">
           <div className="podium-avatar">
             <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${hunters[2]?.name || 'Hunter'}&backgroundColor=0f0a18`} alt="3rd Place"/>
          </div>
          <h3 className="gold-text mt-2">{hunters[2]?.name || '---'}</h3>
          <span className="bronze-badge">3rd</span>
        </div>
      </div>

      <div className="leaderboard glass-panel">
        <table className="ranking-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Hunter</th>
              <th>Class</th>
              <th>Level</th>
              <th>Score</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {hunters.map((hunter) => (
              <tr key={hunter.rank} className={hunter.name === user?.username ? 'current-player' : ''}>
                <td className="rank-col">
                  {hunter.rank <= 3 ? <Medal size={20} className={`medal-${hunter.rank}`} /> : `#${hunter.rank}`}
                </td>
                <td className="hunter-col">
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${hunter.name}&backgroundColor=0f0a18`} alt={hunter.name} className="mini-avatar" />
                  {hunter.name}
                </td>
                <td>{hunter.class}</td>
                <td>{hunter.level}</td>
                <td className="score-col">{Number(hunter.score).toLocaleString()}</td>
                <td>{getTrendIcon(hunter.trend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rankings;
