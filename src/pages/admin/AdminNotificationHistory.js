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

  const API = process.env.REACT_APP_API_URL || 'https://employee-backend-kifp.onrender.com';

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API}/api/admin/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setSnackbar({
          open: true,
          message: '❌ Failed to fetch notifications.',
          severity: 'error',
        });
      }
    };

    fetchNotifications();
  }, [API]);

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

      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.dark">
        🔔 Notification History
      </Typography>

      <Typography variant="body1" mb={2}>
        View all past announcements and broadcasts sent to employees.
      </Typography>

      <TableContainer component={Paper} elevation={4} sx={{ mt: 1, borderRadius: 3 }}>
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
                <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                  ❌ No notifications found.
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((note) => (
                <TableRow key={note._id || note.id}>
                  <TableCell>{note.message}</TableCell>
                  <TableCell>
                    {new Date(note.sentAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </TableCell>
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
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminNotificationHistory;
