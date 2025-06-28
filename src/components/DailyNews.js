import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';

export default function DailyNews({ spinnerSize = 20 }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 30 * 60 * 1000); // refresh every 30 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/news`);
      const sorted = res.data.sort((a, b) =>
        new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
      );
      setNews(sorted);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load news', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={spinnerSize} />
      </Box>
    );
  }

  if (!news.length) {
    return (
      <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
        📭 No news available today.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>📰 Latest News</Typography>
      <Grid container spacing={2}>
        {news.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {item.image && (
                <CardMedia
                  component="img"
                  height="140"
                  image={item.image}
                  alt="news-img"
                />
              )}
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  📬 {item.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {item.description || 'No description provided.'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  📅 {dayjs(item.date || item.createdAt).format('DD MMM YYYY')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
