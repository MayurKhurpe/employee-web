import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Fade } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BreathingExercise = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('Inhale');
  const [count, setCount] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          if (step === 'Inhale') {
            setStep('Hold');
            return 4;
          } else if (step === 'Hold') {
            setStep('Exhale');
            return 4;
          } else {
            setStep('Inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

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

          {/* Card */}
          <Paper
            elevation={6}
            sx={{
              borderRadius: 4,
              p: 4,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: 6,
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              🧘‍♀️ Breathing Exercise
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              {step}
            </Typography>
            <Typography variant="h2" fontWeight="bold">
              {count}
            </Typography>
            <Typography variant="body2" mt={2}>
              Breathe in calm, breathe out stress.
            </Typography>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default BreathingExercise;
