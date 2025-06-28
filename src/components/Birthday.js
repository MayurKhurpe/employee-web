import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Typography,
  Chip,
  Divider
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';

export default function Birthday({ spinnerSize = 20 }) {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBirthdays = () => {
    setLoading(true);
    axios.get('/api/birthdays')
      .then(res => {
        const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setBirthdays(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBirthdays();

    const interval = setInterval(() => {
      fetchBirthdays(); // Refresh every 30 mins
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={spinnerSize} />
      </Box>
    );
  }

  if (!birthdays.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
        🎉 No birthdays today or upcoming.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>🎈 Upcoming Birthdays</Typography>
      <Divider sx={{ mb: 1 }} />
      <List dense>
        {birthdays.map((b, i) => {
          const isToday = dayjs(b.date).isSame(dayjs(), 'day');
          return (
            <ListItem key={i} disableGutters>
              <ListItemText
                primary={`🎂 ${b.name}`}
                secondary={dayjs(b.date).format('DD MMM YYYY')}
              />
              {isToday && <Chip label="Today 🎉" color="success" size="small" />}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
