import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Fade,
  IconButton,
  Tooltip,
  Stack,
  Button,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

// Background & Music
const backgroundImage = 'https://i.postimg.cc/Yq51br7t/MES.jpg';
const musicUrl = 'https://www.bensound.com/bensound-music/bensound-creativeminds.mp3';

// Static fallback quotes
const fallbackQuotes = [
  { quote: 'Believe you can and you’re halfway there.', author: 'Theodore Roosevelt' },
  { quote: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { quote: 'You miss 100% of the shots you don’t take.', author: 'Wayne Gretzky' },
  { quote: 'Dream big and dare to fail.', author: 'Norman Vaughan' },
  { quote: 'Hardships often prepare ordinary people for an extraordinary destiny.', author: 'C.S. Lewis' },
];

export default function MotivationCorner() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.quotable.io/random');
      const data = await res.json();
      if (data?.content && data?.author) {
        setQuote({ quote: data.content, author: data.author });
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.warn('Quote fetch failed, using fallback.');
      const rnd = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(rnd);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicOn) audioRef.current.pause();
    else audioRef.current.play();
    setMusicOn((t) => !t);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backdropFilter: 'blur(50px)', backgroundColor: 'rgba(255, 255, 255, 0.3)', zIndex: 0
        }}
      />

      <Box
        sx={{
          position: 'relative', zIndex: 1, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          height: '100%', px: 2
        }}
      >
        <audio ref={audioRef} loop src={musicUrl} />
        <Box
          sx={{
            backdropFilter: 'blur(40px)', backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: 4, maxWidth: 750, width: '100%', p: 5,
            boxShadow: '0 8px 30px rgba(0,0,0,0.25)'
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Button
              onClick={() => navigate('/more-functions')}
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              sx={{ textTransform: 'none' }}
            >
              Back to More Functions
            </Button>
            <Tooltip title="New Quote">
              <IconButton onClick={fetchQuote}><RefreshIcon /></IconButton>
            </Tooltip>
          </Stack>

          <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
            💡 Motivation Corner
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Fade in timeout={600}>
              <Paper
                elevation={4}
                sx={{
                  p: 4, mt: 2,
                  background: 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)',
                  color: '#333', borderRadius: 3, fontStyle: 'italic',
                  fontSize: '1.3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  “{quote.quote}”
                </Typography>
                <Typography align="right" variant="subtitle1" sx={{ mt: 2, fontWeight: 500 }}>
                  — {quote.author}
                </Typography>
              </Paper>
            </Fade>
          )}

          <Stack direction="row" alignItems="center" mt={4}>
            <Tooltip title="Background Music">
              <IconButton onClick={toggleMusic}>
                {musicOn ? <MusicOffIcon /> : <MusicNoteIcon />}
              </IconButton>
            </Tooltip>
            <Typography variant="body2">
              {musicOn ? '🎵 Music is playing' : '🔇 Music is off'}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
