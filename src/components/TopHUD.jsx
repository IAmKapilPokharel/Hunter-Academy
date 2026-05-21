import React, { useState } from 'react';
import { Bell, Settings, Search, Volume2, Moon, LogOut } from 'lucide-react';
import './TopHUD.css';

const TopHUD = ({ user }) => {
  const [showNotif, setShowNotif] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('hunterToken');
    window.location.reload();
  };

  return (
    <header className="top-hud glass-panel">
      <div className="hud-left">
        <div className="player-profile">
          <div className="avatar-wrapper">
            <div className="level-ring gold-border">
              <span className="level">{user?.level || 1}</span>
            </div>
            <img 
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username || 'Hunter'}&backgroundColor=0f0a18`} 
              alt="Player Avatar" 
              className="avatar"
            />
          </div>
          <div className="player-info">
            <h3 className="gold-text">{user?.username || 'Unknown Hunter'}</h3>
            <span className="rank text-muted">{user?.rank || 'D'}-Rank {user?.class || 'Hunter'}</span>
          </div>
        </div>
      </div>

      <div className="hud-center">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search quests, hunters, or items..." 
            onKeyDown={(e) => { if (e.key === 'Enter') alert('Search results: No matching entries found.'); }}
          />
        </div>
      </div>

      <div className="hud-right">
        <div className="currency">
          <div className="crystals">
            <span className="amount gold-text">{user?.gold || 0}</span>
            <span className="label">Crystals</span>
          </div>
        </div>
        
        <div className="dropdown-container">
          <button className="icon-btn purple-glow" onClick={() => { setShowNotif(!showNotif); setShowSettings(false); }}>
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button>
          
          {showNotif && (
            <div className="hud-dropdown glass-panel animate-fade-in">
              <h4 className="dropdown-header gold-text">Notifications</h4>
              <div className="dropdown-item">
                <span className="text-muted text-sm" style={{display:'block', marginBottom:'4px'}}>System</span>
                <p style={{margin:0, fontSize:'14px'}}>Welcome to Hunter Academy! Your journey begins now.</p>
              </div>
              <div className="dropdown-item">
                <span className="text-muted text-sm" style={{display:'block', marginBottom:'4px'}}>Guild</span>
                <p style={{margin:0, fontSize:'14px'}}>New S-Rank quests are available on the board.</p>
              </div>
            </div>
          )}
        </div>

        <div className="dropdown-container" style={{marginLeft: '8px'}}>
          <button className="icon-btn" onClick={() => { setShowSettings(!showSettings); setShowNotif(false); }}>
            <Settings size={20} />
          </button>

          {showSettings && (
            <div className="hud-dropdown glass-panel animate-fade-in">
              <h4 className="dropdown-header gold-text">Settings</h4>
              <div className="dropdown-item flex-between" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{display:'flex', alignItems:'center'}}><Volume2 size={16} className="mr-2" style={{marginRight:'8px'}} /> Sound</span>
                <input type="range" min="0" max="100" defaultValue="80" style={{width:'80px'}} />
              </div>
              <div className="dropdown-item flex-between" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{display:'flex', alignItems:'center'}}><Moon size={16} className="mr-2" style={{marginRight:'8px'}} /> Theme</span>
                <input type="checkbox" defaultChecked />
              </div>
              <hr className="dropdown-divider" style={{borderColor:'var(--border-purple)', margin:'10px 0'}} />
              <button className="dropdown-item text-danger flex-center w-100" onClick={handleLogout} style={{background:'transparent', border:'none', color:'#ff3c3c', width:'100%', display:'flex', justifyContent:'center', alignItems:'center', cursor:'pointer', padding:'8px 0'}}>
                <LogOut size={16} className="mr-2" style={{marginRight:'8px'}} /> Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHUD;
