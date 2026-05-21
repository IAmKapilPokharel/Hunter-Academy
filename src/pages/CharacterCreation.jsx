import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CharacterCreation.css';

const CharacterCreation = () => {
  const navigate = useNavigate();
  const [characterName, setCharacterName] = useState('');
  const [selectedClass, setSelectedClass] = useState('Assassin');

  const classes = [
    { id: 'Saber', name: 'Saber', description: 'Balanced melee combatant.' },
    { id: 'Assassin', name: 'Assassin', description: 'High burst damage, stealth.' },
    { id: 'Mage', name: 'Mage', description: 'Long-range magical attacks.' },
    { id: 'Ranger', name: 'Ranger', description: 'Precision attacks from afar.' },
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    if (characterName) {
      // Typically save to context/state here, then redirect
      navigate('/dashboard');
    }
  };

  return (
    <div className="character-creation-container animate-fade-in">
      <div className="creation-box glass-panel">
        <h1 className="gold-text text-center title">Create Your Hunter</h1>
        <div className="creation-layout mt-4">
          
          <div className="avatar-preview-section">
            <div className="avatar-frame crown-glow">
              <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${characterName || 'Hunter'}&backgroundColor=0f0a18`} alt="Avatar Preview" className="avatar-preview-img"/>
            </div>
            <p className="text-muted text-center mt-4">Appearance generated based on name.</p>
          </div>

          <div className="form-section">
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="gold-text">Hunter Name</label>
                <input 
                  type="text" 
                  className="game-input mt-2" 
                  placeholder="Enter your name..." 
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mt-4">
                <label className="gold-text">Select Class</label>
                <div className="class-selection mt-2">
                  {classes.map(cls => (
                    <div 
                      key={cls.id}
                      className={`class-card ${selectedClass === cls.id ? 'selected' : ''}`}
                      onClick={() => setSelectedClass(cls.id)}
                    >
                      <h4>{cls.name}</h4>
                      <p className="text-muted">{cls.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary w-100 mt-4">Enter Academy</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;
