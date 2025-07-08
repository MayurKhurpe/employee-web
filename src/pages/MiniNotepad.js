import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Fade,
  Button,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const MiniNotepad = () => {
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const [snack, setSnack] = useState(false);

  // Load saved note on mount
  useEffect(() => {
    const saved = localStorage.getItem('miniNote');
    if (saved) setNote(saved);
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('miniNote', note);
  }, [note]);

  const handleClear = () => {
    setNote('');
    localStorage.removeItem('miniNote');
    setSnack(true);
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
      {/* Background Blur */}
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
          sx={{ bgcolor: '#fff', color: '#000', '&:hover': { bgcolor: '#f5f5f5' } }}
        >
          Back to More Functions
        </Button>
      </Box>

      {/* Notepad UI */}
      <Fade in timeout={500}>
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 600,
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
              boxShadow: 8,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              📝 Mini Notepad
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Your notes will be saved automatically.
            </Typography>
            <TextField
              multiline
              rows={10}
              fullWidth
              variant="outlined"
              placeholder="Write something here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={handleClear}
              sx={{ mt: 2 }}
            >
              Clear Notes
            </Button>
          </Paper>
        </Box>
      </Fade>

      {/* Snackbar */}
      <Snackbar
        open={snack}
        autoHideDuration={2000}
        onClose={() => setSnack(false)}
        message="🧹 Notes cleared!"
      />
    </Box>
  );
};

export default MiniNotepad;
