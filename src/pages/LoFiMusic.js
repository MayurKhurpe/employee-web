import React from 'react';
import { Box, Typography, Paper, Button, Fade } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const LoFiMusic = () => {
  const navigate = useNavigate();

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
            textAlign: 'center',
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

          {/* Music Player Card */}
          <Paper
            elevation={6}
            sx={{
              borderRadius: 4,
              p: 4,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: 6,
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              🎧 LoFi Music
            </Typography>
            <Typography variant="body1" mb={2}>
              Relax and focus with calming LoFi beats.
            </Typography>

            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1"
              title="LoFi Music Stream"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default LoFiMusic;
