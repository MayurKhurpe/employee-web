// 📁 src/pages/admin/AdminSettingsPage.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  TextField,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { ArrowBack, Sync, CalendarToday } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'api/axios'; // ✅ centralized axios

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [officeHours, setOfficeHours] = useState({ start: '09:00', end: '18:00' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // ✅ Update Email to backend
  const handleUpdateEmail = async () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      return showSnackbar('⚠️ Please enter a valid email address.', 'warning');
    }
    try {
      await axios.put('/admin/settings/email', { email }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSnackbar(`📧 Email updated to: ${email}`, 'success');
    } catch {
      showSnackbar('❌ Failed to update email.', 'error');
    }
  };

  // ✅ Update Mobile to backend
  const handleUpdateMobile = async () => {
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobile.trim() || !mobileRegex.test(mobile)) {
      return showSnackbar('⚠️ Enter valid 10-digit mobile number.', 'warning');
    }
    try {
      await axios.put('/admin/settings/mobile', { mobile }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSnackbar(`📱 Mobile updated to: ${mobile}`, 'success');
    } catch {
      showSnackbar('❌ Failed to update mobile number.', 'error');
    }
  };

  const handleOfficeHourChange = (e) => {
    const { name, value } = e.target;
    setOfficeHours((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Sync Company Data
  const handleSync = async () => {
    try {
      await axios.get('/admin/sync', {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSnackbar('🔄 Company data synced successfully.', 'success');
    } catch {
      showSnackbar('❌ Sync failed.', 'error');
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #e0f7fa, #eceff1)',
      }}
    >
      {/* 🔙 Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/admin')}
        sx={{
          mb: 2,
          px: 2.5,
          py: 1.2,
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #7b1fa2, #ba68c8)',
          color: '#fff',
          borderRadius: 2,
          '&:hover': {
            background: 'linear-gradient(90deg, #6a1b9a, #ab47bc)',
          },
        }}
      >
        Back to Admin Panel
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#4a148c' }}>
        ⚙️ Admin Settings
      </Typography>

      <Paper
        elevation={4}
        sx={{
          mt: 2,
          p: 4,
          borderRadius: 3,
          backgroundColor: '#ffffffdd',
          backdropFilter: 'blur(6px)',
        }}
      >
        {/* 📧 Update Email */}
        <Typography variant="subtitle1" fontWeight="bold">
          📧 Update Email
        </Typography>
        <Stack direction="row" spacing={2} mt={1}>
          <TextField
            label="New Email"
            type="email"
            size="small"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="contained" onClick={handleUpdateEmail}>
            Update
          </Button>
        </Stack>

        {/* 📱 Update Mobile */}
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            📱 Update Mobile Number
          </Typography>
          <Stack direction="row" spacing={2} mt={1}>
            <TextField
              label="New Mobile Number"
              type="tel"
              size="small"
              fullWidth
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <Button variant="contained" onClick={handleUpdateMobile}>
              Update
            </Button>
          </Stack>
        </Box>

        {/* 🔔 Notifications Toggle */}
        <Box mt={4}>
          <FormControlLabel
            control={
              <Switch
                checked={notificationsEnabled}
                onChange={() => {
                  setNotificationsEnabled((prev) => !prev);
                  showSnackbar(
                    !notificationsEnabled
                      ? '🔔 Notifications enabled'
                      : '🔕 Notifications disabled',
                    'info'
                  );
                }}
              />
            }
            label="System Notifications"
          />
        </Box>

        {/* 🕒 Office Hours */}
        <Box mt={4}>
          <Typography variant="subtitle1" fontWeight="bold">
            🕒 Office Hours
          </Typography>
          <Stack direction="row" spacing={2} mt={1}>
            <TextField
              type="time"
              label="Start Time"
              name="start"
              value={officeHours.start}
              onChange={handleOfficeHourChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="time"
              label="End Time"
              name="end"
              value={officeHours.end}
              onChange={handleOfficeHourChange}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </Box>

        {/* 🔄 Sync + Holidays */}
        <Box mt={4}>
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<Sync />}
              variant="outlined"
              onClick={handleSync}
              sx={{
                background: '#e0e0e0',
                fontWeight: 'bold',
                '&:hover': { background: '#d6d6d6' },
              }}
            >
              Sync Company Data
            </Button>

            <Button
              startIcon={<CalendarToday />}
              variant="contained"
              onClick={() => navigate('/admin/holidays')}
              sx={{
                background: 'linear-gradient(to right, #26c6da, #00acc1)',
                color: '#fff',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(to right, #00bcd4, #00838f)',
                },
              }}
            >
              Manage Holidays
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminSettingsPage;
