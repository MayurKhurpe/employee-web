// 📁 src/pages/LeaveCalendar.js
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Box, Card, Typography, useTheme } from '@mui/material';

// 📅 Sample Leave Events (can be fetched dynamically later)
const leaveEvents = [
  {
    title: 'Mayur - Sick Leave',
    start: '2025-06-20',
    end: '2025-06-23', // Note: FullCalendar treats "end" as exclusive
    color: '#f44336',
  },
  {
    title: 'John - Casual Leave',
    start: '2025-06-25',
    end: '2025-06-27',
    color: '#2196f3',
  },
];

const LeaveCalendar = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          boxShadow: 6,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          📆 Leave Calendar
        </Typography>

        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={leaveEvents}
          height="auto"
          headerToolbar={{
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,dayGridWeek',
          }}
        />
      </Card>
    </Box>
  );
};

export default LeaveCalendar;
