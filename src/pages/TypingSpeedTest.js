import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  Fade,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const sampleText = `Practice makes perfect. Improve your typing speed with this simple test!`;

const TypingSpeedTest = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (input.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    if (input === sampleText) {
      const endTime = Date.now();
      const timeInMinutes = (endTime - startTime) / 60000;
      const wordCount = sampleText.trim().split(/\s+/).length;
      const correctChars = [...input].filter((char, idx) => char === sampleText[idx]).length;
      const totalChars = sampleText.length;

      setWpm(Math.round(wordCount / timeInMinutes));
      setAccuracy(Math.round((correctChars / totalChars) * 100));
      setIsFinished(true);
    }
  }, [input]);

  const handleRestart = () => {
    setInput('');
    setWpm(0);
    setAccuracy(100);
    setStartTime(null);
    setIsFinished(false);
    inputRef.current.focus();
  };

  const renderLiveText = () => {
    return [...sampleText].map((char, idx) => {
      let color = '';
      if (idx < input.length) {
        color = input[idx] === char ? '#4caf50' : '#f44336';
      }
      return (
        <span key={idx} style={{ color }}>{char}</span>
      );
    });
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
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.3)',
          zIndex: 0,
        }}
      />

      {/* Back Button */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2 }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/more-functions')}
          sx={{ bgcolor: '#fff', color: '#000', '&:hover': { bgcolor: '#eee' } }}
        >
          Back to More Functions
        </Button>
      </Box>

      {/* Main Content */}
      <Fade in timeout={600}>
        <Box
          sx={{
            zIndex: 1,
            position: 'relative',
            maxWidth: 800,
            mx: 'auto',
            mt: 12,
            px: 3,
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
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              ⌨️ Typing Speed Test
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Type the sentence below as fast and accurately as you can:
            </Typography>

            <Box
              sx={{
                p: 2,
                mb: 2,
                border: '1px solid #ddd',
                borderRadius: 2,
                minHeight: '60px',
                textAlign: 'left',
                fontFamily: 'monospace',
                fontSize: '1.1rem',
              }}
            >
              {renderLiveText()}
            </Box>

            <TextField
              multiline
              fullWidth
              rows={3}
              placeholder="Start typing here..."
              inputRef={inputRef}
              value={input}
              onChange={(e) => !isFinished && setInput(e.target.value)}
              disabled={isFinished}
              sx={{ mb: 2 }}
            />

            {isFinished && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">
                  🚀 WPM: <strong>{wpm}</strong> &nbsp; | &nbsp; 🎯 Accuracy: <strong>{accuracy}%</strong>
                </Typography>
              </Box>
            )}

            <Button
              variant="outlined"
              onClick={handleRestart}
              sx={{ mt: 1 }}
            >
              🔁 Restart
            </Button>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default TypingSpeedTest;
