import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Snackbar,
  Alert,
  Stack,
  Box,
  Grid,
  Pagination,
  TextField,
  MenuItem,
} from '@mui/material';
import axios from 'api/axios';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

// Format Location / Remote details for table + export
const formatAttendanceLocation = (rec) => {
  // If backend already sends a descriptive string, use it.
  if (typeof rec.location === 'string' && rec.status !== 'Remote' && rec.status !== 'Remote Work') {
    return rec.location;
  }

  // Detect remote
  const isRemote =
    (rec.status || '').toLowerCase().includes('remote') ||
    rec.remoteWork === true;

  if (isRemote) {
    const customer = rec.remoteCustomer || rec.customer || rec.remote_client || '—';
    const locLabel = rec.remoteLocation || rec.locationLabel || rec.remote_site || '—';
    const assignedBy = rec.remoteAssignedBy || rec.assignedBy || rec.approvedBy || '—';
    return `👤 Customer: ${customer}\n🏢 Location: ${locLabel}\n📨 Assigned By: ${assignedBy}`;
  }

  // Fallback to lat/lng object
  if (rec.location?.lat != null && rec.location?.lng != null) {
    return `${rec.location.lat.toFixed(4)}, ${rec.location.lng.toFixed(4)}`;
  }

  return 'N/A';
};

