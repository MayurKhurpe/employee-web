// ✅ AdminAttendancePage.js
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Snackbar, Alert, Stack, Box, Grid,
  Pagination, TextField
} from '@mui/material';
import axios from 'api/axios';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

const AdminAttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedMonth, setSelectedMonth] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchAllAttendance = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', PAGE_SIZE);
      if (selectedDate) queryParams.append('date', selectedDate);
      if (selectedMonth) queryParams.append('month', selectedMonth);
      if (userSearch) queryParams.append('search', userSearch);

      const [recordsRes, summaryRes] = await Promise.all([
        axios.get(`/attendance/all?${queryParams.toString()}`),
        axios.get(`/attendance/summary?date=${selectedDate}`),
      ]);

      setRecords(recordsRes.data.records || []);
      setTotalPages(recordsRes.data.totalPages || 1);
      setSummary(summaryRes.data || {});
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

  useEffect(() => {
    fetchAllAttendance();
  }, [page, selectedDate, selectedMonth, userSearch]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('📋 Admin Attendance Report', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['#', 'Name', 'Email', 'Date', 'Status', 'Check In', 'Check Out']],
      body: records.map((rec, i) => [
        i + 1,
        rec.name,
        rec.email,
        dayjs(rec.date).format('DD MMM YYYY'),
        rec.status,
        rec.checkInTime || 'N/A',
        rec.checkOutTime || 'N/A',
      ]),
    });
    doc.save('attendance.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      records.map((r) => ({
        Name: r.name,
        Email: r.email,
        Date: dayjs(r.date).format('DD MMM YYYY'),
        Status: r.status,
        CheckIn: r.checkInTime || 'N/A',
        CheckOut: r.checkOutTime || 'N/A',
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, 'attendance.xlsx');
  };

  return (
    <Box sx={{ background: 'linear-gradient(to bottom right, #e0f7fa, #e1f5fe)', minHeight: '100vh', py: 4 }}>
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">📋 Admin Attendance Overview</Typography>
          <Button variant="contained" onClick={() => navigate('/admin')}>🔙 Admin Panel</Button>
        </Box>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="📅 Filter by Date" type="date"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setPage(1); }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="📆 Filter by Month (YYYY-MM)"
              value={selectedMonth}
              onChange={(e) => { setSelectedMonth(e.target.value); setPage(1); }}
              placeholder="2025-07"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="🔍 Search by User Name/Email"
              value={userSearch}
              onChange={(e) => { setUserSearch(e.target.value); setPage(1); }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={3}>
          {[
            { label: '✅ Present', value: summary.todayPresent },
            { label: '❌ Absent', value: summary.todayAbsent },
            { label: '🕒 Half Day', value: summary.todayHalfDay },
            { label: '🏃 Remote', value: summary.todayRemote },
            { label: '👥 Total', value: summary.totalEmployees },
          ].map((item, i) => (
            <Grid item xs={12} sm={6} md={2.4} key={i}>
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#f0f4c3' }}>
                <Typography variant="h6">{item.label}</Typography>
                <Typography variant="h4">{item.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Stack direction="row" spacing={2} mb={2}>
          <Button variant="outlined" onClick={exportToPDF}>📄 Export PDF</Button>
          <Button variant="outlined" onClick={exportToExcel}>📊 Export Excel</Button>
        </Stack>

        {loading ? (
          <Box textAlign="center" mt={5}><CircularProgress /></Box>
        ) : records.length === 0 ? (
          <Typography align="center" mt={4}>No attendance found.</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#bbdefb' }}>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((rec, i) => (
                    <TableRow key={rec._id}>
                      <TableCell>{(page - 1) * PAGE_SIZE + i + 1}</TableCell>
                      <TableCell>{rec.name}</TableCell>
                      <TableCell>{rec.email}</TableCell>
                      <TableCell>{dayjs(rec.date).format('DD MMM YYYY')}</TableCell>
                      <TableCell>{rec.status}</TableCell>
                      <TableCell>{rec.checkInTime || 'N/A'}</TableCell>
                      <TableCell>{rec.checkOutTime || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack direction="row" justifyContent="center" mt={3}>
              <Pagination count={totalPages} page={page} onChange={(e, val) => setPage(val)} />
            </Stack>
          </>
        )}

        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminAttendancePage;
