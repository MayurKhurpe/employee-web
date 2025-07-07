import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'api/axios';
import dayjs from 'dayjs';

export default function Birthday({ spinnerSize = 20, refresh = true }) {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBirthdays = (isManual = false) => {
    setLoading(true);
    axios
      .get('/birthdays')
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setBirthdays(sorted);

        // Update last fetch only if not manual refresh
        if (!isManual) {
          const todayStr = dayjs().format('YYYY-MM-DD');
          localStorage.setItem('lastBirthdayFetch', todayStr);
        }
      })
      .finally(() => setLoading(false));
  };

  // Auto-fetch only once per day
  useEffect(() => {
    if (!refresh) return;

    const todayStr = dayjs().format('YYYY-MM-DD');
    const lastFetch = localStorage.getItem('lastBirthdayFetch');

    if (lastFetch !== todayStr) {
      fetchBirthdays(false);
    }
  }, [refresh]);

  // Manual refresh handler
  const handleManualRefresh = () => {
    fetchBirthdays(true);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          🎈 Upcoming Birthdays
        </Typography>
        <Tooltip title="Refresh Birthdays">
          <IconButton onClick={handleManualRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ mb: 1 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={spinnerSize} />
        </Box>
      ) : birthdays.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', mt: 2 }}
        >
          🎉 No birthdays today or upcoming.
        </Typography>
      ) : (
        <List dense>
          {birthdays.map((b, i) => {
            const isToday = dayjs(b.date).isSame(dayjs(), 'day');
            return (
              <ListItem key={i} disableGutters>
                <ListItemText
                  primary={`🎂 ${b.name}`}
                  secondary={dayjs(b.date).format('DD MMM YYYY')}
                />
                {isToday && (
                  <Chip label="Today 🎉" color="success" size="small" />
                )}
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}
