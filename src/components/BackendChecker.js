// 📁 src/components/BackendChecker.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, Button, Box } from '@mui/material';

const BackendChecker = ({ onReady }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const checkBackend = async () => {
    try {
      setLoading(true);
      setError(false);
      await axios.get('https://employee-backend-kifp.onrender.com/api/ping'); // ✅ Your backend
      setLoading(false);
      onReady(); // notify App.js
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>Connecting to backend...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6" color="error">🙆‍♂️ Patience Buddy, Server is starting or offline⚠️.</Typography>
        <Button variant="contained" onClick={checkBackend} sx={{ mt: 2 }}>
          🔁 Retry after some times ✌🏻
        </Button>
      </Box>
    );
  }

  return null; // backend is ready
};

export default BackendChecker;
