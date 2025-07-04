import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'api/axios'; // ✅ baseURL used
import { useNavigate } from 'react-router-dom';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      return setSnackbar({
        open: true,
        message: 'Please enter a valid 6-digit OTP',
        severity: 'warning',
      });
    }

    try {
      setLoading(true);
      const email = localStorage.getItem('resetEmail');
      const res = await axios.post('/verify-otp', { email, otp });

      setSnackbar({ open: true, message: res.data.message, severity: 'success' });
      setTimeout(() => navigate('/reset-password'), 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Invalid OTP',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        🔑 Verify OTP
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter the 6-digit OTP sent to your email.
      </Typography>
      <TextField
        fullWidth
        label="Enter OTP"
        variant="outlined"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        inputProps={{ maxLength: 6 }}
        sx={{ mb: 2 }}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleVerifyOtp}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
