import React, { useEffect, useState } from 'react';
import { Avatar, Card, CardContent, Typography, Grid, IconButton, Drawer, List, ListItem, ListItemIcon, AppBar, Toolbar, Box, Divider } from '@mui/material';
import { Dashboard, Person, Message, Settings, Notifications, Logout, Brightness4, Brightness7, VerifiedUser, DocumentScanner, AddCircle, History, CheckCircle, LocalHospital } from '@mui/icons-material';
import './index.css';

const actions = [
  { label: 'Scan Document', icon: <DocumentScanner color="primary" />, onClick: () => alert('Scan Document') },
  { label: 'Add Newborn', icon: <AddCircle color="primary" />, onClick: () => alert('Add Newborn') },
];

const analytics = [
  { label: 'Patients Treated', value: 34, icon: <LocalHospital color="primary" /> },
  { label: 'Appointments', value: 8, icon: <CheckCircle color="success" /> },
];

const recentActivity = [
  { type: 'Appointment', desc: 'Consulted patient John Doe', time: '1h ago' },
  { type: 'Newborn', desc: 'Added newborn record', time: '5h ago' },
  { type: 'Document', desc: 'Scanned birth certificate', time: '2d ago' },
];

const navItems = [
  { label: 'Dashboard', icon: <Dashboard /> },
  { label: 'Profile', icon: <Person /> },
  { label: 'Patients', icon: <LocalHospital /> },
  { label: 'Messages', icon: <Message /> },
  { label: 'Settings', icon: <Settings /> },
];

const DoctorDashboard = ({ onNavigate }) => {
  const [user, setUser] = useState({ name: '', role: 'Doctor', verified: true });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    if (u) setUser({ ...u, role: 'Doctor', verified: u.verified });
  }, []);

  return (
    <Box sx={{ display: 'flex', bgcolor: darkMode ? '#181c24' : '#f4f6fa', minHeight: '100vh' }}>
      {/* Side Nav */}
      <Drawer
        variant="permanent"
        sx={{
          width: 80,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 80, boxSizing: 'border-box', bgcolor: darkMode ? '#23272f' : '#fff' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {navItems.map((item, idx) => (
              <ListItem button key={item.label} onClick={() => onNavigate && onNavigate(item.label.toLowerCase())}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 3 } }}>
        {/* AppBar */}
        <AppBar position="static" color={darkMode ? 'default' : 'primary'} elevation={0} sx={{ bgcolor: darkMode ? '#23272f' : '#1e9c6c', color: '#fff', borderRadius: 2, mb: 2 }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap component="div">Doctor Dashboard</Typography>
            <Box>
              <IconButton color="inherit"><Notifications /></IconButton>
              <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <IconButton color="inherit" onClick={() => alert('Logout')}><Logout /></IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {/* Profile Overview */}
        <Card sx={{ mb: 3, p: 2, display: 'flex', alignItems: 'center', bgcolor: darkMode ? '#23272f' : '#fff' }}>
          <Avatar sx={{ width: 64, height: 64, mr: 2 }} src={user.photo || ''} />
          <Box>
            <Typography variant="h6">{user.name || 'Doctor'}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">{user.role}</Typography>
              {user.verified && <VerifiedUser color="success" fontSize="small" titleAccess="Verified" />}
            </Box>
            <Typography variant="caption" color={user.verified ? 'success.main' : 'warning.main'}>
              {user.verified ? 'Verified Doctor' : 'Verification Pending'}
            </Typography>
          </Box>
        </Card>
        {/* Quick Actions & Analytics */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {actions.map((action, idx) => (
            <Grid item xs={6} sm={3} key={action.label}>
              <Card onClick={action.onClick} sx={{ cursor: 'pointer', textAlign: 'center', p: 2, bgcolor: darkMode ? '#23272f' : '#f0f4ff', '&:hover': { boxShadow: 6, bgcolor: darkMode ? '#23272f' : '#e6f0ff' } }}>
                <CardContent>
                  {action.icon}
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>{action.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {analytics.map((widget, idx) => (
            <Grid item xs={6} sm={3} key={widget.label}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: darkMode ? '#23272f' : '#fff' }}>
                <CardContent>
                  {widget.icon}
                  <Typography variant="h5" sx={{ mt: 1 }}>{widget.value}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">{widget.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* Recent Activity */}
        <Card sx={{ bgcolor: darkMode ? '#23272f' : '#fff' }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Recent Activity</Typography>
            <Divider sx={{ mb: 1 }} />
            {recentActivity.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <History sx={{ mr: 1, color: '#1e9c6c' }} />
                <Typography variant="body2">{item.desc}</Typography>
                <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>{item.time}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
