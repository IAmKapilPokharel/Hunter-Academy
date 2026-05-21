import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Scroll, Trophy, Swords, User, Medal, LogOut } from 'lucide-react';
import { io } from 'socket.io-client';
import { API_URL } from '../config';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const [onlineCount, setOnlineCount] = useState(1);
  const [systemMsg, setSystemMsg] = useState(null);

  useEffect(() => {
    const socket = io(API_URL);
    
    socket.on('playerCount', (count) => {
      setOnlineCount(count);
    });

    socket.on('systemMessage', (msg) => {
      setSystemMsg(msg);
      setTimeout(() => setSystemMsg(null), 5000);
    });

    return () => socket.disconnect();
  }, []);
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/quests', label: 'Quests', icon: <Scroll size={20} /> },
    { path: '/rankings', label: 'Rankings', icon: <Trophy size={20} /> },
    { path: '/tournament', label: 'Tournament', icon: <Swords size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
    { path: '/achievements', label: 'Achievements', icon: <Medal size={20} /> },
  ];

  return (
    <aside className="sidebar glass-panel">
      {systemMsg && (
        <div className="toast-notification animate-fade-in glass-panel">
          <Trophy size={16} className="inline-icon gold-text mr-2" />
          <span>{systemMsg}</span>
        </div>
      )}
      <div className="sidebar-header">
        <h2 className="gold-text">Hunter<br/>Academy</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="system-status mb-4">System: Online ({onlineCount})</div>
        <button onClick={onLogout} className="btn-logout flex-center w-100 text-muted">
          <LogOut size={16} className="mr-2" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
