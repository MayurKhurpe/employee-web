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
import axios from '../api/axios'; // ✅ CENTRALIZED AXIOS
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

// ⛳ Constants
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

  // 📍 Get GPS
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation({ lat: 'Permission denied', lng: '' })
    );
  }, []);

  // 📅 Load Attendance Records
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

  // 🎛️ Filter + Search
  useEffect(() => {
    let temp = [...records];
    if (filterStatus !== 'All') temp = temp.filter((r) => r.status === filterStatus);
    if (filterDate) temp = temp.filter((r) => dayjs(r.date).isSame(filterDate, 'day'));
    if (search) temp = temp.filter((r) => r.status.toLowerCase().includes(search.toLowerCase()));
    setFilteredRecords(temp);
    setPage(1);
  }, [records, filterStatus, filterDate, search]);

  // 🗺️ Reverse GeoCoding
  useEffect(() => {
    const fetchLocationNames = async () => {
      const promises = records.map(async (rec) => {
        if (rec.location?.lat && rec.location?.lng && !locationNameMap[rec._id]) {
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

    if (records.length) fetchLocationNames();
  }, [records, locationNameMap]);

  // 📍 Location Boundary Check
  const isWithinOffice = (lat, lng) => {
    const officeLat = 18.5204;
    const officeLng = 73.8567;
    const radius = 5;
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

  // 📍 Mark Attendance
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

  // 📤 Export
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

  // 📊 Summary Data
  const summaryData = [
    { name: 'Present', value: records.filter((r) => r.status === 'Present').length },
    { name: 'Absent', value: records.filter((r) => r.status === 'Absent').length },
    { name: 'Half Day', value: records.filter((r) => r.status === 'Half Day').length },
    { name: 'Remote Work', value: records.filter((r) => r.status === 'Remote Work').length },
  ];

  const paginatedRecords = filteredRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      {/* Background Blur */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover',
        backgroundPosition: 'center', filter: 'blur(50px)', zIndex: -1
      }} />
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(255,255,255,0.6)', zIndex: -1,
      }} />

      {/* ✅ Final UI continues here (same as your original) */}
      {/* ... keep all other JSX the same as in your version above ... */}
    </>
  );
};

export default AttendancePage;
