// 📁 src/pages/NotificationSettingsPage.js
import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Button,
  Box,
  CircularProgress,
  Fade,
  Tooltip,
  Grow,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from '../axios'; // ✅ Use centralized axios

const NotificationSettingsPage = () => {
  const [settings, setSettings] = useState({
    emailNotif: false,
    pushNotif: false,
  });

  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/notification-settings');
      setSettings({
        emailNotif: res.data.emailNotif || false,
        pushNotif: res.data.pushNotif || false,
      });
    } catch (error) {
      console.error('❌ Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    try {
      await axios.put('/notification-settings', updated);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('❌ Error saving settings:', error);
    }
  };

  const handleToggle = (key) => {
    updateSetting(key, !settings[key]);
  };

  useEffect(() => {
    fetchSettings();
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
          p: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 500,
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            textAlign: 'center',
          }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/settings')}
            variant="contained"
            sx={{
              mb: 3,
              backgroundColor: '#7b1fa2',
              color: '#fff',
              borderRadius: '30px',
              px: 3,
              py: 1,
              fontWeight: 'bold',
              fontSize: '0.9rem',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(123, 31, 162, 0.3)',
              '&:hover': {
                backgroundColor: '#6a1b9a',
                boxShadow: '0 6px 20px rgba(106, 27, 154, 0.4)',
              },
            }}
          >
            Back to Settings
          </Button>

          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            🔔 Notification Preferences
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : (
            <FormGroup>
              {[
                { key: 'emailNotif', label: '📧 Email Alerts', tip: 'Get notified by email' },
                { key: 'pushNotif', label: '🔔 Push Notifications', tip: 'Get push messages on your device' },
              ].map(({ key, label, tip }) => (
                <Grow in key={key} timeout={500}>
                  <Tooltip title={tip}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings[key]}
                          onChange={() => handleToggle(key)}
                          color="primary"
                        />
                      }
                      label={label}
                    />
                  </Tooltip>
                </Grow>
              ))}
            </FormGroup>
          )}

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
              ✅ Notification settings saved!
            </Alert>
          </Snackbar>
        </Paper>
      </Box>
    </Fade>
  );
};

export default NotificationSettingsPage;
