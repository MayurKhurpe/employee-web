import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Fade,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const sampleText = `Practice typing quickly and accurately to boost your typing speed and productivity.`;

const TypingSpeedTest = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const inputRef = useRef();

  const handleChange = (e) => {
    if (!startTime) setStartTime(Date.now());
    setInput(e.target.value);
    if (e.target.value === sampleText) setEndTime(Date.now());
  };

  const calculateWPM = () => {
    if (!startTime || !endTime) return 0;
    const minutes = (endTime - startTime) / 60000;
    return Math.round(sampleText.split(' ').length / minutes);
  };

  const reset = () => {
    setInput('');
    setStartTime(null);
    setEndTime(null);
    inputRef.current.focus();
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
            maxWidth: 700,
            mx: 'auto',
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

          {/* Typing Card */}
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.95)' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              ⌨️ Typing Speed Test
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {sampleText}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              inputRef={inputRef}
              value={input}
              onChange={handleChange}
              placeholder="Start typing here..."
              disabled={!!endTime}
              sx={{ mb: 2 }}
            />
            {endTime && (
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Your speed: {calculateWPM()} WPM 🚀
              </Typography>
            )}
            <Button variant="outlined" onClick={reset}>
              Reset
            </Button>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default TypingSpeedTest;
