// 📁 src/pages/LoginPage.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  IconButton,
  InputAdornment,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import axios from 'api/axios'; // ✅ updated import

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return setSnackbar({
        open: true,
        message: '❌ Please enter both email and password.',
        severity: 'error',
      });
    }

    try {
      setLoading(true);
      const res = await axios.post('/login', { email, password });

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userName', res.data.user.name);
        localStorage.setItem('userRole', res.data.user.role);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        onLogin();
        setSnackbar({ open: true, message: '✅ Login successful!', severity: 'success' });
        navigate('/dashboard');
      } else {
        setSnackbar({
          open: true,
          message: '⛔ You are not approved by admin yet.',
          severity: 'warning',
        });
      }
    } catch (err) {
      if (err?.response?.status === 403) {
        return setSnackbar({
          open: true,
          message: '⛔ You are not approved by admin yet.',
          severity: 'warning',
        });
      }

      setSnackbar({
        open: true,
        message: err?.response?.data?.error || '❌ Login failed. Try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url("https://i.postimg.cc/7Z3grwLw/MES.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 0,
        },
        px: 2,
      }}
    >
      <Box
        sx={{
          zIndex: 1,
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: 10,
          p: 5,
          width: 340,
          maxWidth: '100%',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <img
            src="https://i.postimg.cc/tCKkWL38/Company-Logo.jpg"
            alt="Company Logo"
            style={{ width: isMobile ? '80px' : '120px' }}
          />
        </Box>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Avatar sx={{ m: 'auto', bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" mt={1}>
            EMPLOYEE LOGIN
          </Typography>
        </Box>

        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          autoComplete="email"
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          required
          autoComplete="current-password"
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, py: 1.2 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : '🔓 Login'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2">
            New user 🙋‍♂️?{' '}
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => navigate('/register')}
            >
              Register here
            </span>
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, cursor: 'pointer', color: '#1976d2' }}
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
