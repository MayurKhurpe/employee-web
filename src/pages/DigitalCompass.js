import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Fade,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExploreIcon from '@mui/icons-material/Explore';
import { useNavigate } from 'react-router-dom';

const getDirection = (angle) => {
  if (angle === null) return 'N/A';
  if (angle >= 337.5 || angle < 22.5) return 'North';
  if (angle >= 22.5 && angle < 67.5) return 'North-East';
  if (angle >= 67.5 && angle < 112.5) return 'East';
  if (angle >= 112.5 && angle < 157.5) return 'South-East';
  if (angle >= 157.5 && angle < 202.5) return 'South';
  if (angle >= 202.5 && angle < 247.5) return 'South-West';
  if (angle >= 247.5 && angle < 292.5) return 'West';
  return 'North-West';
};

const DigitalCompass = () => {
  const navigate = useNavigate();
  const [heading, setHeading] = useState(null);

  useEffect(() => {
    const handleOrientation = (event) => {
      if (event.absolute && event.alpha !== null) {
        setHeading(event.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      return () => window.removeEventListener('deviceorientationabsolute', handleOrientation);
    } else {
      setHeading(null);
    }
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
      {/* Blur Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.4)',
          zIndex: 0,
        }}
      />

      {/* Back Button */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2 }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/more-functions')}
          sx={{ bgcolor: '#fff', color: '#000', '&:hover': { bgcolor: '#f5f5f5' } }}
        >
          Back to More Functions
        </Button>
      </Box>

      {/* Compass Content */}
      <Fade in timeout={600}>
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 3,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              maxWidth: 400,
              width: '100%',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <ExploreIcon sx={{ fontSize: 60, color: '#3f51b5' }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              🧭 Digital Compass
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Direction: <strong>{getDirection(heading)}</strong>
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Angle: <strong>{heading ? `${Math.round(heading)}°` : 'N/A'}</strong>
            </Typography>
            {!heading && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: 'block' }}
              >
                Compass not supported on your device/browser.
              </Typography>
            )}
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default DigitalCompass;
