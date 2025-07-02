import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Snackbar, Alert, Stack, Box,
  Grid, Pagination, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'api/axios';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const PAGE_SIZE = 10;

const AdminAttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({});
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users/list'); // Adjust to your users endpoint
      setUsers(res.data || []);
    } catch {}
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = {
        page, limit: PAGE_SIZE,
        date: selectedDate,
        month: selectedMonth.format('YYYY-MM'),
        userId: selectedUser
      };
      const [attRes, sumRes] = await Promise.all([
        axios.get('/attendance/all', { params }),
        axios.get('/attendance/summary', { params: { date: selectedDate }}),
      ]);
      setRecords(attRes.data.records || []);
      setTotalPages(attRes.data.totalPages || 1);
      setSummary(sumRes.data || {});
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAttendance();
  }, [page, selectedDate, selectedMonth, selectedUser]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Admin Attendance Report', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['#','Name','Email','Date','Status','In','Out']],
      body: records.map((r,i)=>[
        i+1, r.name, r.email, dayjs(r.date).format('DD MMM YYYY'),
        r.status, r.checkInTime||'N/A', r.checkOutTime||'N/A'
      ])
    });
    doc.save('attendance.pdf');
  };

  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(records.map(r=>({
      Name: r.name,
      Email: r.email,
      Date: dayjs(r.date).format('DD MMM YYYY'),
      Status: r.status,
      CheckIn: r.checkInTime||'N/A',
      CheckOut: r.checkOutTime||'N/A'
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, 'Attendance');
    XLSX.writeFile(wb, 'attendance.xlsx');
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Box sx={{ display:'flex', justifyContent:'space-between', mb:3 }}>
          <Typography variant="h4">Admin Attendance</Typography>
          <Button onClick={() => navigate('/admin')}>Back</Button>
        </Box>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={4}>
            <DatePicker
              label="Filter by Date"
              value={dayjs(selectedDate)}
              onChange={d => { setSelectedDate(d.format('YYYY-MM-DD')); setPage(1); }}
              renderInput={(params)=> <TextField fullWidth {...params}/> }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={['year','month']}
                label="Filter by Month"
                value={selectedMonth}
                onChange={d => { setSelectedMonth(d); setPage(1); }}
                renderInput={(params)=> <TextField fullWidth {...params}/> }
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>User</InputLabel>
              <Select
                value={selectedUser}
                label="User"
                onChange={e => { setSelectedUser(e.target.value); setPage(1); }}
              >
                <MenuItem value="">All Users</MenuItem>
                {users.map(u => (
                  <MenuItem key={u._id} value={u._id}>{u.name} ({u.email})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} mb={2}>
          <Button onClick={exportPDF}>Export PDF</Button>
          <Button onClick={exportExcel}>Export Excel</Button>
        </Stack>

        {loading ? (
          <Box textAlign="center"><CircularProgress /></Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>In</TableCell>
                    <TableCell>Out</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((r,i)=>(
                    <TableRow key={r._id}>
                      <TableCell>{(page-1)*PAGE_SIZE + i +1}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.email}</TableCell>
                      <TableCell>{dayjs(r.date).format('DD MMM YYYY')}</TableCell>
                      <TableCell>{r.status}</TableCell>
                      <TableCell>{r.checkInTime||'N/A'}</TableCell>
                      <TableCell>{r.checkOutTime||'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e,v)=> setPage(v)}
              sx={{ mt:2 }}
            />
          </>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={()=>setSnackbar({...snackbar,open:false})}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminAttendancePage;
