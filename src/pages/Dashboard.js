// 📁 src/pages/Dashboard.js
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
import AnnouncementIcon from "@mui/icons-material/Announcement";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Birthday from "../components/Birthday";
import axios from "../api/axios"; // ✅ Use centralized axios

export default function Dashboard() {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [shouldRefreshBirthday, setShouldRefreshBirthday] = useState(false);

  // ⏰ Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🎂 Birthday Refresh Once Per Day
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const lastFetch = localStorage.getItem("lastBirthdayFetch");
    if (lastFetch !== todayStr) {
      setShouldRefreshBirthday(true);
      localStorage.setItem("lastBirthdayFetch", todayStr);
    } else {
      setShouldRefreshBirthday(false);
    }
  }, []);

  // 📣 Load Announcements
  useEffect(() => {
    axios
      .get("/admin/broadcasts")
      .then((res) => setAnnouncements(res.data))
      .catch((err) => console.error("❌ Failed to load announcements:", err));
  }, []);

  // 📅 Load Holidays
  useEffect(() => {
    axios
      .get("/admin/holidays")
      .then((res) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = res.data.filter(
          (h) => new Date(h.date).setHours(0, 0, 0, 0) >= today.getTime()
        );
        setHolidays(upcoming);
      })
      .catch((err) => console.error("❌ Failed to load holidays:", err));
  }, []);

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

      {/* 📦 Dashboard Content */}
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 900, mx: "auto" }}>
        {/* 🎉 Header */}
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

        {/* 📣 Announcements */}
        <SectionCard title="Announcements" color="#9c27b0">
          {announcements.filter(
            (msg) => msg.audience === "all" || msg.audience === "employee"
          ).length > 0 ? (
            <List>
              {announcements
                .filter(
                  (msg) =>
                    msg.audience === "all" || msg.audience === "employee"
                )
                .map((msg, i) => (
                  <ListItem key={i}>
                    <AnnouncementIcon color="secondary" sx={{ mr: 2 }} />
                    <ListItemText
                      primary={msg?.message || "No message"}
                      secondary={
                        new Date(msg?.createdAt).toLocaleString() +
                        (msg.audience !== "all"
                          ? ` • (${msg.audience})`
                          : "")
                      }
                    />
                  </ListItem>
                ))}
            </List>
          ) : (
            <Typography>No announcements for you yet.</Typography>
          )}
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
          <Birthday spinnerSize={20} refresh={shouldRefreshBirthday} />
        </SectionCard>
      </Box>
    </Box>
  );
}
