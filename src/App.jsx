import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QuestBoard from './pages/QuestBoard';
import Rankings from './pages/Rankings';
import Tournament from './pages/Tournament';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import Battle from './pages/battle/index';
import { API_URL } from './config';
import './styles/global.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('hunterToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('hunterToken');
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('hunterToken');
    setUser(null);
  };

  if (loading) return null;

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} 
        />
        
        {/* Protected Routes */}
        <Route element={user ? <Layout onLogout={handleLogout} user={user} updateUser={setUser} /> : <Navigate to="/" replace />}>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/quests" element={<QuestBoard updateUser={setUser} />} />
          <Route path="/rankings" element={<Rankings user={user} />} />
          <Route path="/tournament" element={<Tournament user={user} />} />
          <Route path="/battle" element={<Battle />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/achievements" element={<Achievements />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
