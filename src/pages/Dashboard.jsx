import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Sword, Shield, Zap, Trophy } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-grid">
        {/* Main Banner */}
        <div className="glass-panel main-banner">
          <div className="banner-content">
            <h1 className="gold-text">Welcome back, {user?.username || 'Hunter'}</h1>
            <p>The academy needs your skills. A new high-rank monster has been spotted in the Whispering Woods.</p>
            <button className="btn-primary mt-4" onClick={() => navigate('/quests')}>View Current Mission</button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="glass-panel stat-card">
            <div className="stat-icon purple-glow"><Target /></div>
            <div className="stat-info">
              <span className="label">Quests Completed</span>
              <span className="value">{user?.quests_completed || 0}</span>
            </div>
          </div>
          <div className="glass-panel stat-card">
            <div className="stat-icon purple-glow"><Sword /></div>
            <div className="stat-info">
              <span className="label">Monsters Slain</span>
              <span className="value">
                {(user?.quests_completed || 0) > 0 
                  ? ((user?.quests_completed || 0) * 14 + (user?.level || 1) * 23).toLocaleString() 
                  : 0}
              </span>
            </div>
          </div>
          <div className="glass-panel stat-card">
            <div className="stat-icon purple-glow"><Shield /></div>
            <div className="stat-info">
              <span className="label">Guild Contribution</span>
              <span className="value">{user?.rank || 'D'}-Tier</span>
            </div>
          </div>
          <div className="glass-panel stat-card">
            <div className="stat-icon purple-glow"><Zap /></div>
            <div className="stat-info">
              <span className="label">Mana Prowess</span>
              <span className="value">{((user?.level || 1) * 150 + 200).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Active Quest Preview */}
        <div className="glass-panel active-quest-preview">
          <div className="section-header">
            <h2 className="gold-text">Active Quest</h2>
            <button className="view-all-btn" onClick={() => navigate('/quests')}>View Map</button>
          </div>
          <div className="quest-details mt-4">
            <div className="quest-rank rank-s">S-Rank</div>
            <h3>Subjugate the Shadow Dragon</h3>
            <p className="text-muted mt-2">Location: Mount Igneous</p>
            <div className="progress-bar-container mt-4">
              <div className="progress-info flex-between">
                <span>Progress</span>
                <span>65%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel recent-activity">
          <div className="section-header">
            <h2 className="gold-text">Recent Activity</h2>
          </div>
          <ul className="activity-list mt-4">
            <li className="activity-item">
              <div className="activity-icon"><Trophy size={16}/></div>
              <div className="activity-text">
                <strong>Ranked Up!</strong> Promoted to S-Rank.
                <span className="time">2 hours ago</span>
              </div>
            </li>
            <li className="activity-item">
              <div className="activity-icon"><Target size={16}/></div>
              <div className="activity-text">
                <strong>Quest Completed:</strong> Goblin Cave Clearing.
                <span className="time">5 hours ago</span>
              </div>
            </li>
            <li className="activity-item">
              <div className="activity-icon"><Sword size={16}/></div>
              <div className="activity-text">
                <strong>Item Acquired:</strong> Blade of the Fallen King.
                <span className="time">1 day ago</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
