/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useMemo } from 'react';
import { keyframes } from '@emotion/react';
import {
  Container, Paper, Typography, Stack, Button, Snackbar, Alert, ToggleButtonGroup,
  ToggleButton, CircularProgress, Pagination, Box, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import axios from 'api/axios';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import {
  PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip as RechartsTooltip,
} from 'recharts';

// Extend dayjs plugins AFTER imports
dayjs.extend(utc);
dayjs.extend(timezone);

const PAGE_SIZE = 5;
const COLORS = ['#4caf50', '#f44336', '#ff9800', '#2196f3', '#9c27b0']; // Purple for Late Mark
const backgroundImageUrl = 'https://i.postimg.cc/7Z3grwLw/MES.jpg';
// ✅ Reusable animations (avoid duplicate keyframes)
const slideIn = keyframes`
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

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
  const [nowIST, setNowIST] = useState(dayjs().tz('Asia/Kolkata'));
  const [lateMarkCount, setLateMarkCount] = useState(0);

  // Haversine formula for distance in km
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || '👤 User';

  const isAfter945IST = dayjs().tz('Asia/Kolkata').isAfter(dayjs().tz('Asia/Kolkata').hour(9).minute(45));

useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const gpsLat = pos.coords.latitude;
      const gpsLng = pos.coords.longitude;

      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();

        const ipLat = parseFloat(ipData.latitude);
        const ipLng = parseFloat(ipData.longitude);

        const gpsDistance = getDistance(gpsLat, gpsLng, ipLat, ipLng);
        if (gpsDistance > 20) {
          setSnackbar({
            open: true,
            message: '⚠️ Location mismatch between GPS and IP. Please disable spoofing tools.',
            severity: 'error',
          });
          return;
        }

        setLocation({ lat: gpsLat, lng: gpsLng });
      } catch {
        setLocation({ lat: gpsLat, lng: gpsLng });
      }
    },
    () => setLocation({ lat: 'Permission denied', lng: '' }),
    { enableHighAccuracy: true, timeout: 10000 }
  );
}, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/attendance/my', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const start = dayjs('2025-07-01');
        const end = dayjs().startOf('day');
        const allDates = [];
        for (let i = 0; i <= end.diff(start, 'day'); i++) {
          allDates.push(start.add(i, 'day').format('YYYY-MM-DD'));
        }

        const markedMap = new Map(
          res.data.map((rec) => [dayjs(rec.date).format('YYYY-MM-DD'), rec])
        );
        const filled = allDates.map((dateStr) => {
          return markedMap.get(dateStr) || {
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
      } catch (err) {
  console.error('Fetch attendance error:', err);
  setSnackbar({ open: true, message: 'Failed to fetch attendance', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [token]);
  useEffect(() => {
  const countLateMarks = () => {
    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();

    const lateMarks = records.filter((rec) => {
      const recDate = dayjs(rec.date);
      return (
        rec.status === 'Late Mark' &&
        recDate.month() === currentMonth &&
        recDate.year() === currentYear
      );
    });

    setLateMarkCount(lateMarks.length);
  };

  if (records.length > 0) {
    countLateMarks();
  }
}, [records]);
  // ✅ THIS SHOULD BE OUTSIDE, NOT NESTED
useEffect(() => {
  const interval = setInterval(() => {
    setNowIST(dayjs().tz('Asia/Kolkata'));
  }, 1000);
  return () => clearInterval(interval);
}, []);

  const isWithinOffice = (lat, lng) => {
    const officeLat = 18.641478153875, officeLng = 73.79522807016143, radius = 1;
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

if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
  try {
    const ipRes = await fetch('https://ipapi.co/json/');
    const ipData = await ipRes.json();
    const userIP = ipData.ip;
    const officeWiFiIP = '2401:4900:8fea:d8f6';

    if (userIP === officeWiFiIP) {
      return markAttendance(status, {
        note: '📶 Location failed but verified via Office WiFi IP',
      });
    }

    return setSnackbar({
      open: true,
      message: '📍 Location not detected. Connect to Office WiFi to mark attendance.',
      severity: 'error',
    });
  } catch (err) {
    return setSnackbar({
      open: true,
      message: '❌ Error checking fallback WiFi. Try again.',
      severity: 'error',
    });
  }
}

    if (status === 'Remote Work') {
      setRemoteDialogOpen(true);
      return;
    }
    if (status === 'Late Mark' && lateMarkCount >= 3) {
  return setSnackbar({
    open: true,
    message: '❌ You’ve reached your Late Mark limit for this month. Be on time.',
    severity: 'error',
  });
}


    const outside = location.lat && location.lng && !isWithinOffice(location.lat, location.lng);

    if (outside && (status === 'Present' || status === 'Half Day')) {
      markAttendance(status);
      return setSnackbar({
        open: true,
        message: `⚠ Outside office boundary. Attendance marked as ${status} & admin notified.`,
        severity: 'warning',
      });
    }

    markAttendance(status);
  };

  const markAttendance = async (status, extra = {}) => {
    setLoading(true);
    const now = dayjs().tz('Asia/Kolkata');
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
      setSnackbar({ open: true, message: `✅ Marked as ${status}!`, severity: 'success' });
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
    { name: 'Late Mark', value: monthYearRecords.filter((r) => r.status === 'Late Mark').length },
  ];

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
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(50px)',
          zIndex: -1,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(255,255,255,0.6)',
          zIndex: -1,
        }}
      />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📅 Attendance Tracker
        </Typography>

        <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1" gutterBottom>
            Welcome {userName}, mark your attendance below 👇
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              color="success"
              disabled={alreadyMarked || loading || isAfter945IST}
              onClick={() => handleMarkAttendance('Present')}
            >
              Mark Present
            </Button>
{nowIST.isBefore(dayjs().tz('Asia/Kolkata').hour(9).minute(45)) ? (
  <Button
    variant="outlined"
    disabled
    title="⏳ Late Mark will be available after 9:45 AM"
sx={{
  animation: `${fadeIn} 0.5s`,
}}
  >
    Late Mark
  </Button>
) : isAfter945IST && nowIST.isBefore(dayjs().tz('Asia/Kolkata').hour(11)) && (
  <Button
    variant="contained"
    color={lateMarkCount >= 3 ? "error" : "secondary"}
    disabled={alreadyMarked || loading || lateMarkCount >= 3}
    onClick={() => handleMarkAttendance('Late Mark')}
sx={{
  animation: `${slideIn} 0.4s ease-in-out`,
}}
  >
    Mark Late
  </Button>
)}
            <Button
              variant="contained"
              color="warning"
              disabled={alreadyMarked || loading}
              onClick={() => handleMarkAttendance('Half Day')}
            >
              Mark Half Day
            </Button>
            <Button
              variant="contained"
              color="info"
              disabled={alreadyMarked || loading}
              onClick={() => handleMarkAttendance('Remote Work')}
            >
              Remote Work
            </Button>
          </Stack>

<Typography variant="body2" sx={{ mt: 2 }}>
  🕒 IST Time Now: {nowIST.format('HH:mm:ss')}
</Typography>
<Typography variant="body2" color={lateMarkCount >= 3 ? 'error' : 'textSecondary'}>
  🚨 Late Marks Used: {lateMarkCount} / 3
</Typography>


{alreadyMarked ? (
  <Typography variant="body2" color="success" sx={{ mt: 1 }}>
    ✅ You've already marked your attendance for today.
  </Typography>
) : isAfter945IST ? (
  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
    ⚠️ Present option disabled after 9:45 AM. Use Late Mark if still available.
  </Typography>
) : null}
          
        </Paper>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">📊 Attendance Summary - {filterMonth.format('MMMM YYYY')}</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={['year', 'month']}
                label="📆 Filter Summary by Month"
                value={filterMonth}
                onChange={(val) => setFilterMonth(val)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
          </Stack>
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
<ToggleButtonGroup
  value={filterStatus}
  exclusive
  onChange={(e, val) => val && setFilterStatus(val)}
  size="small"
>
  <ToggleButton value="All">All</ToggleButton>
  <ToggleButton value="Present">Present</ToggleButton>
  <ToggleButton value="Absent">Absent</ToggleButton>
  <ToggleButton value="Half Day">Half Day</ToggleButton>
  <ToggleButton value="Remote Work">Remote</ToggleButton>
  <ToggleButton value="Late Mark">Late Mark</ToggleButton> {/* ✅ NEW */}
</ToggleButtonGroup>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="📅 Filter by Date" value={filterDate} onChange={(val) => setFilterDate(val)} />
          </LocalizationProvider>
          <TextField label="🔍 Search" value={search} onChange={(e) => setSearch(e.target.value)} size="small" />
          <Button
            variant="outlined"
            onClick={() => {
              setFilterDate(null);
              setSearch('');
              setFilterStatus('All');
            }}
          >
            Clear
          </Button>
        </Stack>
        {loading ? (
          <Box textAlign="center" py={5}>
            <CircularProgress />
          </Box>
        ) : paginatedRecords.length === 0 ? (
          <Typography variant="body1" align="center">
            No attendance records found.
          </Typography>
        ) : (
          <Paper sx={{ p: 2 }}>
            {paginatedRecords.map((rec) => (
              <Box key={rec._id} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  {dayjs(rec.date).format('dddd, DD MMM YYYY')}
                </Typography>
                <Typography variant="body1">
                  📌 Status:{' '}
                  <strong
                    style={{
                      color:
                        rec.status === 'Present'
                          ? '#4caf50'
                          : rec.status === 'Absent'
                          ? '#f44336'
                          : rec.status === 'Half Day'
                          ? '#ff9800'
                          : '#2196f3',
                    }}
                  >
                    {rec.status}
                  </strong>
                </Typography>
                {rec.status === 'Remote Work' && (
                  <>
                    {rec.customer && <Typography variant="body2">👤 Customer: {rec.customer}</Typography>}
                    {rec.workLocation && <Typography variant="body2">🏢 Location: {rec.workLocation}</Typography>}
                    {rec.assignedBy && <Typography variant="body2">📨 Assigned By: {rec.assignedBy}</Typography>}
                  </>
                )}
                <Typography variant="body2">
                  🕒 In: {rec.checkInTime || 'N/A'} | Out: {rec.checkOutTime || 'N/A'}
                </Typography>
              </Box>
            ))}
            <Stack direction="row" justifyContent="center" mt={2}>
              <Pagination
                count={Math.ceil(filteredRecords.length / PAGE_SIZE)}
                page={page}
                onChange={(e, val) => setPage(val)}
              />
            </Stack>
          </Paper>
        )}

        <Stack direction="row" spacing={2} mt={3} justifyContent="center">
          <Button variant="outlined" onClick={exportToPDF}>
            📄 Export PDF
          </Button>
          <Button variant="outlined" onClick={exportToExcel}>
            📊 Export Excel
          </Button>
        </Stack>
      </Container>

      <Dialog open={remoteDialogOpen} onClose={() => setRemoteDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Remote Work Details</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="👤 Customer Name"
            value={remoteForm.customer}
            onChange={(e) => setRemoteForm({ ...remoteForm, customer: e.target.value })}
            required
          />
          <TextField
            label="🏢 Work Location"
            value={remoteForm.workLocation}
            onChange={(e) => setRemoteForm({ ...remoteForm, workLocation: e.target.value })}
            required
          />
          <TextField
            label="📨 Assigned By"
            value={remoteForm.assignedBy}
            onChange={(e) => setRemoteForm({ ...remoteForm, assignedBy: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!remoteForm.customer || !remoteForm.workLocation || !remoteForm.assignedBy) {
                setSnackbar({ open: true, message: 'All fields are required.', severity: 'warning' });
                return;
              }
              markAttendance('Remote Work', remoteForm);
            }}
          >
            Submit
          </Button>
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
    </>
  );
};

export default AttendancePage;
