import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Avatar, Box, Button, Chip, Stack, Divider, List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { Email, Phone, LocalHospital, VerifiedUser, Edit, Logout, Badge, LocationOn, Business } from '@mui/icons-material';
import { motion } from 'framer-motion';
import './index.css';

const DoctorProfile = ({ onNavigate }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not logged in.');
          setLoading(false);
          return;
        }
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const result = await response.json();
        if (result.success) {
          setProfile(result.data.user);
        } else {
          setError(result.message || 'Failed to fetch profile.');
        }
      } catch (err) {
        setError('Error fetching profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!profile) return null;

  return (
    <Box className="modern-profile-bg">
      <Box className="modern-profile-banner">
        <div className="modern-profile-banner-gradient" />
      </Box>
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="modern-profile-wrapper"
      >
        <Box className="modern-profile-avatar-box">
          <motion.div
            initial={{ boxShadow: '0 0 0 0 #1e9c6c44' }}
            animate={{ boxShadow: '0 0 0 8px #1e9c6c22, 0 4px 32px #1e9c6c33' }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
            style={{ borderRadius: '50%' }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                border: '5px solid #1e9c6c',
                boxShadow: '0 4px 24px #1e9c6c33',
                background: '#fff'
              }}
              src={profile.photo || ''}
            />
          </motion.div>
        </Box>
        <Card className="modern-profile-card" sx={{ mt: 10, p: 4, borderRadius: 5, boxShadow: 8, maxWidth: 600, mx: 'auto', position: 'relative' }}>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              {profile.name}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
              <Chip label="Doctor" color="success" size="medium" sx={{ fontWeight: 600 }} />
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
            </Stack>
            <Typography variant="caption" color={profile.verified ? 'success.main' : 'warning.main'} sx={{ mt: 1 }}>
              {profile.verified ? 'Verified Doctor' : 'Verification Pending'}
            </Typography>
          </Box>
          <Divider sx={{ my: 3 }} />
          <List>
            <ListItem>
              <ListItemIcon><Email color="success" /></ListItemIcon>
              <ListItemText primary={profile.email} secondary="Email" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Phone color="success" /></ListItemIcon>
              <ListItemText primary={profile.phone} secondary="Phone" />
            </ListItem>
            <ListItem>
              <ListItemIcon><LocalHospital color="success" /></ListItemIcon>
              <ListItemText primary={profile.specialization} secondary="Specialization" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Badge color="success" /></ListItemIcon>
              <ListItemText primary={profile.license_number} secondary="License Number" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Business color="success" /></ListItemIcon>
              <ListItemText primary={profile.hospital_name} secondary="Hospital Name" />
            </ListItem>
            <ListItem>
              <ListItemIcon><LocationOn color="success" /></ListItemIcon>
              <ListItemText primary={profile.location} secondary="Location" />
            </ListItem>
          </List>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }} justifyContent="center">
            <Button variant="outlined" startIcon={<Edit />} onClick={() => alert('Edit profile coming soon!')}>Edit</Button>
            <Button variant="contained" color="error" startIcon={<Logout />} onClick={() => { localStorage.clear(); window.location.reload(); }}>Logout</Button>
            <Button variant="text" onClick={() => onNavigate && onNavigate('doctor_dashboard')}>Back to Dashboard</Button>
          </Stack>
        </Card>
      </motion.div>
    </Box>
  );
};

export default DoctorProfile;

