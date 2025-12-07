import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Avatar, Box, Button, Chip, Grid, Tooltip, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Email, Phone, Badge, VerifiedUser, Edit, Logout, LocationOn, Gavel, AccountBalance } from '@mui/icons-material';
import { motion } from 'framer-motion';
import './index.css';

const PoliceProfile = ({ onNavigate }) => {
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
    <Box className="profile-bg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 1, md: 4 } }}>
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
              <Avatar sx={{ width: 100, height: 100, mb: 2, boxShadow: 3, border: '4px solid #e67e22' }} src={profile.photo || ''} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{profile.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 1 }}>
                <Chip label="Police Officer" color="warning" size="medium" sx={{ fontWeight: 600 }} />
                {profile.verified ? (
                  <Tooltip title="Verified">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                      style={{ display: 'inline-flex' }}
                    >
                      <VerifiedUser color="success" fontSize="medium" />
                    </motion.span>
                  </Tooltip>
                ) : (
                  <Tooltip title="Pending Verification">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                      style={{ display: 'inline-flex' }}
                    >
                      <VerifiedUser color="warning" fontSize="medium" />
                    </motion.span>
                  </Tooltip>
                )}
              </Box>
              <Typography variant="caption" color={profile.verified ? 'success.main' : 'warning.main'}>
                {profile.verified ? 'Verified Police Officer' : 'Verification Pending'}
              </Typography>
              <Divider sx={{ my: 2, width: '100%' }} />
              <Button fullWidth variant="outlined" startIcon={<Edit />} sx={{ mb: 1 }} onClick={() => alert('Edit profile coming soon!')}>Edit</Button>
              <Button fullWidth variant="contained" color="error" startIcon={<Logout />} sx={{ mb: 1 }} onClick={() => { localStorage.clear(); window.location.reload(); }}>Logout</Button>
              <Button fullWidth variant="text" onClick={() => onNavigate && onNavigate('police_dashboard')}>Back to Dashboard</Button>
            </Card>
          </Grid>
          {/* Right column: Details */}
          <Grid item xs={12} md={8}>
            <Card className="profile-glass-card" sx={{ p: 3, borderRadius: 4, boxShadow: 6, bgcolor: 'rgba(255,255,255,0.85)' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#e67e22' }}>Profile Details</Typography>
              <List>
                <ListItem>
                  <ListItemIcon><Email color="warning" /></ListItemIcon>
                  <ListItemText primary={profile.email} secondary="Email" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Phone color="warning" /></ListItemIcon>
                  <ListItemText primary={profile.phone} secondary="Phone" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Badge color="warning" /></ListItemIcon>
                  <ListItemText primary={profile.badge_number} secondary="Badge Number" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><AccountBalance color="warning" /></ListItemIcon>
                  <ListItemText primary={profile.station_name} secondary="Station Name" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><LocationOn color="warning" /></ListItemIcon>
                  <ListItemText primary={profile.jurisdiction_area} secondary="Jurisdiction Area" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Gavel color="warning" /></ListItemIcon>
                  <ListItemText primary={profile.rank} secondary="Rank" />
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default PoliceProfile;
