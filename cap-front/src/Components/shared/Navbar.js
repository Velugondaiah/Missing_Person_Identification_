import React, { useState, useEffect } from 'react';
import { Avatar, IconButton } from '@mui/material';
import { Dashboard, Person, Message, Settings, Notifications, Logout, Brightness4, Brightness7, VerifiedUser, CheckCircle } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const navItems = [
  { label: 'Dashboard', icon: <Dashboard />, path: 'dashboard' },
  { label: 'Profile', icon: <Person />, path: 'profile' },
  { label: 'Reports', icon: <CheckCircle />, path: 'user_history' },
  { label: 'Messages', icon: <Message />, path: 'messages' },
  { label: 'Settings', icon: <Settings />, path: 'settings' },
];

const Navbar = ({ userRole = 'user', onLogout }) => {
  const [user, setUser] = useState({ name: '', role: 'Citizen', verified: true });
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadUserData = () => {
      try {
        const u = localStorage.getItem('user');
        if (u) {
          const userData = JSON.parse(u);
          setUser({ 
            ...userData, 
            role: userData.role === 'user' ? 'Citizen' : userData.role, 
            verified: userData.verified || true 
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Update active nav based on current location
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('dashboard')) setActiveNav('Dashboard');
    else if (path.includes('profile')) setActiveNav('Profile');
    else if (path.includes('user_history')) setActiveNav('Reports');
    else if (path.includes('messages')) setActiveNav('Messages');
    else if (path.includes('settings')) setActiveNav('Settings');
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Call the logout callback if provided
    if (onLogout) {
      onLogout();
    }
    
    navigate('/login');
  };

  const handleNavClick = (item) => {
    setActiveNav(item.label);
    
    // Navigate based on user role and item
    if (item.label === 'Dashboard') {
      if (userRole === 'user') navigate('/user_dashboard');
      else if (userRole === 'doctor') navigate('/doctor_dashboard');
      else if (userRole === 'police') navigate('/police_dashboard');
    } else if (item.label === 'Profile') {
      navigate('/profile');
    } else if (item.label === 'Reports') {
      if (userRole === 'user') navigate('/user_history');
      // Add other role-specific report pages if needed
    } else {
      // For other nav items, you can add specific routes
      navigate(`/${item.path}`);
    }
  };

  // Don't show navbar on login/signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <header className="civic-topnav">
      <div className="civic-topnav-left">
        <span className="civic-topnav-logo">
          <Dashboard className="civic-topnav-logo-icon" />
          
        </span>
        <nav className="civic-topnav-nav">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`civic-topnav-nav-item${activeNav === item.label ? ' active' : ''}`}
              onClick={() => handleNavClick(item)}
              title={item.label}
              style={{ fontSize: '1rem', padding: '8px 16px' }}
            >
              {React.cloneElement(item.icon, { style: { fontSize: 20 } })}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
      <div className="civic-topnav-right">
        <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)} size="small">
          {darkMode ? <Brightness7 style={{ fontSize: 20 }} /> : <Brightness4 style={{ fontSize: 20 }} />}
        </IconButton>
        <IconButton color="inherit" onClick={handleLogout} size="small" title="Logout">
          <Logout style={{ fontSize: 20 }} />
        </IconButton>
        <div className="civic-topnav-profile">
          <Avatar src={user.photo || ''} style={{ width: 32, height: 32 }} />
          <div className="civic-topnav-profile-info">
            <div className="civic-topnav-profile-name">
              {user.name || 'Citizen'} 
              {user.verified && <VerifiedUser className="civic-topnav-badge" title="Verified user" />}
            </div>
            <div className="civic-topnav-profile-role">{user.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 