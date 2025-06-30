// 📁 src/pages/AttendancePage.js
import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Paper, Typography, Stack, Button, Snackbar, Alert, ToggleButtonGroup,
  ToggleButton, CircularProgress, Pagination, Box, TextField,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'api/axios';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import {
  PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip as RechartsTooltip,
} from 'recharts';

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
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationNameMap, setLocationNameMap] = useState({});

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
        const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecords(sorted);
        const today = dayjs().startOf('day');
        const marked = sorted.some((rec) => dayjs(rec.date).isSame(today, 'day'));
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

  useEffect(() => {
    const fetchLocationNames = async () => {
      const cache = JSON.parse(localStorage.getItem('locationCache') || '{}');
      const updatedMap = {};

      for (const rec of paginatedRecords) {
        if (!rec.location?.lat || !rec.location?.lng) continue;

        if (cache[rec._id]) {
          updatedMap[rec._id] = cache[rec._id];
        } else {
          try {
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${rec.location.lat}&lon=${rec.location.lng}`
            );
            updatedMap[rec._id] = res.data.display_name;
            cache[rec._id] = res.data.display_name;
          } catch {
            updatedMap[rec._id] = 'Unknown';
          }
        }
      }

      setLocationNameMap((prev) => ({ ...prev, ...updatedMap }));
      localStorage.setItem('locationCache', JSON.stringify(cache));
    };

    if (paginatedRecords.length) fetchLocationNames();
  }, [paginatedRecords]);

  const isWithinOffice = (lat, lng) => {
    const officeLat = 18.5204, officeLng = 73.8567, radius = 0.2;
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(officeLat - lat);
    const dLon = toRad(officeLng - lng);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(officeLat)) * Math.sin(dLon / 2) ** 2;
    const distance = 2 * R * Math.asin(Math.sqrt(a));
    return distance <= radius;
  };

  const handleMarkAttendance = async (status) => {
    if (loading) return;
    if (
      location.lat &&
      location.lng &&
      status !== 'Remote Work' &&
      !isWithinOffice(location.lat, location.lng)
    ) {
      return setSnackbar({
        open: true,
        message: '❌ Outside office boundary. Attendance not allowed.',
        severity: 'error',
      });
    }

    setLoading(true);
    try {
      const res = await axios.post(
        '/attendance/mark',
        { status, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecords([res.data.attendance, ...records]);
      setSnackbar({ open: true, message: `✅ Marked as ${status}!`, severity: 'success' });
      setAlreadyMarked(true);
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Attendance Records', 10, 10);
    filteredRecords.forEach((rec, i) => {
      doc.text(
        `${i + 1}. ${dayjs(rec.date).format('DD MMM YYYY')} - ${rec.status} | In: ${
          rec.checkInTime || 'N/A'
        } | Out: ${rec.checkOutTime || 'N/A'}`,
        10,
        20 + i * 10
      );
    });
    doc.save('attendance.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRecords.map((r) => ({
        Date: dayjs(r.date).format('DD MMM YYYY'),
        Status: r.status,
        CheckIn: r.checkInTime || 'N/A',
        CheckOut: r.checkOutTime || 'N/A',
        Latitude: r.location?.lat || 'N/A',
        Longitude: r.location?.lng || 'N/A',
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, 'attendance.xlsx');
  };

  const summaryData = [
    { name: 'Present', value: records.filter((r) => r.status === 'Present').length },
    { name: 'Absent', value: records.filter((r) => r.status === 'Absent').length },
    { name: 'Half Day', value: records.filter((r) => r.status === 'Half Day').length },
    { name: 'Remote Work', value: records.filter((r) => r.status === 'Remote Work').length },
  ];

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(50px)', zIndex: -1 }} />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(255,255,255,0.6)', zIndex: -1 }} />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>📅 Attendance Tracker</Typography>

        <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1" gutterBottom>Welcome {userName}, mark your attendance below 👇</Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Button variant="contained" color="success" disabled={alreadyMarked || loading} onClick={() => handleMarkAttendance('Present')}>Mark Present</Button>
            <Button variant="contained" color="error" disabled={alreadyMarked || loading} onClick={() => handleMarkAttendance('Absent')}>Mark Absent</Button>
            <Button variant="contained" color="warning" disabled={alreadyMarked || loading} onClick={() => handleMarkAttendance('Half Day')}>Mark Half Day</Button>
            <Button variant="contained" color="info" disabled={alreadyMarked || loading} onClick={() => handleMarkAttendance('Remote Work')}>Remote Work</Button>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>📊 Attendance Summary</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={summaryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {summaryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>

        <Stack direction="row" spacing={2} alignItems="center" mb={2} flexWrap="wrap">
          <ToggleButtonGroup value={filterStatus} exclusive onChange={(e, val) => val && setFilterStatus(val)} size="small">
            <ToggleButton value="All">All</ToggleButton>
            <ToggleButton value="Present">Present</ToggleButton>
            <ToggleButton value="Absent">Absent</ToggleButton>
            <ToggleButton value="Half Day">Half Day</ToggleButton>
            <ToggleButton value="Remote Work">Remote</ToggleButton>
          </ToggleButtonGroup>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="📅 Filter by Date" value={filterDate} onChange={(val) => setFilterDate(val)} />
          </LocalizationProvider>
          <TextField label="🔍 Search" value={search} onChange={(e) => setSearch(e.target.value)} size="small" />
          <Button variant="outlined" onClick={() => { setFilterDate(null); setSearch(''); setFilterStatus('All'); }}>Clear</Button>
        </Stack>

        {loading ? (
          <Box textAlign="center" py={5}><CircularProgress /></Box>
        ) : (
          paginatedRecords.length === 0 ? (
            <Typography variant="body1" align="center">No attendance records found.</Typography>
          ) : (
            <Paper sx={{ p: 2 }}>
              {paginatedRecords.map((rec) => (
                <Box key={rec._id} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {dayjs(rec.date).format('dddd, DD MMM YYYY')}
                  </Typography>
                  <Typography variant="body1">📌 Status: <strong>{rec.status}</strong></Typography>
                  <Typography variant="body2">🕒 In: {rec.checkInTime || 'N/A'} | Out: {rec.checkOutTime || 'N/A'}</Typography>
                  <Typography variant="caption">📍 Location: {locationNameMap[rec._id] || 'Loading...'}</Typography>
                </Box>
              ))}
              <Stack direction="row" justifyContent="center" mt={2}>
                <Pagination count={Math.ceil(filteredRecords.length / PAGE_SIZE)} page={page} onChange={(e, val) => setPage(val)} />
              </Stack>
            </Paper>
          )
        )}

        <Stack direction="row" spacing={2} mt={3} justifyContent="center">
          <Button variant="outlined" onClick={exportToPDF}>📄 Export PDF</Button>
          <Button variant="outlined" onClick={exportToExcel}>📊 Export Excel</Button>
        </Stack>
      </Container>

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
    </>
  );
};

export default AttendancePage;
