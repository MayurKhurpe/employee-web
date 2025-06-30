// 📁 src/pages/admin/AdminNotificationsPage.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from 'api/axios';

const AdminNotificationsPage = () => {
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
      } catch (error) {
        console.error(error);
        setSnackbar({ open: true, message: '❌ Failed to load notifications', severity: 'error' });
      }
    };

    fetchNotifications();
  }, [API]);

  const exportToCSV = () => {
    const headers = ['Message', 'Date'];
    const rows = notifications.map((n) => [
      `"${n.message.replace(/"/g, '""')}"`,
      `"${new Date(n.sentAt).toLocaleString()}"`,
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.setAttribute('download', 'notification_history.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setSnackbar({ open: true, message: '✅ CSV exported successfully!', severity: 'success' });
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #fff3e0, #e3f2fd)',
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
          background: 'linear-gradient(90deg, #ff7043, #ffab91)',
          color: '#fff',
          borderRadius: 2,
          '&:hover': {
            background: 'linear-gradient(90deg, #f4511e, #ff8a65)',
          },
        }}
      >
        Back to Admin Panel
      </Button>

      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.dark">
        🔔 Notification History
      </Typography>

      <Typography variant="body1" mb={3}>
        Logs of all past notifications and announcements.
      </Typography>

      <Button
        variant="contained"
        startIcon={<FileDownloadIcon />}
        onClick={exportToCSV}
        sx={{
          mb: 2,
          backgroundColor: '#4caf50',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#388e3c',
          },
        }}
      >
        📤 Export to CSV
      </Button>

      <Paper elevation={4} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#b2ebf2' }}>
            <TableRow>
              <TableCell><strong>📩 Message</strong></TableCell>
              <TableCell><strong>📅 Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2}>❌ No notifications found.</TableCell>
              </TableRow>
            ) : (
              notifications.map((note) => (
                <TableRow key={note._id}>
                  <TableCell>{note.message}</TableCell>
                  <TableCell>{new Date(note.sentAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminNotificationsPage;
