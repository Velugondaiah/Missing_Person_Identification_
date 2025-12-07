import React, { useEffect, useState } from 'react';
import { Avatar, IconButton, Button, Snackbar, Alert } from '@mui/material';
import { Dashboard, Person, Message, Settings, Notifications, Logout, Brightness4, Brightness7, VerifiedUser, AddAlert, CloudUpload, CheckCircle, EmojiEvents, Map } from '@mui/icons-material';
import './index.css';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [user, setUser] = useState({ name: '', role: 'Citizen', verified: true });
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    if (u) setUser({ ...u, role: 'Citizen', verified: true });
  }, []);

  // Mock data
  const myReports = [
    { name: 'John Doe', status: 'Missing', alert: true },
    { name: 'Jane Smith', status: 'Found', alert: false },
  ];
  const sightings = [
    { photo: '', location: 'Central Park', time: '1h ago', desc: 'Spotted a person matching description.' },
    { photo: '', location: 'Main St', time: '3h ago', desc: 'Possible sighting near bus stop.' },
  ];
  const matches = [
    { msg: 'Possible match for John Doe at Central Park!', time: 'Just now' },
  ];
  const rewards = [
    { desc: 'Reward for reporting sighting of John Doe', status: 'Earned' },
    { desc: 'Reward for uploading sighting of Jane Smith', status: 'Pending' },
  ];

  return (
    <div className={`civic-dashboard-root topnav-layout${darkMode ? ' dark' : ''}`}> 
      {/* Main Content */}
      <main className="civic-dashboard-main topnav-main">
        {/* Hero Section */}
        <section className="civic-dashboard-header topnav-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Avatar src={user.photo || ''} className="civic-header-avatar" style={{ width: 72, height: 72, marginRight: 18, boxShadow: '0 2px 8px #dbeafe55', border: '3px solid #e0e7ef' }} />
            <div>
              <div className="civic-header-greeting">
                Welcome, <span className="civic-header-name">{user.name || 'Citizen'}</span> {user.verified && <VerifiedUser className="civic-header-verified" title="Verified user" />}
              </div>
              <div className="civic-header-role">{user.role}</div>
            </div>
          </div>
          <div className="civic-header-actions">
            <button className="civic-header-action-btn" onClick={() => window.location.href = '/report_missing'}><AddAlert style={{ fontSize: 22 }} /> Report Missing</button>
            <button className="civic-header-action-btn" onClick={() => navigate('/upload_sighting')}><CloudUpload style={{ fontSize: 22 }} /> Upload Sighting</button>
          </div>
        </section>
        
        {/* Widget Grid */}
        <section className="civic-widget-grid">
          {/* My Reports Widget */}
          <div className="civic-widget-card">
            <div className="civic-widget-title"><CheckCircle /> My Reports</div>
            <ul className="civic-widget-list">
              {myReports.map((r, i) => (
                <li key={i} className={`civic-widget-list-item${r.status === 'Missing' ? ' missing' : ' found'}`}> 
                  <span className="civic-widget-list-avatar"><Person /></span>
                  <span className="civic-widget-list-name">{r.name}</span>
                  <span className={`civic-widget-list-status ${r.status === 'Missing' ? 'missing' : 'found'}`}>{r.status}</span>
                  {r.alert && <span className="civic-widget-list-alert"><Notifications /></span>}
                </li>
              ))}
            </ul>
          </div>
          {/* Recent Sightings Widget */}
          <div className="civic-widget-card">
            <div className="civic-widget-title"><Map /> Recent Sightings</div>
            <ul className="civic-widget-list">
              {sightings.map((s, i) => (
                <li key={i} className="civic-widget-list-item">
                  <span className="civic-widget-list-avatar"><Map /></span>
                  <span className="civic-widget-list-name">{s.location}</span>
                  <span className="civic-widget-list-desc">{s.desc}</span>
                  <span className="civic-widget-list-time">{s.time}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Matches/Alerts Widget */}
          <div className="civic-widget-card">
            <div className="civic-widget-title"><Notifications /> Matches / Alerts</div>
            <ul className="civic-widget-list">
              {matches.map((m, i) => (
                <li key={i} className="civic-widget-list-item">
                  <span className="civic-widget-list-avatar"><Notifications /></span>
                  <span className="civic-widget-list-name">{m.msg}</span>
                  <span className="civic-widget-list-time">{m.time}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Rewards Widget */}
          <div className="civic-widget-card">
            <div className="civic-widget-title"><EmojiEvents /> Rewards</div>
            <ul className="civic-widget-list">
              {rewards.map((r, i) => (
                <li key={i} className={`civic-widget-list-item${r.status === 'Earned' ? ' earned' : ' pending'}`}> 
                  <span className="civic-widget-list-avatar"><EmojiEvents /></span>
                  <span className="civic-widget-list-name">{r.desc}</span>
                  <span className={`civic-widget-list-status ${r.status === 'Earned' ? 'earned' : 'pending'}`}>{r.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      
      {/* Snackbar for alert */}
      <Snackbar open={openAlert} autoHideDuration={4000} onClose={() => setOpenAlert(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setOpenAlert(false)} severity="success" sx={{ width: '100%' }}>
          Submitted successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserDashboard;
