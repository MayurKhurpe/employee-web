import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Fade,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { useNavigate } from 'react-router-dom';

const sampleText = `Practice makes perfect. Improve your typing speed with this simple test!`;

const TypingSpeedTest = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [completed, setCompleted] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    if (!startTime) setStartTime(Date.now());
    setInput(value);

    if (value === sampleText) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 60000;
      const words = sampleText.split(' ').length;
      setWpm(Math.round(words / timeTaken));

      const correctChars = sampleText
        .split('')
        .filter((char, i) => char === value[i]).length;
      const totalChars = sampleText.length;
      setAccuracy(Math.round((correctChars / totalChars) * 100));

      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setInput('');
    setStartTime(null);
    setWpm(null);
    setAccuracy(null);
    setCompleted(false);
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
      {/* Blur Layer */}
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
          sx={{ bgcolor: '#fff', color: '#000', '&:hover': { bgcolor: '#f5f5f5' } }}
        >
          Back to More Functions
        </Button>
      </Box>

      {/* Typing Test UI */}
      <Fade in timeout={600}>
        <Box
          sx={{
            zIndex: 1,
            position: 'relative',
            maxWidth: 700,
            mx: 'auto',
            mt: 12,
            px: 2,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.95)',
              textAlign: 'center',
            }}
          >
            <KeyboardIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              ⌨️ Typing Speed Test
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Type the following:
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontStyle: 'italic',
                mb: 2,
                backgroundColor: '#f1f1f1',
                p: 2,
                borderRadius: 2,
              }}
            >
              {sampleText}
            </Typography>

            <TextField
              multiline
              fullWidth
              rows={4}
              value={input}
              onChange={handleChange}
              disabled={completed}
              placeholder="Start typing here..."
            />

            {completed && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  🚀 WPM: <strong>{wpm}</strong> | 🎯 Accuracy: <strong>{accuracy}%</strong>
                </Typography>
                <Button variant="outlined" onClick={handleRestart}>
                  🔁 Try Again
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default TypingSpeedTest;
