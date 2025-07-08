import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Stack } from '@mui/material';

const sampleText = "The quick brown fox jumps over the lazy dog.";

export default function TypingSpeedTest() {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (input.length === 1) setStartTime(Date.now());
    if (input === sampleText) {
      const endTime = Date.now();
      const minutes = (endTime - startTime) / 60000;
      const wordCount = sampleText.trim().split(/\s+/).length;
      setWpm(Math.round(wordCount / minutes));
      setFinished(true);
    }
  }, [input]);

  const reset = () => {
    setInput('');
    setWpm(null);
    setStartTime(null);
    setFinished(false);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>⌨️ Typing Speed Test</Typography>
      <Typography variant="body1" mb={2}>{sampleText}</Typography>

      <TextField
        fullWidth
        multiline
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={finished}
        placeholder="Start typing here..."
        sx={{ mb: 2 }}
      />

      {wpm && (
        <Typography variant="h6" color="success.main">Speed: {wpm} WPM</Typography>
      )}

      {finished && (
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={reset}>
          Try Again
        </Button>
      )}
    </Box>
  );
}
