import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Birthday from "../components/Birthday";
import DailyNews from "../components/DailyNews";
import axios from "axios";

export default function Dashboard() {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [autoMarkedAbsent, setAutoMarkedAbsent] = useState(0);

  // ⏰ Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 📣 Announcements
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/admin/broadcasts`)
      .then((res) => setAnnouncements(res.data))
      .catch((err) => console.error("Failed to load announcements:", err));
  }, []);

  // 📅 Upcoming Holidays
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/admin/holidays`)
      .then((res) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ensure full-day comparison
        const upcoming = res.data.filter(
          (h) => new Date(h.date).setHours(0, 0, 0, 0) >= today.getTime()
        );
        setHolidays(upcoming);
      })
      .catch((err) => console.error("Failed to load holidays:", err));
  }, []);

  // ❌ Auto-marked Absent Count
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/attendance/auto-marked`)
      .then((res) => setAutoMarkedAbsent(res.data.count || 0))
      .catch(() => setAutoMarkedAbsent(0));
  }, []);

  // Demo data (optional: replace with real-time data later)
  const attendanceToday = {
    present: 43,
    absent: 5,
    late: 2,
  };

  // 🎁 Reusable SectionCard
  const SectionCard = ({ title, color, children }) => (
    <Card
      elevation={4}
      sx={{
        mb: 4,
        borderLeft: `6px solid ${color}`,
        borderRadius: 3,
        backgroundColor: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(6px)",
        p: 1,
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ color, fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: 'url("https://i.postimg.cc/Yq51br7t/MES.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
        px: 2,
        py: 4,
      }}
    >
      {/* 🔲 Blur Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 0,
        }}
      />

      {/* 📦 Main Content */}
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 900, mx: "auto" }}>
        {/* 🎉 Welcome Box */}
        <Card
          elevation={6}
          sx={{
            mb: 4,
            textAlign: "center",
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.9)",
            p: 2,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            📊 Welcome to Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            <AccessTimeIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            {currentTime.toLocaleTimeString()}
          </Typography>
        </Card>

        {/* ✅ Attendance Summary */}
        <SectionCard title="Attendance Summary (Today)" color="#ff9800">
          {autoMarkedAbsent > 0 && (
            <Typography
              variant="body2"
              color="error"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              ⚠️ {autoMarkedAbsent} employees were auto-marked Absent today.
            </Typography>
          )}
          <Typography
            component={Link}
            to="/attendance?filter=present"
            sx={{
              display: "block",
              color: "inherit",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
              mb: 1,
            }}
          >
            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
            Present: <strong>{attendanceToday.present}</strong>
          </Typography>
          <Typography
            component={Link}
            to="/attendance?filter=absent"
            sx={{
              display: "block",
              color: "inherit",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
              mb: 1,
            }}
          >
            <CheckCircleIcon color="error" sx={{ mr: 1 }} />
            Absent: <strong>{attendanceToday.absent}</strong>
          </Typography>
          <Typography
            component={Link}
            to="/attendance?filter=halfday"
            sx={{
              display: "block",
              color: "inherit",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <CheckCircleIcon color="warning" sx={{ mr: 1 }} />
            Half Day: <strong>{attendanceToday.late}</strong>
          </Typography>
        </SectionCard>

        {/* 🗣️ Broadcast Announcements */}
        <SectionCard title="Announcements" color="#9c27b0">
          <List>
            {announcements.length > 0 ? (
              announcements.map((msg, i) => (
                <ListItem key={i}>
                  <AnnouncementIcon color="secondary" sx={{ mr: 2 }} />
                  <ListItemText primary={msg?.message || "No message"} />
                </ListItem>
              ))
            ) : (
              <Typography>No announcements to display.</Typography>
            )}
          </List>
        </SectionCard>

        {/* 📅 Holidays */}
        <SectionCard title="Upcoming Holidays" color="#f44336">
          <List>
            {holidays.length > 0 ? (
              holidays.map((holiday, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={holiday.name}
                    secondary={new Date(holiday.date).toDateString()}
                  />
                </ListItem>
              ))
            ) : (
              <Typography>No upcoming holidays.</Typography>
            )}
          </List>
        </SectionCard>

        {/* 🎂 Birthdays */}
        <SectionCard title="Today's Birthdays" color="#2196f3">
          <Birthday spinnerSize={20} />
        </SectionCard>

        {/* 📰 News */}
        <SectionCard title="Daily Office News" color="#4caf50">
          <DailyNews spinnerSize={20} />
        </SectionCard>
      </Box>
    </Box>
  );
}
