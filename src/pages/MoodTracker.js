// MoodTrackerPage.js (Final Advanced Version)

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Slide,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  SentimentSatisfiedAlt,
  SentimentDissatisfied,
  Mood,
  MoodBad,
  EmojiEmotions,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import backgroundMusic from '../assets/bensound-creativeminds.mp3'; // 🔊 Your background music file

const backgroundImage = 'https://i.postimg.cc/Yq51br7t/MES.jpg';

const moods = [
  { icon: <EmojiEmotions fontSize="large" />, label: 'Happy', value: 5 },
  { icon: <SentimentSatisfiedAlt fontSize="large" />, label: 'Neutral', value: 3 },
  { icon: <Mood fontSize="large" />, label: 'Excited', value: 4 },
  { icon: <SentimentDissatisfied fontSize="large" />, label: 'Sad', value: 2 },
  { icon: <MoodBad fontSize="large" />, label: 'Angry', value: 1 },
];

export default function MoodTrackerPage() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('moodHistory')) || []);
  const navigate = useNavigate();

  // 🔊 Play background music
  useEffect(() => {
    const audio = new Audio(backgroundMusic);
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(console.error);
    return () => audio.pause();
  }, []);

  const handleSelectMood = (mood) => setSelectedMood(mood);

  const handleSaveMood = () => {
    if (selectedMood) {
      const newEntry = {
        mood: selectedMood.label,
        value: selectedMood.value,
        time: new Date().toLocaleString(),
        note: note.trim(),
      };
      const newHistory = [newEntry, ...history];
      setHistory(newHistory);
      localStorage.setItem('moodHistory', JSON.stringify(newHistory));
      setSelectedMood(null);
      setNote('');
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(40px)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          px: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{ p: 4, width: '100%', maxWidth: 900, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.85)' }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            😊 Mood Tracker
          </Typography>

          <Grid container spacing={2} justifyContent="center" mb={3}>
            {moods.map((mood, index) => (
              <Grid item key={index}>
                <Button
                  variant={selectedMood?.label === mood.label ? 'contained' : 'outlined'}
                  onClick={() => handleSelectMood(mood)}
                  sx={{ borderRadius: 3, p: 2, minWidth: 80 }}
                >
                  <Box display="flex" flexDirection="column" alignItems="center">
                    {mood.icon}
                    <Typography variant="caption">{mood.label}</Typography>
                  </Box>
                </Button>
              </Grid>
            ))}
          </Grid>

          <TextField
            fullWidth
            label="Add a note (optional)"
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box textAlign="center">
            <Button variant="contained" color="primary" disabled={!selectedMood} onClick={handleSaveMood}>
              Save Mood
            </Button>
          </Box>

          {/* 📈 Mood Chart */}
          {history.length > 1 && (
            <Box mt={4}>
              <Typography variant="h6">📊 Mood Analytics</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={history.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 5]} tickCount={6} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3f51b5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* 🕒 History */}
          {history.length > 0 && (
            <Slide in direction="up">
              <Box mt={4}>
                <Typography variant="h6">🕒 Mood History</Typography>
                <List dense>
                  {history.map((entry, idx) => (
                    <Box key={idx}>
                      <ListItem>
                        <ListItemText
                          primary={`Mood: ${entry.mood}`}
                          secondary={`${entry.time}${entry.note ? ` | Note: ${entry.note}` : ''}`}
                        />
                      </ListItem>
                      <Divider />
                    </Box>
                  ))}
                </List>
              </Box>
            </Slide>
          )}

          <Box mt={4} textAlign="center">
            <Button onClick={() => navigate('/more-functions')} variant="outlined">
              🔙 Back to More Functions
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
