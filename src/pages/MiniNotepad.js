import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Fade } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const MiniNotepad = () => {
  const navigate = useNavigate();
  const [note, setNote] = useState('');

  // Load note from localStorage
  useEffect(() => {
    const savedNote = localStorage.getItem('miniNote');
    if (savedNote) setNote(savedNote);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('miniNote', note);
  }, [note]);

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
            maxWidth: 600,
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

          {/* Notepad */}
          <Paper
            elevation={6}
            sx={{
              borderRadius: 4,
              p: 3,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              📝 Mini Notepad
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Start writing your notes here..."
              variant="outlined"
            />
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default MiniNotepad;
