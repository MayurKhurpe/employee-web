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
import axios from 'axios';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        if (res.status === 200) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
        {status === 'loading' && <CircularProgress />}
        {status === 'success' && (
          <>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h5" sx={{ mt: 2 }}>
              Email Verified! 🎉
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              You can now log in to your account.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => navigate('/')}
            >
              Go to Login
            </Button>
          </>
        )}
        {status === 'error' && (
          <>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
            <Typography variant="h5" sx={{ mt: 2 }}>
              Verification Failed ❌
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Invalid or expired token.
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 3 }}
              onClick={() => navigate('/')}
            >
              Go Back
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmailPage;
