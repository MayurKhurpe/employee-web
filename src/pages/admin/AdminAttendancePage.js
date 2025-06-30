// 📁 src/pages/admin/AdminAttendancePage.js
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
  const [summary, setSummary] = useState({
    todayPresent: 0,
    todayAbsent: 0,
    todayHalfDay: 0,
    todayRemote: 0,
    totalEmployees: 0,
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchAllAttendance = async (pg = 1) => {
    setLoading(true);
    try {
      const [recordsRes, summaryRes] = await Promise.all([
        axios.get(`/attendance/all?page=${pg}&limit=${PAGE_SIZE}`),
        axios.get('/attendance/summary'),
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
    fetchAllAttendance(page);
  }, [page]);

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
        typeof rec.location === 'string'
          ? rec.location
          : rec.location?.lat
          ? `${rec.location.lat.toFixed(4)}, ${rec.location.lng.toFixed(4)}`
          : 'N/A',
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
      Location:
        typeof r.location === 'string'
          ? r.location
          : r.location?.lat
          ? `${r.location.lat}, ${r.location.lng}`
          : 'N/A',
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
          {[{ label: '✅ Present', value: summary.todayPresent, bg: '#e3f2fd' },
            { label: '❌ Absent', value: summary.todayAbsent, bg: '#ffebee' },
            { label: '🕒 Half Day', value: summary.todayHalfDay, bg: '#fff3e0' },
            { label: '🏃 Remote', value: summary.todayRemote, bg: '#f1f8e9' },
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
          <Button variant="outlined" onClick={exportToPDF} disabled={exporting}>
            🧾 Export PDF
          </Button>
          <Button variant="outlined" onClick={exportToExcel} disabled={exporting}>
            📊 Export Excel
          </Button>
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
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((rec, idx) => (
                    <TableRow key={rec._id}>
                      <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                      <TableCell>{rec.name}</TableCell>
                      <TableCell>{rec.email}</TableCell>
                      <TableCell>{dayjs(rec.date).format('DD MMM YYYY')}</TableCell>
                      <TableCell>{rec.status}</TableCell>
                      <TableCell>
                        {typeof rec.location === 'string'
                          ? rec.location
                          : rec.location?.lat
                          ? `${rec.location.lat.toFixed(4)}, ${rec.location.lng.toFixed(4)}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{rec.checkInTime || 'N/A'}</TableCell>
                      <TableCell>{rec.checkOutTime || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
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
      </Container>
    </Box>
  );
};

export default AdminAttendancePage;
