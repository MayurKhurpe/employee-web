// 📁 src/pages/admin/AdminHolidaysPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventIcon from '@mui/icons-material/Event';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AdminHolidaysPage = () => {
  const navigate = useNavigate();
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const API = process.env.REACT_APP_API_URL || 'https://employee-backend-kifp.onrender.com';

  const fetchHolidays = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/api/admin/holidays`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHolidays(res.data || []);
    } catch (err) {
      console.error('Failed to fetch holidays:', err);
      setSnackbar({ open: true, message: '❌ Failed to load holidays.', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleAddHoliday = async () => {
    if (!newHoliday.name.trim() || !newHoliday.date) {
      return setSnackbar({
        open: true,
        message: '⚠️ Please enter both name and date.',
        severity: 'warning',
      });
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API}/api/admin/holidays`, newHoliday, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({ open: true, message: res.data.message || '✅ Holiday added!', severity: 'success' });
      setNewHoliday({ name: '', date: '' });
      fetchHolidays();
    } catch (err) {
      console.error('Failed to add holiday:', err);
      setSnackbar({ open: true, message: '❌ Failed to add holiday.', severity: 'error' });
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #e1f5fe, #fce4ec)',
      }}
    >
      {/* 🔙 Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/admin')}
        sx={{
          mb: 2,
          px: 2.5,
          py: 1.2,
          fontWeight: 'bold',
          fontSize: '0.95rem',
          background: 'linear-gradient(90deg, #3949ab, #5c6bc0)',
          color: '#fff',
          borderRadius: 2,
          boxShadow: '0 4px 10px rgba(63,81,181,0.3)',
          '&:hover': {
            background: 'linear-gradient(90deg, #303f9f, #3f51b5)',
          },
        }}
      >
        Back to Admin Panel
      </Button>

      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: '#fff9',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary.dark">
          📅 Holiday & Events Manager
        </Typography>
        <Typography variant="body1" gutterBottom>
          Add and manage upcoming holidays and events.
        </Typography>

        {/* ➕ Add Holiday Form */}
        <Box sx={{ display: 'flex', gap: 2, my: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Holiday Name"
            value={newHoliday.name}
            onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
            fullWidth
            required
          />
          <TextField
            type="date"
            value={newHoliday.date}
            onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
          <Button
            variant="contained"
            onClick={handleAddHoliday}
            sx={{
              fontWeight: 'bold',
              px: 3,
              background: 'linear-gradient(to right, #43cea2, #185a9d)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(to right, #2b5876, #4e4376)',
              },
            }}
          >
            ➕ Add
          </Button>
        </Box>

        {/* 📜 Holiday List */}
        <Divider sx={{ my: 2 }} />
        <List>
          {holidays.length === 0 ? (
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              ❌ No holidays found.
            </Typography>
          ) : (
            holidays.map((holiday) => (
              <ListItem key={holiday._id}>
                <EventIcon color="primary" sx={{ mr: 2 }} />
                <ListItemText
                  primary={holiday.name || 'Unnamed'}
                  secondary={
                    holiday.date
                      ? new Date(holiday.date).toLocaleDateString()
                      : 'Date not set'
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>

      {/* ✅ Snackbar for actions */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminHolidaysPage;
