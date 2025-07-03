// 📁 src/pages/SetNewPasswordPage.js

import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Snackbar, Alert
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SetNewPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {};

  const handleReset = async () => {
    try {
      const res = await axios.post('/api/reset-password-otp', {
        email,
        otp,
        newPassword,
      });
      setMsg(res.data.message);
      setOpen(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error resetting password');
      setOpen(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom>🔒 Set New Password</Typography>
      <TextField
        label="New Password"
        fullWidth
        margin="normal"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleReset}
      >
        Save Password
      </Button>

      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        {msg ? (
          <Alert onClose={() => setOpen(false)} severity="success">{msg}</Alert>
        ) : (
          <Alert onClose={() => setOpen(false)} severity="error">{error}</Alert>
        )}
      </Snackbar>
    </Container>
  );
};

export default SetNewPasswordPage;
