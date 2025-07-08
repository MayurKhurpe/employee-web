import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Paper, Fade } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const steps = ['Inhale 🫁', 'Hold ✋', 'Exhale 💨'];

const BreathingExercise = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [count, setCount] = useState(4);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          const nextStep = (stepIndex + 1) % steps.length;
          setStepIndex(nextStep);
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [active, stepIndex]);

  const handleStart = () => {
    setActive(true);
    setStepIndex(0);
    setCount(4);
  };

  const handleStop = () => {
    setActive(false);
    clearInterval(intervalRef.current);
    setStepIndex(0);
    setCount(4);
  };

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
      {/* Blur overlay */}
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

      <Fade in timeout={500}>
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            p: 4,
            maxWidth: 500,
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

          {/* Breathing Card */}
          <Paper
            elevation={6}
            sx={{
              borderRadius: 4,
              p: 4,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: 6,
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              🧘 Breathing Exercise
            </Typography>

            {active ? (
              <>
                <Typography variant="h5" color="primary" gutterBottom>
                  {steps[stepIndex]}
                </Typography>
                <Typography variant="h2" fontWeight="bold">
                  {count}
                </Typography>
                <Button variant="outlined" onClick={handleStop} sx={{ mt: 3 }}>
                  ⏹ Stop
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Press start and follow the breathing pattern.
                </Typography>
                <Button variant="contained" onClick={handleStart}>
                  ▶️ Start
                </Button>
              </>
            )}
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default BreathingExercise;
