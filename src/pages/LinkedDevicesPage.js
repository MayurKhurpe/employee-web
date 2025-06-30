// 📁 src/pages/LinkedDevicesPage.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  CircularProgress,
  Fade,
  Button,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBack from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import axios from '../axios'; // ✅ Use centralized axios config
import { useNavigate } from 'react-router-dom';

const LinkedDevicesPage = () => {
  const [devices, setDevices] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const navigate = useNavigate();

  const fetchDevices = async () => {
    try {
      const res = await axios.get('/devices');
      setDevices(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch devices:', err);
    } finally {
      setLoadingDevices(false);
    }
  };

  const fetchSecurityLogs = async () => {
    try {
      const res = await axios.get('/security-settings');
      setSecurityLogs(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch security logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const unlinkDevice = async (id) => {
    try {
      await axios.delete(`/devices/${id}`);
      setDevices(prev => prev.filter(d => d.id !== id));
      setSnackbar({ open: true, message: '✅ Device unlinked successfully' });
    } catch (err) {
      console.error('❌ Error unlinking device:', err);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchSecurityLogs();
  }, []);

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to right, #d9a7c7, #fffcdc)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            maxWidth: 800,
            width: '100%',
            borderRadius: 5,
            backdropFilter: 'blur(10px)',
            background: 'rgba(255,255,255,0.95)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/settings')}
            sx={{
              mb: 3,
              px: 3,
              py: 1,
              fontWeight: 'bold',
              borderRadius: '999px',
              background: 'linear-gradient(to right, #667eea, #764ba2)',
              color: '#fff',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                background: 'linear-gradient(to right, #5a67d8, #6b46c1)',
              },
            }}
          >
            🔙 Back to Settings
          </Button>

          {/* Linked Devices */}
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            🔗 Linked Devices
          </Typography>

          {loadingDevices ? (
            <CircularProgress />
          ) : devices.length > 0 ? (
            <List sx={{ mb: 3 }}>
              {devices.map((device) => (
                <ListItem
                  key={device.id}
                  sx={{
                    border: '1px solid #eee',
                    borderRadius: 2,
                    mb: 2,
                    backgroundColor: '#fafafa',
                    transition: 'all 0.3s',
                    '&:hover': { boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }
                  }}
                  secondaryAction={
                    <Tooltip title="Unlink this device">
                      <IconButton edge="end" onClick={() => unlinkDevice(device.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemIcon>
                    <DevicesIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${device.name} 🖥️`}
                    secondary={`🕒 Last Active: ${device.lastActive} | 🌐 ${device.browser} | 📍 IP: ${device.ip}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No devices linked yet 📭</Typography>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Security Logs */}
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            🛡️ Security Activity Log
          </Typography>

          {loadingLogs ? (
            <CircularProgress />
          ) : securityLogs.length > 0 ? (
            <List>
              {securityLogs.map((log, index) => (
                <ListItem key={index} divider>
                  <ListItemIcon>
                    <SecurityIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`🔐 ${log.activity}`}
                    secondary={`🕒 ${log.timestamp} | 📍 IP: ${log.ip} | 🌐 ${log.browser || 'Unknown'}`}
                  />
                  <Tooltip title="Secure action logged">
                    <IconButton>
                      <LockIcon color="success" />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No recent security activity found 📭</Typography>
          )}

          {/* ✅ Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ open: false, message: '' })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="success" variant="filled">{snackbar.message}</Alert>
          </Snackbar>
        </Paper>
      </Box>
    </Fade>
  );
};

export default LinkedDevicesPage;
