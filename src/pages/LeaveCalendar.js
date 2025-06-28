import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Box, Card, Typography } from '@mui/material';

const leaveEvents = [
  {
    title: 'Mayur - Sick Leave',
    start: '2025-06-20',
    end: '2025-06-22',
    color: '#f44336',
  },
  {
    title: 'John - Casual Leave',
    start: '2025-06-25',
    end: '2025-06-26',
    color: '#2196f3',
  },
];

const LeaveCalendar = () => (
  <Box sx={{ p: 3 }}>
    <Card sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>📆 Leave Calendar</Typography>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={leaveEvents}
        height="auto"
      />
    </Card>
  </Box>
);

export default LeaveCalendar;
