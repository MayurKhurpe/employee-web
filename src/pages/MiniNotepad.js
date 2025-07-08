import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Paper, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const MiniNotepad = () => {
  const navigate = useNavigate();
  const [note, setNote] = useState('');

  // Load saved note
  useEffect(() => {
    const saved = localStorage.getItem('miniNote');
    if (saved) setNote(saved);
  }, []);

  // Save on change
  const handleChange = (e) => {
    const newNote = e.target.value;
    setNote(newNote);
    localStorage.setItem('miniNote', newNote);
  };

  const clearNote = () => {
    setNote('');
    localStorage.removeItem('miniNote');
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
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255,255,255,0.5)',
          zIndex: 0,
        }}
      />

      {/* Content */}
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

        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            p: 3,
            bgcolor: 'rgba(255,255,255,0.95)',
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            📝 Mini Notepad
          </Typography>

          <TextField
            multiline
            fullWidth
            rows={10}
            value={note}
            onChange={handleChange}
            placeholder="Write your thoughts..."
            variant="outlined"
            sx={{ mt: 2 }}
          />

          <Button variant="outlined" color="error" sx={{ mt: 2 }} onClick={clearNote}>
            🗑 Clear Note
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default MiniNotepad;
