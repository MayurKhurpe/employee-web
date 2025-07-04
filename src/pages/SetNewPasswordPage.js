import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Box,
  InputAdornment,
  IconButton,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, LockReset } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'api/axios';

const SetNewPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const email = localStorage.getItem('resetEmail');
  const otp = localStorage.getItem('resetOTP');

  useEffect(() => {
    if (!email || !otp) {
      navigate('/');
    }
  }, [email, otp, navigate]);

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setMsg('');
      setOpen(true);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/set-new-password', {
        email,
        otp,
        newPassword,
      });

      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetOTP');

      setMsg(res.data.message);
      setError('');
      setOpen(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || '❌ Error resetting password');
      setMsg('');
      setOpen(true);
    } finally {
      setLoading(false);
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
          type={showPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {newPassword && (
          <Box sx={{ mt: 1, mb: 2 }}>
            <Typography variant="caption">Password strength</Typography>
            <LinearProgress
              variant="determinate"
              value={getPasswordStrength(newPassword) * 25}
              color={
                getPasswordStrength(newPassword) < 2
                  ? 'error'
                  : getPasswordStrength(newPassword) < 4
                  ? 'warning'
                  : 'success'
              }
            />
          </Box>
        )}

        <TextField
          label="Confirm Password"
          fullWidth
          margin="normal"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleReset}
          disabled={!newPassword || newPassword.length < 6 || !confirmPassword || loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LockReset />}
        >
          {loading ? 'Saving...' : '✅ Save Password'}
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
