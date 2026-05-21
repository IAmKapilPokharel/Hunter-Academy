import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import './Login.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [playerClass, setPlayerClass] = useState('Saber');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegistering ? '/api/register' : '/api/login';
    const payload = isRegistering ? { username, password, playerClass } : { username, password };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      // Save token and user
      localStorage.setItem('hunterToken', data.token);
      onLogin(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-box glass-panel">
        <h1 className="gold-text text-center login-title">
          Hunter Academy
        </h1>
        <p className="text-center text-muted mb-4">
          {isRegistering ? 'Enroll in the Academy' : 'Enter the Academy'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="gold-text">Username</label>
            <input 
              type="text" 
              className="game-input mt-2" 
              placeholder="Hunter Name..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group mt-4">
            <label className="gold-text">Password</label>
            <input 
              type="password" 
              className="game-input mt-2" 
              placeholder="Secret Passphrase..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegistering && (
            <div className="form-group mt-4">
              <label className="gold-text">Class</label>
              <select 
                className="game-input mt-2"
                value={playerClass}
                onChange={(e) => setPlayerClass(e.target.value)}
              >
                <option value="Saber">Saber (Balanced Melee)</option>
                <option value="Assassin">Assassin (Stealth & Burst)</option>
                <option value="Mage">Mage (Long-range Magic)</option>
                <option value="Ranger">Ranger (Precision Archery)</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn-primary w-100 mt-4">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="login-footer text-center mt-4">
          <button 
            type="button" 
            className="toggle-mode-btn text-muted" 
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Already enrolled? Login here.' : 'New hunter? Register here.'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
