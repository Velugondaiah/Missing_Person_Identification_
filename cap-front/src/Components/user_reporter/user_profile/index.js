import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Avatar, Box, Button, Chip, Grid, Tooltip, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Email, Phone, Badge, Home, Cake, Wc, VerifiedUser, Edit, Logout } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './index.css';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!token) {
          // If no token, try to use stored user data as fallback
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setProfile(userData);
            setLoading(false);
            return;
          } else {
            setError('Not logged in.');
            setLoading(false);
            return;
          }
        }

        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setProfile(result.data.user);
            // Update stored user data with fresh data
            localStorage.setItem('user', JSON.stringify(result.data.user));
          } else {
            // If API fails, use stored user data as fallback
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              setProfile(userData);
            } else {
              setError(result.message || 'Failed to fetch profile.');
            }
          }
        } else {
          // If API fails, use stored user data as fallback
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setProfile(userData);
          } else {
            setError('Failed to fetch profile.');
          }
        }
      } catch (err) {
        // If network error, use stored user data as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setProfile(userData);
        } else {
          setError('Error fetching profile.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return (
    <Box className="profile-bg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h6" color="primary">Loading profile...</Typography>
    </Box>
  );
  
  if (error && !profile) return (
    <Box className="profile-bg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h6" color="error">{error}</Typography>
    </Box>
  );
  
  if (!profile) return null;

  return (
    <Box className="profile-bg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 1, md: 4 }, position: 'relative' }}>
      {/* Animated floating pastel shapes */}
      <div className="floating-shape shape1" />
      <div className="floating-shape shape2" />
      <div className="floating-shape shape3" />
      <div className="floating-shape shape4" />
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="profile-2col-wrapper"
      >
        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
          {/* Left column: Avatar, name, role, actions */}
          <Grid item xs={12} md={4}>
            <Card className="profile-side-card" sx={{ p: 3, borderRadius: 4, boxShadow: 6, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.92)' }}>
              <Avatar sx={{ width: 100, height: 100, mb: 2, boxShadow: 3, border: '4px solid #2d6cdf' }} src={profile.photo || ''} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{profile.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 1 }}>
                <Chip label={profile.role === 'user' ? 'Citizen' : profile.role} color="primary" size="medium" sx={{ fontWeight: 600 }} />
                {profile.verified && (
                  <Tooltip title="Verified">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                      style={{ display: 'inline-flex' }}
                    >
                      <VerifiedUser color="success" fontSize="medium" />
                    </motion.span>
                  </Tooltip>
                )}
              </Box>
              <Typography variant="caption" color={profile.verified ? 'success.main' : 'warning.main'}>
                {profile.verified ? 'Verified Citizen' : 'Verification Pending'}
              </Typography>
              <Divider sx={{ my: 2, width: '100%' }} />
              <Button fullWidth variant="outlined" startIcon={<Edit />} sx={{ mb: 1 }} onClick={() => alert('Edit profile coming soon!')}>Edit</Button>
              <Button fullWidth variant="contained" color="error" startIcon={<Logout />} sx={{ mb: 1 }} onClick={handleLogout}>Logout</Button>
              <Button fullWidth variant="text" onClick={() => navigate('/user_dashboard')}>Back to Dashboard</Button>
            </Card>
          </Grid>
          {/* Right column: Details */}
          <Grid item xs={12} md={8}>
            <Card className="profile-glass-card" sx={{ p: 3, borderRadius: 4, boxShadow: 6, bgcolor: 'rgba(255,255,255,0.85)' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2d6cdf' }}>Profile Details</Typography>
              <List>
                <ListItem>
                  <ListItemIcon><Email color="primary" /></ListItemIcon>
                  <ListItemText primary={profile.email} secondary="Email" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Phone color="primary" /></ListItemIcon>
                  <ListItemText primary={profile.phone} secondary="Phone" />
                </ListItem>
                {profile.aadhar_number && (
                  <ListItem>
                    <ListItemIcon><Badge color="primary" /></ListItemIcon>
                    <ListItemText primary={profile.aadhar_number} secondary="Aadhar Number" />
                  </ListItem>
                )}
                {profile.address && (
                  <ListItem>
                    <ListItemIcon><Home color="primary" /></ListItemIcon>
                    <ListItemText primary={profile.address} secondary="Address" />
                  </ListItem>
                )}
                {profile.date_of_birth && (
                  <ListItem>
                    <ListItemIcon><Cake color="primary" /></ListItemIcon>
                    <ListItemText primary={profile.date_of_birth} secondary="Date of Birth" />
                  </ListItem>
                )}
                {profile.gender && (
                  <ListItem>
                    <ListItemIcon><Wc color="primary" /></ListItemIcon>
                    <ListItemText primary={profile.gender} secondary="Gender" />
                  </ListItem>
                )}
                {/* Show role-specific fields */}
                {profile.badge_number && (
                  <ListItem>
                    <ListItemIcon><Badge color="primary" /></ListItemIcon>
                    <ListItemText primary={profile.badge_number} secondary="Badge Number" />
                  </ListItem>
                )}
                {profile.station_name && (
                  <ListItem>
                    <ListItemIcon><Home color="primary" /></ListItemIcon>
                    <ListItemText primary={profile.station_name} secondary="Station Name" />
                  </ListItem>
                )}
                {profile.specialization && (
                  <ListItem>
                    <ListItemIcon><Badge color="primary" /></ListItemIcon>
                    <ListItemText primary={profile.specialization} secondary="Specialization" />
                  </ListItem>
                )}
                {profile.hospital_name && (
                  <ListItem>
                    <ListItemIcon><Home color="primary" /></ListItemIcon>
                    <ListItemText primary={profile.hospital_name} secondary="Hospital Name" />
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default UserProfile;
