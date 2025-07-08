import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';

export default function DigitalCompass() {
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const handleOrientation = (event) => {
      if (event.alpha != null) {
        setDirection(Math.round(event.alpha));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>🧭 Digital Compass</Typography>
      <ExploreIcon sx={{ fontSize: 100, transform: `rotate(${direction}deg)` }} color="primary" />
      <Typography variant="h6">Heading: {direction}°</Typography>
    </Box>
  );
}
