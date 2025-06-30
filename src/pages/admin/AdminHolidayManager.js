// 📁 src/pages/admin/HolidayManager.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Delete, FileDownload, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HolidayManager = () => {
  const [holidays, setHolidays] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  const API = process.env.REACT_APP_API_URL || 'https://employee-backend-kifp.onrender.com';

  const fetchHolidays = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/api/admin/holidays`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHolidays(res.data || []);
    } catch (err) {
      console.error('Failed to fetch holidays', err);
      setSnackbar({ open: true, message: '❌ Failed to load holidays', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/api/admin/holidays/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: '🗑️ Holiday deleted', severity: 'success' });
      fetchHolidays();
    } catch (err) {
      console.error('Delete failed', err);
      setSnackbar({ open: true, message: '❌ Failed to delete', severity: 'error' });
    }
  };

  const exportCSV = () => {
    const csvRows = [
      ['"Name"', '"Date"', '"Description"'],
      ...holidays.map((h) => [
        `"${h.name || ''}"`,
        `"${h.date ? new Date(h.date).toLocaleDateString() : ''}"`,
        `"${h.description || ''}"`,
      ]),
    ];
    const blob = new Blob([csvRows.map((r) => r.join(',')).join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'holidays.csv';
    a.click();
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

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
        startIcon={<ArrowBack />}
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

      <Typography variant="h4" sx={{ mt: 1, mb: 3, fontWeight: 'bold', color: 'primary.dark' }}>
        📅 Holiday Manager
      </Typography>

      <Button
        variant="contained"
        startIcon={<FileDownload />}
        onClick={exportCSV}
        sx={{
          mb: 3,
          background: 'linear-gradient(to right, #43cea2, #185a9d)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(to right, #2b5876, #4e4376)',
          },
        }}
      >
        📂 Export to CSV
      </Button>

      <Grid container spacing={3}>
        {holidays.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
              ❌ No holidays found.
            </Typography>
          </Grid>
        ) : (
          holidays.map((holiday) => (
            <Grid item xs={12} sm={6} md={4} key={holiday._id}>
              <Card elevation={4} sx={{ backgroundColor: '#f9fbe7', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {holiday.name || 'Untitled Holiday'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📆 {holiday.date ? new Date(holiday.date).toLocaleDateString() : 'N/A'}
                  </Typography>
                  {holiday.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      📝 {holiday.description}
                    </Typography>
                  )}
                  <Tooltip title="Delete Holiday">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(holiday._id)}
                      sx={{ mt: 1 }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HolidayManager;
