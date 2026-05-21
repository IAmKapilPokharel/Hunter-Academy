import React, { useState, useEffect } from 'react';
import QuestCard from '../components/QuestCard';
import { API_URL } from '../config';
import './QuestBoard.css';

const QuestBoard = ({ updateUser }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const token = localStorage.getItem('hunterToken');
        const res = await fetch(`${API_URL}/api/quests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setQuests(data);
        }
      } catch (err) {
        console.error('Failed to fetch quests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuests();
  }, []);

  return (
    <div className="quest-board-container animate-fade-in">
      <div className="page-header flex-between mb-4">
        <div>
          <h1 className="gold-text">Quest Board</h1>
          <p className="text-muted">Select your next mission, Hunter.</p>
        </div>
        <div className="filters flex-center gap-2">
          <button className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`} onClick={() => setActiveFilter('All')}>All</button>
          <button className={`filter-btn ${activeFilter === 'S' ? 'active' : ''}`} onClick={() => setActiveFilter('S')}>S-Rank</button>
          <button className={`filter-btn ${activeFilter === 'A' ? 'active' : ''}`} onClick={() => setActiveFilter('A')}>A-Rank</button>
          <button className={`filter-btn ${activeFilter === 'B' ? 'active' : ''}`} onClick={() => setActiveFilter('B')}>B-Rank</button>
          <button className={`filter-btn ${activeFilter === 'C' ? 'active' : ''}`} onClick={() => setActiveFilter('C')}>C-Rank & Below</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-muted mt-5">Loading quests...</div>
      ) : (
        <div className="quest-grid">
          {quests
            .filter(q => {
              if (activeFilter === 'All') return true;
              if (activeFilter === 'C') return ['C', 'D'].includes(q.rank);
              return q.rank === activeFilter;
            })
            .map(quest => (
            <QuestCard key={quest.id} quest={{...quest, reward: `${quest.reward_gold} Gold`}} updateUser={updateUser} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestBoard;
