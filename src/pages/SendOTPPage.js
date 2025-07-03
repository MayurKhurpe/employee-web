import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SendOTPPage() {
  const [email, setEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendOtp = async () => {
    if (!email) {
      return setSnackbar({ open: true, message: 'Please enter your registered email', severity: 'warning' });
    }

    try {
      setLoading(true);
      const res = await axios.post('https://employee-backend-kifp.onrender.com/api/send-otp', { email });
      setMaskedEmail(res.data.maskedEmail);
      localStorage.setItem('resetEmail', email);
      setSnackbar({ open: true, message: res.data.message, severity: 'success' });
      setTimer(180); // 3 minutes
      setTimeout(() => navigate('/verify-otp'), 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Failed to send OTP',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    handleSendOtp();
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        🔐 Forgot Password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter your registered email to receive OTP.
      </Typography>
      <TextField
        fullWidth
        label="Registered Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSendOtp}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Send OTP'}
      </Button>

      {maskedEmail && (
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary">
            ✅ OTP sent to: <strong>{maskedEmail}</strong>
          </Typography>
          <Button onClick={handleResendOtp} disabled={timer > 0} sx={{ mt: 1 }}>
            {timer > 0 ? `Resend OTP in ${timer}s` : '🔁 Resend OTP'}
          </Button>
        </Box>
      )}

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
