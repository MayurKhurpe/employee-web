import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function BreathingExercise() {
  const [step, setStep] = useState('Ready?');
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const steps = ['Inhale 🫁', 'Hold ✋', 'Exhale 💨'];
    let i = 0;

    const interval = setInterval(() => {
      setStep(steps[i]);
      i = (i + 1) % steps.length;
    }, 4000);

    return () => clearInterval(interval);
  }, [running]);

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🧘‍♀️ Breathing Exercise
      </Typography>
      <Typography variant="h5" color="primary" sx={{ my: 3 }}>
        {step}
      </Typography>
      <Button variant="contained" onClick={() => setRunning(!running)}>
        {running ? 'Stop' : 'Start'}
      </Button>
    </Box>
  );
}
