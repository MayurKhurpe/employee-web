// 📁 src/pages/Unauthorized.js
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: 'url("https://i.postimg.cc/Yq51br7t/MES.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      {/* 🌫 Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 0,
        }}
      />

      {/* ❌ Message */}
      <Paper
        elevation={10}
        sx={{
          position: 'relative',
          zIndex: 1,
          p: 4,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.95)',
        }}
      >
        <BlockIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" mb={3}>
          You are not authorized to view this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          🔙 Back to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default Unauthorized;
