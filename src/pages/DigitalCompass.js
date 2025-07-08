import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Fade } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const DigitalCompass = () => {
  const navigate = useNavigate();
  const [direction, setDirection] = useState('N/A');

  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = event.alpha;
      if (alpha !== null) {
        const deg = Math.round(alpha);
        const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(deg / 45) % 8;
        setDirection(dirs[index]);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
      setDirection('Device not supported');
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url('https://i.postimg.cc/Yq51br7t/MES.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      {/* Blur Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.4)',
          zIndex: 0,
        }}
      />

      <Fade in timeout={600}>
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            p: 4,
            maxWidth: 600,
            mx: 'auto',
            textAlign: 'center',
          }}
        >
          {/* Back Button */}
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/more-functions')}
            sx={{
              mb: 3,
              bgcolor: '#ffffffdd',
              color: '#000',
              '&:hover': { bgcolor: '#ffffff' },
            }}
          >
            Back to More Functions
          </Button>

          {/* Compass Card */}
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.95)' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              🧭 Digital Compass
            </Typography>
            <Typography variant="h2" color="primary" fontWeight="bold">
              {direction}
            </Typography>
            <Typography variant="body2" mt={2}>
              Move your device to detect the direction.
            </Typography>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default DigitalCompass;
