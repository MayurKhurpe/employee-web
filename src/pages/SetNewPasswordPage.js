// 📁 src/pages/SetNewPasswordPage.js

import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Box,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'api/axios'; // ✅ Use your configured axios instance

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
      const res = await axios.post('/set-new-password', {
        email,
        otp,
        newPassword,
      });
      setMsg(res.data.message);
      setOpen(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || '❌ Error resetting password');
      setOpen(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url("https://i.postimg.cc/Yq51br7t/MES.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
        }}
      />

      <Paper
        elevation={6}
        sx={{
          zIndex: 2,
          p: 4,
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.95)',
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🔒 Set New Password
        </Typography>
        <Typography variant="body2" mb={2} color="textSecondary">
          Enter a strong new password to complete the reset.
        </Typography>
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
          color="success"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleReset}
          disabled={!newPassword || newPassword.length < 6}
        >
          ✅ Save Password
        </Button>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {msg ? (
          <Alert onClose={() => setOpen(false)} severity="success">
            {msg}
          </Alert>
        ) : (
          <Alert onClose={() => setOpen(false)} severity="error">
            {error}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default SetNewPasswordPage;
