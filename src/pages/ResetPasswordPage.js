// 📁 src/pages/ResetPasswordPage.js
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, LockReset as ResetIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios'; // ✅ Centralized axios

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/reset-password/${token}`, { password });

      setSnackbar({ open: true, message: '✅ Password reset successful!', severity: 'success' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.error?.includes('token') || err?.message?.includes('token')
            ? '⛔ Token expired or invalid.'
            : err?.response?.data?.error || '❌ Reset failed.',
        severity: 'error',
      });
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* 🌄 Blurred background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("https://i.postimg.cc/Yq51br7t/MES.jpg")`,
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

      {/* 🔐 Reset Form */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
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
            maxWidth: 450,
            width: '100%',
            borderRadius: 4,
            backgroundColor: 'white',
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <ResetIcon color="primary" />
            <Typography variant="h5" fontWeight="bold">
              🔑 Reset Your Password
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Choose a new strong password you'll remember.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ position: 'relative' }}>
              <TextField
                label="🆕 New Password"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <IconButton
                onClick={() => setShow(!show)}
                sx={{ position: 'absolute', right: 10, top: '32px' }}
              >
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 2, py: 1.2 }}
              disabled={!password || password.length < 6}
            >
              🔒 Reset Password
            </Button>
          </form>
        </Paper>
      </Box>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
