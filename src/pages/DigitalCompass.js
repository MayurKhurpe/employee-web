import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const DigitalCompass = () => {
  const navigate = useNavigate();
  const [angle, setAngle] = useState(null);
  const [direction, setDirection] = useState('N/A');
  const [supported, setSupported] = useState(true);

  const getDirection = (deg) => {
    if (deg >= 337.5 || deg < 22.5) return 'N';
    if (deg >= 22.5 && deg < 67.5) return 'NE';
    if (deg >= 67.5 && deg < 112.5) return 'E';
    if (deg >= 112.5 && deg < 157.5) return 'SE';
    if (deg >= 157.5 && deg < 202.5) return 'S';
    if (deg >= 202.5 && deg < 247.5) return 'SW';
    if (deg >= 247.5 && deg < 292.5) return 'W';
    if (deg >= 292.5 && deg < 337.5) return 'NW';
    return 'N/A';
  };

  useEffect(() => {
    const handleOrientation = (e) => {
      if (typeof e.alpha === 'number') {
        const deg = Math.round(e.alpha);
        setAngle(deg);
        setDirection(getDirection(deg));
      } else {
        setSupported(false);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
      setSupported(false);
    }

    return () => {
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
        px: 2,
        py: 4,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/more-functions')}
          sx={{
            bgcolor: '#fff',
            color: '#000',
            '&:hover': { bgcolor: '#eee' },
          }}
        >
          Back to More Functions
        </Button>
      </Box>

      <Paper
        elevation={6}
        sx={{
          mt: 10,
          maxWidth: 400,
          mx: 'auto',
          p: 4,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.95)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          🧭 Digital Compass
        </Typography>

        {supported && angle !== null ? (
          <>
            <Typography variant="h5" gutterBottom>
              Direction: <strong>{direction}</strong>
            </Typography>
            <Typography variant="h6">Angle: {angle}°</Typography>
          </>
        ) : (
          <Typography color="error" mt={2}>
            Compass not supported on your device/browser.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DigitalCompass;
