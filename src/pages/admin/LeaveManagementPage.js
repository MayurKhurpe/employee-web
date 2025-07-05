import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, TextField,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions, Chip,
  Snackbar, Alert, MenuItem
} from '@mui/material';
import { HowToReg as LeaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'api/axios';

const LeaveManagementPage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [note, setNote] = useState('');
  const [action, setAction] = useState('');
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/users/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const query = new URLSearchParams();
      if (selectedMonth) query.append('month', selectedMonth);
      if (selectedUser) query.append('userId', selectedUser);

      const res = await axios.get(`/leave/admin/all?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data.leaves)) {
        setLeaveRequests(res.data.leaves);
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch leave requests', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [selectedMonth, selectedUser]);

  const handleOpenDialog = (request, actionType) => {
    setSelectedRequest(request);
    setAction(actionType);
    setNote('');
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedRequest(null);
    setNote('');
    setAction('');
  };

  const handleSubmit = async () => {
    if (!selectedRequest) return;
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `/leave/admin/${action === 'Approved' ? 'approve' : 'reject'}/${selectedRequest._id}`,
        { adminNote: note },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSnackbar({
        open: true,
        message: `Leave ${action.toLowerCase()} successfully.`,
        severity: action === 'Approved' ? 'success' : 'error',
      });

      fetchLeaves();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to process request', severity: 'error' });
    }

    handleCloseDialog();
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Approved':
        return <Chip label="✅ Approved" color="success" />;
      case 'Rejected':
        return <Chip label="❌ Rejected" color="error" />;
      default:
        return <Chip label="⏳ Pending" color="default" />;
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: 'linear-gradient(to bottom right, #fff1f3, #e0f7fa)' }}>
      <Button
        variant="outlined"
        startIcon={<BackIcon />}
        onClick={() => navigate('/admin')}
        sx={{
          mb: 2,
          borderRadius: 2,
          borderColor: '#e91e63',
          color: '#e91e63',
          fontWeight: 'bold',
          '&:hover': { backgroundColor: '#f8bbd0' },
        }}
      >
        Back to Admin Panel
      </Button>

      <Paper
        elevation={4}
        sx={{
          mb: 4,
          px: 4,
          py: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #e91e63, #f06292)',
          color: '#fff',
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <LeaveIcon sx={{ mr: 1 }} fontSize="large" />
          Leave Application Management
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Review all submitted leave requests and take appropriate actions with notes.
        </Typography>
      </Paper>

      {/* 🔍 Filter Controls */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="📆 Filter by Month"
            type="month"
            fullWidth
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            label="👤 Filter by User"
            fullWidth
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <MenuItem value="">All Users</MenuItem>
            {users.map((u) => (
              <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {leaveRequests.map((request) => (
          <Grid item xs={12} sm={6} md={4} key={request._id}>
            <Card
              elevation={6}
              sx={{
                borderRadius: 3,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.03)', boxShadow: 8 },
              }}
            >
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  👤 {request.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  📧 {request.email}
                </Typography>
                <Typography variant="body2">
                  🗓️ <strong>From:</strong> {new Date(request.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  🗓️ <strong>To:</strong> {new Date(request.endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  📝 <strong>Reason:</strong> {request.reason}
                </Typography>

                <Box sx={{ mt: 1 }}>{getStatusChip(request.status)}</Box>

                {request.adminNote && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    🧾 <strong>Admin Note:</strong> {request.adminNote}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleOpenDialog(request, 'Approved')}
                    disabled={request.status !== 'Pending'}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleOpenDialog(request, 'Rejected')}
                    disabled={request.status !== 'Pending'}
                  >
                    Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 📝 Note Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{action === 'Approved' ? '✅ Approve' : '❌ Reject'} Leave</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Add Admin Note"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            color={action === 'Approved' ? 'success' : 'error'}
            onClick={handleSubmit}
          >
            {action}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeaveManagementPage;
