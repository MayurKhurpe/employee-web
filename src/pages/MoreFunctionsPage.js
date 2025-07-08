// 📁 MoreFunctionsPage.js
import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: '💡',
    title: 'Motivation Corner',
    description: 'Daily dose of motivation to energize your day.',
    path: '/more-functions/motivation',
  },
  {
    icon: '🎮',
    title: 'Fun Zone',
    description: 'Games and quizzes to refresh your mind.',
    path: '/more-functions/fun',
  },
  {
    icon: '📅',
    title: 'Event Calendar',
    description: 'Track upcoming events and holidays.',
    path: '/more-functions/calendar',
  },
  {
    icon: '⏱️',
    title: 'Timer',
    description: 'Track time or use Pomodoro for productivity.',
    path: '/more-functions/timer',
  },
  {
    icon: '🧮',
    title: 'Calculator',
    description: 'Solve calculation problems instantly.',
    path: '/more-functions/calculator',
  },
  {
    icon: '⛅',
    title: 'Weather Report',
    description: 'Get today’s weather updates for your city.',
    path: '/more-functions/weather',
  },
  {
    icon: '😊',
    title: 'Mood Tracker',
    description: 'Track your mood and mental well-being.',
    path: '/more-functions/mood',
  },

  // ✅ NEW FEATURES BELOW
  {
    icon: '🧘‍♀️',
    title: 'Breathing Exercise',
    description: 'Simple breathing to calm your mind.',
    path: '/more-functions/breathing',
  },
  {
    icon: '📝',
    title: 'Mini Notepad',
    description: 'Quickly write and save your notes.',
    path: '/more-functions/notepad',
  },
  {
    icon: '🎵',
    title: 'Lo-Fi Music',
    description: 'Play relaxing background music.',
    path: '/more-functions/music',
  },
  {
    icon: '🔤',
    title: 'Text Case Converter',
    description: 'Convert text to UPPER, lower, Capital.',
    path: '/more-functions/textcase',
  },
  {
    icon: '🧭',
    title: 'Digital Compass',
    description: 'See your phone’s direction live.',
    path: '/more-functions/compass',
  },
  {
    icon: '⌨️',
    title: 'Typing Speed Test',
    description: 'Check your typing speed in WPM.',
    path: '/more-functions/typing-test',
  },
];

export default function MoreFunctionsPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(https://i.postimg.cc/Yq51br7t/MES.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          backdropFilter: 'blur(25px)',
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          minHeight: '100vh',
          p: { xs: 2, md: 4 },
        }}
      >
        <Typography variant="h4" gutterBottom>
          🤖 More Functions
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Paper
                elevation={4}
                sx={{
                  padding: 3,
                  borderRadius: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 8,
                    backgroundColor: 'rgba(255,255,255,0.95)',
                  },
                  backgroundColor: 'rgba(255,255,255,0.9)',
                }}
                onClick={() => navigate(feature.path)}
              >
                <Typography variant="h3" component="div">
                  {feature.icon}
                </Typography>
                <Typography variant="h6" mt={1}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" mt={1} color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
