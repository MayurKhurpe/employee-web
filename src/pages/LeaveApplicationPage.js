// 📁 src/pages/LeaveApplicationPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Card, CardContent, TextField, Typography, Button, MenuItem,
  CircularProgress, Snackbar, Alert, Divider, List, ListItem, ListItemText, Chip
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const leaveTypes = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave', 'Unpaid Leave'];
const API_URL = process.env.REACT_APP_API_URL || 'https://employee-backend-kifp.onrender.com';

const LeaveApplicationPage = () => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [leaveHistory, setLeaveHistory] = useState([]);

  // 📥 Fetch leave history on mount
  useEffect(() => {
    axios
      .get(`${API_URL}/api/leave/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(res => setLeaveHistory(res.data))
      .catch(() => setLeaveHistory([]));
  }, []);

  const handleSubmit = () => {
    if (!leaveType || !startDate || !endDate || !reason) {
      return setSnackbar({ open: true, message: '⚠️ Please fill all fields!', severity: 'error' });
    }

    setLoading(true);
    axios.post(`${API_URL}/api/leave`, {
      leaveType,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      reason,
      status: 'Pending',
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => {
        setLeaveHistory([res.data, ...leaveHistory]);
        setSnackbar({ open: true, message: '✅ Leave submitted!', severity: 'success' });
        setLeaveType('');
        setStartDate(null);
        setEndDate(null);
        setReason('');
      })
      .catch(() => {
        setSnackbar({ open: true, message: '❌ Failed to submit leave.', severity: 'error' });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* 🌄 Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(https://i.postimg.cc/7Z3grwLw/MES.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(12px)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(255,255,255,0.7)',
          zIndex: 1
        }}
      />

      {/* 📄 Content */}
      <Box sx={{ position: 'relative', zIndex: 2, p: 4 }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            display: 'grid',
            gap: 4,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }
          }}
        >
          {/* 📝 Application Form */}
          <Card elevation={4} sx={{ p: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
                📝 Leave Application
              </Typography>

              <TextField
                select
                fullWidth
                label="Leave Type"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                sx={{ mb: 2 }}
              >
                {leaveTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
                />
              </LocalizationProvider>

              <TextField
                label="Reason"
                multiline
                rows={4}
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : '📤 Submit Application'}
              </Button>
            </CardContent>
          </Card>

          {/* 📋 Leave History */}
          <Card elevation={4} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📋 Leave History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {leaveHistory.length === 0 ? (
              <Typography>No leave records submitted yet.</Typography>
            ) : (
              <List>
                {leaveHistory.map((leave) => (
                  <ListItem key={leave._id} sx={{ mb: 1.5, borderBottom: '1px solid #eee' }}>
                    <ListItemText
                      primary={`${leave.leaveType} (${dayjs(leave.startDate).format('DD MMM')} ➝ ${dayjs(leave.endDate).format('DD MMM')})`}
                      secondary={
                        <>
                          <Typography variant="body2">📄 Reason: {leave.reason}</Typography>
                          <Chip
                            label={leave.status}
                            color={
                              leave.status === 'Approved'
                                ? 'success'
                                : leave.status === 'Rejected'
                                  ? 'error'
                                  : 'warning'
                            }
                            size="small"
                            sx={{ mt: 1 }}
                          />
                          {leave.responseMessage && (
                            <Typography variant="body2" color="text.secondary">
                              💬 Response: {leave.responseMessage}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Card>
        </Box>

        {/* 📅 Calendar */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>📆 Leave Calendar</Typography>
          <Box sx={{ backgroundColor: '#ffffff', borderRadius: 2, p: 2 }}>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              height="auto"
              events={leaveHistory.map((leave) => ({
                title: leave.leaveType,
                start: leave.startDate,
                end: dayjs(leave.endDate).add(1, 'day').format('YYYY-MM-DD'), // include full end date
                color:
                  leave.status === 'Approved'
                    ? '#4caf50'
                    : leave.status === 'Rejected'
                      ? '#f44336'
                      : '#ff9800'
              }))}
            />
          </Box>
        </Box>
      </Box>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeaveApplicationPage;