const AdminAttendancePage = () => {
  console.log('AdminAttendancePage v2 loaded');
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({
    
    todayPresent: 0,
    todayAbsent: 0,
    todayHalfDay: 0,
    todayRemote: 0,
    todayLateMark: 0,
    totalEmployees: 0,
  });
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectTargetId, setRejectTargetId] = useState(null);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail') || '');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/users/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error('❌ Failed to load users:', err.response?.data || err.message);
    }
  };

  const fetchAllAttendance = async (pg = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append('page', pg);
      query.append('limit', PAGE_SIZE);
      if (selectedMonth) query.append('month', selectedMonth);
      else query.append('date', selectedDate);
      if (selectedUser) query.append('userId', selectedUser);

      const [recordsRes, summaryRes] = await Promise.all([
        axios.get(`/attendance/all?${query.toString()}`),
        axios.get(`/attendance/summary?date=${selectedMonth ? `${selectedMonth}-01` : selectedDate}`),
      ]);

      setRecords(recordsRes.data.records || []);
      setTotalPages(recordsRes.data.totalPages || 1);
      setSummary(summaryRes.data || {});
      console.log('ADMIN attendance records:', recordsRes.data.records);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || '❌ Failed to load attendance.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const reloadCurrentPage = () => fetchAllAttendance(page);

  const approveRecord = async (attendanceId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/attendance/approve/${attendanceId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: '✅ Attendance approved.', severity: 'success' });
      reloadCurrentPage();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || '❌ Failed to approve.',
        severity: 'error',
      });
    }
  };

  const handleOpenReject = (attendanceId) => {
    setRejectTargetId(attendanceId);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const submitReject = async () => {
    if (!rejectTargetId) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/attendance/reject/${rejectTargetId}`, { reason: rejectReason }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: '❌ Attendance rejected.', severity: 'warning' });
      setRejectDialogOpen(false);
      setRejectReason('');
      setRejectTargetId(null);
      reloadCurrentPage();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || '❌ Failed to reject.',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAllAttendance(page);
  }, [page, selectedDate, selectedMonth, selectedUser]);

  const exportToPDF = () => {
    setExporting(true);
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('📋 All Employee Attendance', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['#', 'Name', 'Email', 'Date', 'Status', 'Location', 'Check In', 'Check Out']],
      body: records.map((rec, i) => [
          i + 1,
  rec.name,
  rec.email,
  dayjs(rec.date).format('DD MMM YYYY'),
  rec.status,
  formatAttendanceLocation(rec).replace(/\n/g, ' | '), // flatten for PDF row
  rec.checkInTime || 'N/A',
  rec.checkOutTime || 'N/A',
      ]),
      theme: 'striped',
    });
    doc.save('all-attendance.pdf');
    setExporting(false);
  };

  const exportToExcel = () => {
    setExporting(true);
    const data = records.map((r) => ({
      Name: r.name,
      Email: r.email,
      Date: dayjs(r.date).format('DD MMM YYYY'),
      Status: r.status,
Location: formatAttendanceLocation(r).replace(/\n/g, ' | '),
      CheckIn: r.checkInTime || 'N/A',
      CheckOut: r.checkOutTime || 'N/A',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, 'all-attendance.xlsx');
    setExporting(false);
  };

  return (
    <Box sx={{ background: 'linear-gradient(to bottom right, #e0f7fa, #e1f5fe)', minHeight: '100vh', py: 4 }}>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">📋 Admin Attendance Overview</Typography>
          <Button variant="contained" color="secondary" onClick={() => navigate('/admin')}>
            🔙 Back to Admin Panel
          </Button>
        </Box>

        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="📅 Filter by Date"
              type="date"
              fullWidth
              value={selectedDate}
              onChange={(e) => {
                setSelectedMonth('');
                setPage(1);
                setSelectedDate(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="📆 Filter by Month"
              type="month"
              fullWidth
              value={selectedMonth}
              onChange={(e) => {
                setSelectedDate('');
                setPage(1);
                setSelectedMonth(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="👤 Filter by User"
              fullWidth
              value={selectedUser}
              onChange={(e) => {
                setPage(1);
                setSelectedUser(e.target.value);
              }}
            >
              <MenuItem value="">All Users</MenuItem>
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={3}>
          {[{ label: '✅ Present', value: summary.todayPresent, bg: '#e3f2fd' },
            { label: '❌ Absent', value: summary.todayAbsent, bg: '#ffebee' },
            { label: '🕒 Half Day', value: summary.todayHalfDay, bg: '#fff3e0' },
            { label: '🏃 Remote', value: summary.todayRemote, bg: '#f1f8e9' },
            { label: '🚨 Late Marks Today', value: summary.todayLateMark ?? 0, bg: '#fffde7' },
            { label: '👥 Total', value: summary.totalEmployees, bg: '#e8f5e9' },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: item.bg, boxShadow: 2 }}>
                <Typography variant="h6">{item.label}</Typography>
                <Typography variant="h4">{item.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="outlined" onClick={exportToPDF} disabled={exporting}>🧾 Export PDF</Button>
          <Button variant="outlined" onClick={exportToExcel} disabled={exporting}>📊 Export Excel</Button>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>
        ) : records.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
            No attendance records found.
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#bbdefb' }}>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Late Marks</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                    <TableCell>Approval</TableCell>
                  </TableRow>
                </TableHead>
<TableBody>
  {records.map((rec, idx) => {
    console.log('Row rec:', rec._id, rec.status, rec.approvalStatus, rec.requestedStatus);
    return (
<TableRow key={rec._id}>
  <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
  <TableCell>{rec.name}</TableCell>
  <TableCell>{rec.email}</TableCell>
  <TableCell>
    {typeof rec.lateMarks === 'number' ? (
      <Typography
        variant="body2"
        color={rec.lateMarks >= 3 ? 'error' : 'textSecondary'}
      >
        {rec.lateMarks} / 3
      </Typography>
    ) : '—'}
  </TableCell>
  <TableCell>{dayjs(rec.date).format('DD MMM YYYY')}</TableCell>
        <TableCell>{rec.status}</TableCell>
<TableCell sx={{ whiteSpace: 'pre-line', maxWidth: 240 }}>
  {formatAttendanceLocation(rec)}
</TableCell>
        <TableCell>{rec.checkInTime || 'N/A'}</TableCell>
        <TableCell>{rec.checkOutTime || 'N/A'}</TableCell>
        <TableCell>
          {rec.approvalStatus === 'Pending' && userEmail === 'hr.seekersautomation@gmail.com' ? (
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => approveRecord(rec._id)}
              >
                Approve
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => handleOpenReject(rec._id)}
              >
                Reject
              </Button>
            </Stack>
          ) : rec.approvalStatus === 'Approved' ? (
            <Typography variant="body2" color="success.main">Approved</Typography>
          ) : rec.approvalStatus === 'Rejected' ? (
            <Typography variant="body2" color="error">
              Rejected{rec.rejectionReason ? `: ${rec.rejectionReason}` : ''}
            </Typography>
          ) : '—'}
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>
              </Table>
            </TableContainer>
            <Stack direction="row" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Stack>
          </>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {rejectDialogOpen && (
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1300,
            }}
          >
            <Paper sx={{ p: 3, width: 320 }}>
              <Typography variant="h6" gutterBottom>
                Reject Attendance
              </Typography>
              <TextField
                label="Reason"
                fullWidth
                multiline
                minRows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setRejectDialogOpen(false);
                    setRejectReason('');
                    setRejectTargetId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={submitReject}
                >
                  Reject
                </Button>
              </Stack>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AdminAttendancePage;
