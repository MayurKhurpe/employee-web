import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, TextField, Paper, Button, Fade,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const texts = [
  "Practice makes perfect. Improve your typing speed with this simple test!",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
  "The only way to do great work is to love what you do.",
];

const TypingSpeedTest = () => {
  const navigate = useNavigate();
  const [sampleText, setSampleText] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    getNewText();
  }, []);

  useEffect(() => {
    if (input.length === 1 && !startTime) setStartTime(Date.now());

    if (input === sampleText) {
      const end = Date.now();
      const minutes = (end - startTime) / 60000;
      const words = sampleText.trim().split(/\s+/).length;
      const correctChars = [...input].filter((c, i) => c === sampleText[i]).length;
      const totalChars = sampleText.length;
      const wrong = [...input].filter((c, i) => c !== sampleText[i]).length;

      setWpm(Math.round(words / minutes));
      setWrongCount(wrong);
      setIsFinished(true);
    }
  }, [input]);

  const getNewText = () => {
    const random = texts[Math.floor(Math.random() * texts.length)];
    setSampleText(random);
    setInput('');
    setWpm(0);
    setWrongCount(0);
    setStartTime(null);
    setIsFinished(false);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const renderLiveText = () => {
    return [...sampleText].map((char, idx) => {
      const isCorrect = input[idx] === char;
      const color = idx < input.length
        ? isCorrect ? '#4caf50' : '#f44336'
        : '#000';
      return <span key={idx} style={{ color }}>{char}</span>;
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
      <Box
        sx={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.3)',
          zIndex: 0,
        }}
      />
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

      <Fade in timeout={600}>
        <Box sx={{ zIndex: 1, position: 'relative', maxWidth: 800, mx: 'auto', mt: 12, px: 3 }}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.95)', textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              ⌨️ Typing Speed Test
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Type the following as quickly and accurately as you can:
            </Typography>
            <Box
              sx={{
                p: 2, mb: 2,
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
                  🚀 WPM: <strong>{wpm}</strong> &nbsp; | ❌ Mistakes: <strong>{wrongCount}</strong>
                </Typography>
              </Box>
            )}
            <Button variant="outlined" onClick={getNewText}>
              🔁 Restart
            </Button>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default TypingSpeedTest;
