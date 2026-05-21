import React, { useState, useEffect } from 'react';
import AchievementCard from '../components/AchievementCard';
import { Trophy } from 'lucide-react';
import { API_URL } from '../config';
import './Achievements.css';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const token = localStorage.getItem('hunterToken');
        const res = await fetch(`${API_URL}/api/achievements`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAchievements(data);
        }
      } catch (err) {
        console.error('Failed to fetch achievements', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="achievements-container animate-fade-in">
      <div className="page-header text-center mb-4">
        <h1 className="gold-text"><Trophy className="inline-icon mr-2" /> Hall of Trophies</h1>
        <p className="text-muted">Your legacy etched in history.</p>
        <div className="progress-summary mt-2">
           <span className="gold-text font-bold">{unlockedCount}</span> / {achievements.length || 0} Unlocked
        </div>
      </div>

      {loading ? (
        <div className="text-center text-muted mt-5">Loading achievements...</div>
      ) : (
        <div className="achievements-grid">
          {achievements.map(ach => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;
