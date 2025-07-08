import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Paper,
  Fade,
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const riddleBank = [
  { question: 'वो कौन सी चीज़ है जो पानी में जाती है पर गीली नहीं होती?', answer: 'परछाई (Shadow)' },
  { question: 'ऐसा क्या है जो रोज़ बढ़ता है पर कभी कम नहीं होता?', answer: 'उम्र (Age)' },
  { question: 'ऐसी कौन सी चीज़ है जो उड़ती है पर पंख नहीं होते?', answer: 'समय (Time)' },
  { question: 'वो क्या है जो न खाता है न पीता है फिर भी ज़िंदा है?', answer: 'दीया (Oil Lamp)' },
  { question: 'What has a head, a tail, is brown, and has no legs?', answer: 'A penny 🪙' },
  { question: 'What gets wetter the more it dries?', answer: 'A towel 🧺' },
  { question: 'The more you take, the more you leave behind. What are they?', answer: 'Footsteps 👣' },
  { question: 'What comes down but never goes up?', answer: 'Rain 🌧' },
  { question: 'Which month has 28 days?', answer: 'All of them!' },
];

const FunZone = () => {
  const navigate = useNavigate();
  const [trivia, setTrivia] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [riddle, setRiddle] = useState({});
  const [showRiddleAnswer, setShowRiddleAnswer] = useState(false);

  const fetchTrivia = async () => {
    try {
      const res = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
      const data = await res.json();
      const q = data.results[0];
      setTrivia({ question: q.question, answer: q.correct_answer });
      setShowAnswer(false);
    } catch {
      setTrivia({ question: '❌ Could not fetch trivia. Try again!', answer: '' });
    }
  };

  const nextRiddle = () => {
    const random = riddleBank[Math.floor(Math.random() * riddleBank.length)];
    setRiddle(random);
    setShowRiddleAnswer(false);
  };

  useEffect(() => {
    fetchTrivia();
    nextRiddle();
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: `url('https://i.postimg.cc/2y7sHQxP/MES.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    }}>
      <Box sx={{
        position: 'absolute',
        top: 0, left: 0, height: '100%', width: '100%',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 0,
      }} />
      <Fade in timeout={800}>
        <Box sx={{ position: 'relative', zIndex: 1, p: 4, maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/more-functions')}
              sx={{
                bgcolor: '#ffffffdd', color: 'black', textTransform: 'none', fontWeight: 'bold',
                '&:hover': { bgcolor: '#ffffff' },
              }}
            >
              Back to More Functions
            </Button>
          </Box>

          <Paper elevation={6} sx={{
            bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(1000px)',
            borderRadius: 4, p: 3, textAlign: 'center', color: 'white', mb: 4,
          }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>🏌 Fun Zone</Typography>
            <Typography variant="h6">Games, Trivia & Riddles Await! 🎮🧠</Typography>
          </Paper>

          <Grid container spacing={4}>
            {/* 🎮 Fun Games */}
            <Grid item xs={12} md={4}>
              <Card sx={cardStyle}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>🎮 Fun Games</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>Quick brain & classic games!</Typography>
                <Button fullWidth variant="contained" sx={{ mb: 1 }} onClick={() => window.open('https://rock-paper-scissors-game.netlify.app', '_blank')}>👊✌️✋ Rock Paper</Button>
                <Button fullWidth variant="outlined" sx={{ mb: 1 }} onClick={() => window.open('https://tic-tac-toe-advanced.netlify.app', '_blank')}>⭕❌ Tic Tac Toe</Button>
                <Button fullWidth variant="outlined" sx={{ mb: 1 }} onClick={() => window.open('https://sudoku-game.netlify.app', '_blank')}>🔢 Sudoku</Button>
                <Button fullWidth variant="outlined" sx={{ mb: 1 }} onClick={() => window.open('https://number-guess-game-react.netlify.app', '_blank')}>🎯 Number Guessing</Button>
                <Button fullWidth variant="outlined" onClick={() => window.open('https://toytheater.com/category/play/puzzles/', '_blank')}>🧩 Puzzle Game</Button>
              </Card>
            </Grid>

            {/* 💡 Trivia */}
            <Grid item xs={12} md={4}>
              <Card sx={cardStyle}>
                <Typography variant="h6" fontWeight="bold" gutterBottom><LightbulbIcon /> Trivia Time</Typography>
                <Typography variant="body2" sx={{ mb: 1 }} dangerouslySetInnerHTML={{ __html: trivia.question }} />
                {showAnswer && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555', mb: 2 }}>
                    Answer: {trivia.answer}
                  </Typography>
                )}
                <Box>
                  <Button variant="contained" onClick={() => setShowAnswer(true)} sx={{ mr: 1 }}>Show Answer</Button>
                  <Button variant="outlined" onClick={fetchTrivia}>New Trivia</Button>
                </Box>
              </Card>
            </Grid>

            {/* 🧠 Riddle */}
            <Grid item xs={12} md={4}>
              <Card sx={cardStyle}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>🧠 Riddle Me This</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>{riddle.question}</Typography>
                {showRiddleAnswer && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555', mb: 2 }}>
                    उत्तर / Answer: {riddle.answer}
                  </Typography>
                )}
                <Box>
                  <Button variant="contained" onClick={() => setShowRiddleAnswer(true)} sx={{ mr: 1 }}>Reveal</Button>
                  <Button variant="outlined" onClick={nextRiddle}>New Riddle</Button>
                </Box>
              </Card>
            </Grid>

            {/* 📅 Today in History */}
            <Grid item xs={12} md={4}>
              <Card sx={cardStyle}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>📅 Today in History</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  See what happened on this day years ago.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => window.open('https://www.history.com/this-day-in-history', '_blank')}
                >
                  🔍 View Now
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Box>
  );
};

const cardStyle = {
  bgcolor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: 4,
  p: 3,
  textAlign: 'center',
  boxShadow: 5,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

export default FunZone;
