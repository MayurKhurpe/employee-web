// 📁 src/pages/SecuritySettingsPage.js
import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Box,
  Button,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from '../axios'; // ✅ Centralized Axios instance

const SecuritySettingsPage = () => {
  const navigate = useNavigate();
  const [securityLogs, setSecurityLogs] = useState([]);

  const fetchSecurityLogs = async () => {
    try {
      const res = await axios.get('/security-settings');
      setSecurityLogs(res.data);
    } catch (error) {
      console.error('❌ Error fetching security settings:', error);
    }
  };

  useEffect(() => {
    fetchSecurityLogs();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 600,
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/settings')}
          variant="outlined"
          sx={{
            mb: 2,
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 600,
            px: 2,
            py: 0.5,
          }}
        >
          Back to Settings
        </Button>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          🛡️ Security Activity Log
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'gray' }}>
          Review recent login history and suspicious activities.
        </Typography>

        {securityLogs.length > 0 ? (
          <List>
            {securityLogs.map((log, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  <SecurityIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={`🔐 ${log.activity}`}
                  secondary={`🕒 ${log.timestamp} | 📍 IP: ${log.ipAddress} | 🌐 ${log.browser}`}
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
          <Typography>No recent security activity found.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default SecuritySettingsPage;
