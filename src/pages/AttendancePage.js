// ✅ Final Updated AttendancePage.js with correct backend route
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Pagination,
  Box,
  TextField,
} from '@mui/material';
import { LocalizationProvider, DatePicker, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';

const PAGE_SIZE = 5;
const COLORS = ['#4caf50', '#f44336', '#ff9800', '#2196f3'];
const backgroundImageUrl = 'https://i.postimg.cc/7Z3grwLw/MES.jpg';

const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
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
        const res = await axios.get('https://employee-backend-kifp.onrender.com/api/attendance/my', {
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

  useEffect(() => {
    let temp = [...records];
    if (filterStatus !== 'All') temp = temp.filter((r) => r.status === filterStatus);
    if (filterDate) temp = temp.filter((r) => dayjs(r.date).isSame(filterDate, 'day'));
    if (search) temp = temp.filter((r) => r.status.toLowerCase().includes(search.toLowerCase()));
    setFilteredRecords(temp);
    setPage(1);
  }, [records, filterStatus, filterDate, search]);

  useEffect(() => {
    const fetchLocationNames = async () => {
      const promises = records.map(async (rec) => {
        if (
          rec.location?.lat &&
          rec.location?.lng &&
          !Object.hasOwn(locationNameMap, rec._id)
        ) {
          try {
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${rec.location.lat}&lon=${rec.location.lng}`
            );
            return { id: rec._id, name: res.data.display_name };
          } catch {
            return { id: rec._id, name: 'Unknown Location' };
          }
        }
        return null;
      });

      const results = await Promise.all(promises);
      const updatedMap = {};
      results.forEach((res) => {
        if (res) updatedMap[res.id] = res.name;
      });

      setLocationNameMap((prev) => ({ ...prev, ...updatedMap }));
    };

    if (records.length) {
      fetchLocationNames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records]);

  const isWithinOffice = (lat, lng) => {
    const officeLat = 18.5204;
    const officeLng = 73.8567;
    const radius = 5; // for km setting
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(officeLat - lat);
    const dLon = toRad(officeLng - lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat)) * Math.cos(toRad(officeLat)) * Math.sin(dLon / 2) ** 2;
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
      setSnackbar({
        open: true,
        message: '❌ Outside office boundary. Attendance not allowed.',
        severity: 'error',
      });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        'https://employee-backend-kifp.onrender.com/api/attendance/mark',
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

  const paginatedRecords = filteredRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      {/* 🌄 Background Blur */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(50px)', zIndex: -1,
      }} />
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(255,255,255,0.6)', zIndex: -1,
      }} />

      {/* 📅 Calendar */}
      <Box sx={{
        position: 'fixed', top: 100, right: 30, zIndex: 3,
        background: 'white', p: 2, borderRadius: 2, border: '1px solid #ccc', boxShadow: 3,
      }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={dayjs()}
            readOnly
            views={['day']}
            slotProps={{
              day: {
                renderDay: (day, _value, DayComponentProps) => {
                  const rec = records.find((r) => dayjs(r.date).isSame(day, 'day'));
                  let dotColor = '';
                  if (rec?.status === 'Present') dotColor = '#4caf50';
                  else if (rec?.status === 'Absent') dotColor = '#f44336';
                  else if (rec?.status === 'Half Day') dotColor = '#ff9800';
                  else if (rec?.status === 'Remote Work') dotColor = '#2196f3';

                  return (
                    <Box sx={{ position: 'relative' }}>
                      <Box component="span" {...DayComponentProps} />
                      {dotColor && (
                        <Box sx={{
                          width: 6, height: 6, borderRadius: '50%', backgroundColor: dotColor,
                          position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                        }} />
                      )}
                    </Box>
                  );
                },
              },
            }}
          />
        </LocalizationProvider>
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Typography variant="caption">
            🟢 Present &nbsp; 🔴 Absent &nbsp; 🟠 Half Day &nbsp; 🔵 Remote
          </Typography>
        </Box>
      </Box>

      <Container sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" gutterBottom>📅 Attendance</Typography>
        <Typography variant="h6" gutterBottom>Welcome, {userName}</Typography>

        {!alreadyMarked && (
          <Stack direction="row" spacing={2} sx={{ my: 2, flexWrap: 'wrap' }}>
            {['Present', 'Absent', 'Half Day', 'Remote Work'].map((status) => (
              <Button key={status} variant="contained" onClick={() => handleMarkAttendance(status)}>
                {status}
              </Button>
            ))}
          </Stack>
        )}

        <Paper sx={{ p: 2, mb: 5, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" gutterBottom>📊 Attendance Summary</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={summaryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {summaryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <ToggleButtonGroup
            color="primary"
            value={filterStatus}
            exclusive
            onChange={(e, val) => val && setFilterStatus(val)}
          >
            <ToggleButton value="All">All</ToggleButton>
            <ToggleButton value="Present">✅ Present</ToggleButton>
            <ToggleButton value="Absent">❌ Absent</ToggleButton>
            <ToggleButton value="Half Day">🌗 Half Day</ToggleButton>
            <ToggleButton value="Remote Work">🏠 Remote</ToggleButton>
          </ToggleButtonGroup>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Filter by Date"
              value={filterDate}
              onChange={(val) => setFilterDate(val)}
              slotProps={{ textField: { size: 'small' } }}
            />
          </LocalizationProvider>

          <TextField
            label="Search"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button onClick={exportToPDF} variant="outlined">Export PDF</Button>
          <Button onClick={exportToExcel} variant="outlined">Export Excel</Button>
        </Stack>

        {loading ? (
          <CircularProgress />
        ) : (
          paginatedRecords.map((rec) => (
            <Paper key={rec._id} sx={{ p: 2, mb: 2 }}>
              <Typography>{dayjs(rec.date).format('DD MMM YYYY')} — <strong>{rec.status}</strong></Typography>
              <Typography variant="body2">Check-in: {rec.checkInTime || 'N/A'} | Check-out: {rec.checkOutTime || 'N/A'}</Typography>
              <Typography variant="body2">
                📍 Location:&nbsp;
                {rec.location?.lat && rec.location?.lng ? (
                  <>
                    <a
                      href={`https://www.google.com/maps?q=${rec.location.lat},${rec.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {rec.location.lat.toFixed(4)}, {rec.location.lng.toFixed(4)}
                    </a><br />
                    <Typography variant="caption" color="text.secondary">
                      📌 {locationNameMap[rec._id] || 'Loading location...'}
                    </Typography>
                  </>
                ) : 'N/A'}
              </Typography>
            </Paper>
          ))
        )}

        {filteredRecords.length > PAGE_SIZE && (
          <Pagination
            count={Math.ceil(filteredRecords.length / PAGE_SIZE)}
            page={page}
            onChange={(e, val) => setPage(val)}
            sx={{ mt: 2 }}
          />
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          position: 'fixed', top: '20px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 9999,
        }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AttendancePage;
