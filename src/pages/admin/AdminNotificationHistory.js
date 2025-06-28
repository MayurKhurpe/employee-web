// 📁 src/pages/AdminNotificationHistory.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminNotificationHistory = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // 🔁 Replace with actual API when backend ready
        // const res = await axios.get('/api/admin/notifications');
        // setNotifications(res.data);

        // Using mock data for now
        const mock = [
          { id: 1, message: 'Server maintenance tonight at 9 PM', sentAt: '2025-06-20 16:00' },
          { id: 2, message: 'New ID policy will roll out Monday', sentAt: '2025-06-21 12:30' },
        ];
        setNotifications(mock);
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to fetch notifications.', severity: 'error' });
      }
    };
    fetchNotifications();
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #fffde7, #e1f5fe)',
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
          background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
          color: '#fff',
          borderRadius: 2,
          boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            background: 'linear-gradient(90deg, #1565c0, #2196f3)',
          },
        }}
      >
        Back to Admin Panel
      </Button>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🔔 Notification History
      </Typography>

      <TableContainer component={Paper} elevation={4} sx={{ mt: 2, borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#bbdefb' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>📩 Message</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>📅 Sent At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2}>No notifications found.</TableCell>
              </TableRow>
            ) : (
              notifications.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>{note.message}</TableCell>
                  <TableCell>{note.sentAt}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminNotificationHistory;
