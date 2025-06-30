import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, CircularProgress, IconButton, Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from 'api/axios';

const API_KEY = 'c8492a7984470daba608fb2d28ef150a';
const backgroundImage = 'https://i.postimg.cc/QCsvqJ67/Industrial-Automation.jpg';

const getIcon = (condition) => {
  const cond = condition.toLowerCase();
  if (cond.includes('cloud')) return <CloudIcon fontSize="large" />;
  if (cond.includes('storm') || cond.includes('rain')) return <ThunderstormIcon fontSize="large" />;
  return <WbSunnyIcon fontSize="large" />;
};

const WeatherReport = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat: 18.5204, // Pune latitude
            lon: 73.8567, // Pune longitude
            units: 'metric',
            appid: API_KEY,
          },
        }
      );
      const d = res.data;
      setData({
        location: `${d.name}, ${d.sys.country}`,
        temp: Math.round(d.main.temp),
        condition: d.weather[0].main,
        humidity: d.main.humidity,
        wind: Math.round(d.wind.speed),
        date: new Date(d.dt * 1000).toLocaleString(),
      });
    } catch (err) {
      console.error('API error:', err);
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />
      {/* Blur Layer */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(30px)',
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 1,
        }}
      />
      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          px: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            maxWidth: 500,
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Tooltip title="Back">
              <IconButton onClick={() => navigate('/more-functions')}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h5" fontWeight="bold">⛅ Weather Report</Typography>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchWeather}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {loading ? (
            <CircularProgress />
          ) : data ? (
            <>
              <Typography variant="h6">{data.location}</Typography>
              <Typography variant="subtitle2" color="text.secondary">{data.date}</Typography>
              <Box mt={3}>{getIcon(data.condition)}</Box>
              <Typography variant="h2" fontWeight="bold" mt={1}>{data.temp}°C</Typography>
              <Typography variant="h6" color="text.secondary">{data.condition}</Typography>
              <Box mt={3}>
                <Typography>💧 Humidity: {data.humidity}%</Typography>
                <Typography>💨 Wind: {data.wind} m/s</Typography>
              </Box>
            </>
          ) : (
            <Typography color="error">❌ Could not fetch weather.</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default WeatherReport;
