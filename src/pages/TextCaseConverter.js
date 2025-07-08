import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Fade, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const TextCaseConverter = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');

  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());
  const toCapitalize = () =>
    setText(
      text
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    );

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
        <Box sx={{ position: 'relative', zIndex: 1, p: 4, maxWidth: 700, mx: 'auto' }}>
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

          {/* Converter UI */}
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.95)' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              🔤 Text Case Converter
            </Typography>

            <TextField
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your text here..."
              sx={{ mb: 3 }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="contained" onClick={toUpper}>
                UPPERCASE
              </Button>
              <Button variant="contained" onClick={toLower}>
                lowercase
              </Button>
              <Button variant="contained" onClick={toCapitalize}>
                Capitalize Each Word
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default TextCaseConverter;
