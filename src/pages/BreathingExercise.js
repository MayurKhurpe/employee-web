import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Fade, Zoom } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const steps = ['Inhale', 'Hold', 'Exhale'];
const durations = { Inhale: 4, Hold: 4, Exhale: 4 };

const BreathingExercise = () => {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [count, setCount] = useState(durations[steps[0]]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev === 1) {
          const nextStep = (stepIndex + 1) % steps.length;
          setStepIndex(nextStep);
          return durations[steps[nextStep]];
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stepIndex]);

  const currentStep = steps[stepIndex];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url('https://i.postimg.cc/Yq51br7t/MES.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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

      {/* Back Button */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2 }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/more-functions')}
          sx={{
            bgcolor: '#ffffffdd',
            color: '#000',
            '&:hover': { bgcolor: '#ffffff' },
          }}
        >
          Back to More Functions
        </Button>
      </Box>

      {/* Main Card */}
      <Fade in timeout={600}>
        <Paper
          elevation={6}
          sx={{
            borderRadius: 6,
            px: 6,
            py: 5,
            zIndex: 1,
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🧘‍♂️ Breathing Exercise
          </Typography>

          <Zoom key={currentStep} in>
            <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              {currentStep}
            </Typography>
          </Zoom>

          <Zoom key={count} in>
            <Typography variant="h1" fontWeight="bold">
              {count}
            </Typography>
          </Zoom>

          <Typography variant="body2" mt={2}>
            Inhale calmness, exhale tension.
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default BreathingExercise;
