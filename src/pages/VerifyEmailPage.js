// 📁 src/pages/VerifyEmailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import axios from 'api/axios'; // ✅ Use your axios base instance

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`/verify-email/${token}`);
        setStatus(res.status === 200 ? 'success' : 'error');
      } catch (err) {
        setStatus('error');
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          maxWidth: 420,
          width: '100%',
          borderRadius: 3,
          textAlign: 'center',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}
      >
        {status === 'loading' && (
          <>
            <CircularProgress color="primary" />
            <Typography mt={2}>Verifying your email...</Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'green' }} />
            <Typography variant="h5" mt={2} fontWeight="bold">
              Email Verified! 🎉
            </Typography>
            <Typography variant="body1" mt={1}>
              Your email has been successfully verified. You can now log in.
            </Typography>
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 3 }}
              onClick={() => navigate('/')}
            >
              🔐 Go to Login
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorOutlineIcon sx={{ fontSize: 64, color: 'red' }} />
            <Typography variant="h5" mt={2} fontWeight="bold">
              Verification Failed ❌
            </Typography>
            <Typography variant="body2" mt={1}>
              The verification link is invalid or has expired.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 3 }}
              onClick={() => navigate('/')}
            >
              🔙 Back to Home
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmailPage;
