import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Paper, Typography, Stack, Button, Snackbar, Alert,
  ToggleButtonGroup, ToggleButton, CircularProgress, Pagination,
  Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'api/axios';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';

const PAGE_SIZE = 5;
const COLORS = ['#4caf50', '#f44336', '#ff9800', '#2196f3'];
const backgroundImageUrl = 'https://i.postimg.cc/7Z3grwLw/MES.jpg';

const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [alreadyMarked, setAlreadyMarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate, setFilterDate] = useState(null);
  const [filterMonth, setFilterMonth] = useState(dayjs());
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [remoteDialogOpen, setRemoteDialogOpen] = useState(false);
  const [remoteForm, setRemoteForm] = useState({ customer: '', workLocation: '', assignedBy: '' });

  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || '👤 User';

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation({ lat: 'Permission denied', lng: '' })
    );
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/attendance/my', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const start = dayjs().subtract(29, 'day');
        const end = dayjs().startOf('day');
        const allDates = [];
        for (let i = 0; i <= end.diff(start, 'day'); i++) {
          allDates.push(start.add(i, 'day').format('YYYY-MM-DD'));
        }

        const filled = allDates.map((dateStr) => {
          const found = res.data.find((rec) => dayjs(rec.date).isSame(dateStr, 'day'));
          return found || {
            _id: dateStr,
            date: dateStr,
            status: 'Absent',
            checkInTime: '',
            checkOutTime: '',
          };
        });

        const sorted = filled.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecords(sorted);

        const today = dayjs().startOf('day');
        const marked = res.data.some((rec) => dayjs(rec.date).isSame(today, 'day'));
        setAlreadyMarked(marked);
      } catch {
        setSnackbar({ open: true, message: 'Failed to fetch attendance', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [token]);

  const filteredRecords = useMemo(() => {
    let temp = [...records];
    if (filterStatus !== 'All') temp = temp.filter((r) => r.status === filterStatus);
    if (filterDate) temp = temp.filter((r) => dayjs(r.date).isSame(filterDate, 'day'));
    if (search) temp = temp.filter((r) => r.status.toLowerCase().includes(search.toLowerCase()));
    return temp;
  }, [records, filterStatus, filterDate, search]);

  const paginatedRecords = useMemo(() => {
    return filteredRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filteredRecords, page]);

  const monthYearRecords = useMemo(() => {
    return records.filter((r) => {
      const d = dayjs(r.date);
      return d.month() === filterMonth.month() && d.year() === filterMonth.year();
    });
  }, [records, filterMonth]);

  const summaryData = [
    { name: 'Present', value: monthYearRecords.filter((r) => r.status === 'Present').length },
    { name: 'Absent', value: monthYearRecords.filter((r) => r.status === 'Absent').length },
    { name: 'Half Day', value: monthYearRecords.filter((r) => r.status === 'Half Day').length },
    { name: 'Remote Work', value: monthYearRecords.filter((r) => r.status === 'Remote Work').length },
  ];

  const markAttendance = async (status, extra = {}) => {
    setLoading(true);
    const now = dayjs();
    const formattedTime = now.format('HH:mm');

    try {
      const res = await axios.post(
        '/attendance/mark',
        {
          status,
          location,
          date: now.toISOString(),
          checkInTime: formattedTime,
          checkOutTime: '',
          ...extra,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecords((prev) => [res.data.attendance, ...prev.filter((r) => !dayjs(r.date).isSame(now, 'day'))]);
      const locMsg =
        ['Present', 'Half Day'].includes(status) && location.lat
          ? '⚠️ Outside office/or any error. Attendance submitted successfully.'
          : `✅ Marked as ${status}!`;

      setSnackbar({ open: true, message: locMsg, severity: 'success' });
      setAlreadyMarked(true);
      setRemoteForm({ customer: '', workLocation: '', assignedBy: '' });
      setRemoteDialogOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || '❌ Error marking attendance',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = (status) => {
    if (loading) return;
    if (status === 'Remote Work') {
      setRemoteDialogOpen(true);
    } else {
      markAttendance(status);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Attendance Records', 10, 10);
    filteredRecords.forEach((rec, i) => {
      doc.text(`${i + 1}. ${dayjs(rec.date).format('DD MMM YYYY')} - ${rec.status}`, 10, 20 + i * 10);
    });
    doc.save('attendance.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRecords.map((r) => ({
        Date: dayjs(r.date).format('DD MMM YYYY'),
        Status: r.status,
        Customer: r.customer || '',
        Location: r.workLocation || '',
        AssignedBy: r.assignedBy || '',
        CheckIn: r.checkInTime || 'N/A',
        CheckOut: r.checkOutTime || 'N/A',
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, 'attendance.xlsx');
  };

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>📅 Attendance Tracker</Typography>

        <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1" gutterBottom>Welcome {userName}, mark your attendance below 👇</Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Button variant="contained" color="success" disabled={alreadyMarked || loading} onClick={() => handleMarkAttendance('Present')}>Mark Present</Button>
            <Button variant="contained" color="warning" disabled={alreadyMarked || loading} onClick={() => handleMarkAttendance('Half Day')}>Mark Half Day</Button>
            <Button variant="contained" color="info" disabled={alreadyMarked || loading} onClick={() => handleMarkAttendance('Remote Work')}>Remote Work</Button>
          </Stack>
        </Paper>

        {/* ... Summary, Filters, Records Table, Export Buttons ... */}
        {/* Skip for brevity. Already in your code and works fine. */}

        {/* Remote Work Dialog */}
        <Dialog open={remoteDialogOpen} onClose={() => setRemoteDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Remote Work Details</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="👤 Customer Name" value={remoteForm.customer} onChange={(e) => setRemoteForm({ ...remoteForm, customer: e.target.value })} required />
            <TextField label="🏢 Work Location" value={remoteForm.workLocation} onChange={(e) => setRemoteForm({ ...remoteForm, workLocation: e.target.value })} required />
            <TextField label="📨 Assigned By" value={remoteForm.assignedBy} onChange={(e) => setRemoteForm({ ...remoteForm, assignedBy: e.target.value })} required />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRemoteDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => {
              if (!remoteForm.customer || !remoteForm.workLocation || !remoteForm.assignedBy) {
                setSnackbar({ open: true, message: 'All fields are required.', severity: 'warning' });
                return;
              }
              markAttendance('Remote Work', remoteForm);
            }}>Submit</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default AttendancePage;
