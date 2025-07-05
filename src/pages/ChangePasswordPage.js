// 📁 src/pages/ChangePassword.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import axios from 'api/axios'; // ✅ centralized instance

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const res = await axios.post('/auth/change-password',
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage('✅ Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.response?.data?.error || err.message || '❌ Something went wrong');
      setSnackbarOpen(true);
    }
  };

  const isValidPassword = (pwd) => pwd.length >= 6;

  const getStrength = (pwd) => {
    if (pwd.length < 6) return 0;
    if (pwd.length < 8) return 40;
    if (!/[A-Z]/.test(pwd) || !/\d/.test(pwd)) return 60;
    return 100;
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* 🔵 Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(https://i.postimg.cc/Yq51br7t/MES.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(12px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            maxWidth: 450,
            width: '100%',
            borderRadius: 4,
            backgroundColor: 'white',
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <LockIcon color="primary" />
            <Typography variant="h5" fontWeight="bold">
              🔐 Change Password
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              label="🔑 Current Password"
              type={showCurrent ? 'text' : 'password'}
              fullWidth
              required
              margin="normal"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCurrent(!showCurrent)}>
                      {showCurrent ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="🆕 New Password"
              type={showNew ? 'text' : 'password'}
              fullWidth
              required
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={newPassword && !isValidPassword(newPassword)}
              helperText={
                newPassword && !isValidPassword(newPassword)
                  ? 'Password must be at least 6 characters'
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNew(!showNew)}>
                      {showNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {newPassword && (
              <Box sx={{ my: 1 }}>
                <Typography variant="caption">Password Strength</Typography>
                <LinearProgress
                  variant="determinate"
                  value={getStrength(newPassword)}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    mt: 0.5,
                    backgroundColor: '#ddd',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor:
                        getStrength(newPassword) < 50 ? 'red' : 'green',
                    },
                  }}
                />
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.2, fontWeight: 'bold' }}
              disabled={
                !currentPassword || !newPassword || !isValidPassword(newPassword)
              }
            >
              🔄 Update Password
            </Button>
          </form>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/settings')}
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#555',
              color: '#fff',
              '&:hover': { backgroundColor: '#1976d2' },
            }}
          >
            Back to Settings
          </Button>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={message ? 'success' : 'error'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {message || error}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
