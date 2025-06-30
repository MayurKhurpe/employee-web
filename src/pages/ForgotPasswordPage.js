// 📁 src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import { Link } from 'react-router-dom';
import axios from '../api/axios'; // ✅ Updated import

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/forgot-password', { email });

      setSnackbar({
        open: true,
        message: '✅ Reset link sent! Check your email.',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.error || '❌ Failed to send reset email.',
        severity: 'error',
      });
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* 🌄 Blurred Background Image */}
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
      {/* 🔳 Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 1,
        }}
      />

      {/* 📦 Form Card */}
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
            <EmailIcon color="primary" />
            <Typography variant="h5" fontWeight="bold">
              Forgot Password 🤔
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Enter your registered email and we'll send you a reset link.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="📧 Email Address"
              fullWidth
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.2 }}
            >
              📬 Send Reset Link
            </Button>
          </form>

          <Box mt={3}>
            <Button
              component={Link}
              to="/"
              fullWidth
              startIcon={<ArrowBackIcon />}
              sx={{
                backgroundColor: '#555',
                color: '#fff',
                '&:hover': { backgroundColor: 'blue' },
              }}
            >
              Back to Login
            </Button>

            <Button
              component={Link}
              to="/settings"
              fullWidth
              sx={{ mt: 1 }}
            >
              ⚙️ Back to Settings
            </Button>
          </Box>
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
          sx={{ width: '100%' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
