import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import UserDashboard from './Components/user_reporter/user_dashboard';
import DoctorDashboard from './Components/doctor/doctor_dashboard';
import PoliceDashboard from './Components/police/police_station_dashboard';
import UserProfile from './Components/user_reporter/user_profile';
import DoctorProfile from './Components/doctor/doctor_profile';
import PoliceProfile from './Components/police/police_station_details';
import UserReportMissing from './Components/user_reporter/user_report_missing';
import UserHistory from './Components/user_reporter/user_history';
import UserAsReporter from './Components/user_reporter/user_as_reporter'; // Add this import
import Navbar from './Components/shared/Navbar';


function App() {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = () => {
    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (user && token) {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
        setIsAuthenticated(true);
      } else if (user) {
        // If user exists but no token, still consider authenticated (for demo purposes)
        const userData = JSON.parse(user);
        setUserRole(userData.role);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  // Layout wrapper that includes navbar
  const LayoutWithNavbar = ({ children, userRole }) => {
    return (
      <div className="app-layout">
        <Navbar userRole={userRole} onLogout={handleLogout} />
        <div className="app-content">
          {children}
        </div>
      </div>
    );
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <div className="page-transition">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={
              isAuthenticated ? 
                <Navigate to={userRole === 'user' ? '/user_dashboard' : userRole === 'doctor' ? '/doctor_dashboard' : '/police_dashboard'} /> :
                <LoginWithRedirect setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />
            } />
            <Route path="/signup" element={
              isAuthenticated ? 
                <Navigate to={userRole === 'user' ? '/user_dashboard' : userRole === 'doctor' ? '/doctor_dashboard' : '/police_dashboard'} /> :
                <SignupWithRedirect />
            } />
            
            {/* Protected Routes */}
            <Route path="/user_dashboard" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                <LayoutWithNavbar userRole={userRole}>
                  <UserDashboard />
                </LayoutWithNavbar>
              </ProtectedRoute>
            } />
            
            <Route path="/doctor_dashboard" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                <LayoutWithNavbar userRole={userRole}>
                  <DoctorDashboard />
                </LayoutWithNavbar>
              </ProtectedRoute>
            } />
            
            <Route path="/police_dashboard" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                <LayoutWithNavbar userRole={userRole}>
                  <PoliceDashboard />
                </LayoutWithNavbar>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                <LayoutWithNavbar userRole={userRole}>
                  <ProfileWithNav userRole={userRole} />
                </LayoutWithNavbar>
              </ProtectedRoute>
            } />
            
            <Route path="/report_missing" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                <LayoutWithNavbar userRole={userRole}>
                  <UserReportMissing />
                </LayoutWithNavbar>
              </ProtectedRoute>
            } />
            
            <Route path="/user_history" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                <LayoutWithNavbar userRole={userRole}>
                  <UserHistory />
                </LayoutWithNavbar>
              </ProtectedRoute>
            } />
            
            {/* Add this new route for the upload sighting page */}
            <Route path="/upload_sighting" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                <LayoutWithNavbar userRole={userRole}>
                  <UserAsReporter />
                </LayoutWithNavbar>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Protected Route Component
function ProtectedRoute({ children, isAuthenticated, userRole }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Wrappers to inject navigation
function LoginWithRedirect({ setUserRole, setIsAuthenticated }) {
  const navigate = useNavigate();
  return <Login onNavigate={page => {
    if (page === 'signup') navigate('/signup');
    else if (page === 'profile') navigate('/profile');
    else if (page === 'user_dashboard') {
      navigate('/user_dashboard');
      // Update authentication state after successful login
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
        setIsAuthenticated(true);
      }
    }
    else if (page === 'doctor_dashboard') {
      navigate('/doctor_dashboard');
      // Update authentication state after successful login
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
        setIsAuthenticated(true);
      }
    }
    else if (page === 'police_dashboard') {
      navigate('/police_dashboard');
      // Update authentication state after successful login
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
        setIsAuthenticated(true);
      }
    }
    else navigate('/login');
  }} />;
}

function SignupWithRedirect() {
  const navigate = useNavigate();
  return <Signup onNavigate={page => {
    if (page === 'login') {
      navigate('/login');
    }
  }} />;
}

function ProfileWithNav({ userRole }) {
  if (userRole === 'user') {
    return <UserProfile />;
  }
  if (userRole === 'doctor') {
    return <DoctorProfile />;
  }
  if (userRole === 'police') {
    return <PoliceProfile />;
  }
  return <Navigate to="/login" />;
}

export default App;
