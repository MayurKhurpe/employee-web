import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';

const TimerPage = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [mode, setMode] = useState('pomodoro');
  const [autoSwitch] = useState(true);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const stopwatchRef = useRef(null);
  const [laps, setLaps] = useState([]);

  const beep = useMemo(() => new Audio('https://www.soundjay.com/button/beep-07.wav'), []);

  const modes = useMemo(() => ({
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
  }), []);

  const switchMode = useCallback(() => {
    const next = mode === 'pomodoro' ? 'short' : 'pomodoro';
    setMode(next);
    setTimeLeft(modes[next]);
    setTimerRunning(true);
  }, [mode, modes]);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            beep.play();
            clearInterval(timerRef.current);
            setTimerRunning(false);
            if (autoSwitch) switchMode();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, autoSwitch, beep, switchMode]);

  const startTimer = () => setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  const resetTimer = () => {
    pauseTimer();
    setTimeLeft(modes[mode]);
  };

  const handleModeChange = (_, newMode) => {
    if (newMode) {
      setMode(newMode);
      setTimeLeft(modes[newMode]);
      setTimerRunning(false);
    }
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 10);
    }
    return () => clearInterval(stopwatchRef.current);
  }, [stopwatchRunning]);

  const formatStopwatch = (time) => {
    const ms = String(time % 100).padStart(2, '0');
    const s = String(Math.floor((time / 100) % 60)).padStart(2, '0');
    const m = String(Math.floor((time / 6000) % 60)).padStart(2, '0');
    const h = String(Math.floor(time / 360000)).padStart(2, '0');
    return `${h}:${m}:${s}.${ms}`;
  };

  const resetStopwatch = () => {
    setElapsed(0);
    setLaps([]);
    setStopwatchRunning(false);
  };

  const recordLap = () => {
    setLaps(prev => [...prev, elapsed]);
  };

  const exportLaps = () => {
    const blob = new Blob(
      [
        'Lap Number,Time\n' +
        laps.map((lap, i) => `${i + 1},${formatStopwatch(lap)}`).join('\n'),
      ],
      { type: 'text/csv;charset=utf-8;' }
    );
    saveAs(blob, 'stopwatch_laps.csv');
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('https://i.postimg.cc/Yq51br7t/MES.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />
      {/* Blur Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.4)',
          zIndex: 1,
        }}
      />
      {/* Timer UI */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 2,
        }}
      >
        <Paper
          elevation={5}
          sx={{
            p: 4,
            borderRadius: 4,
            maxWidth: 500,
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5">⏳ Focus Timer</Typography>

          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            fullWidth
            sx={{ my: 2 }}
          >
            <ToggleButton value="pomodoro">Pomodoro</ToggleButton>
            <ToggleButton value="short">Short Break</ToggleButton>
            <ToggleButton value="long">Long Break</ToggleButton>
          </ToggleButtonGroup>

          <CircularProgress
            variant="determinate"
            value={(timeLeft / modes[mode]) * 100}
            size={120}
            sx={{ mb: 2 }}
          />

          <Typography variant="h2" sx={{ fontFamily: 'monospace' }}>
            {formatTime(timeLeft)}
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ my: 2 }}>
            {!timerRunning ? (
              <Button variant="contained" color="success" onClick={startTimer}>
                Start
              </Button>
            ) : (
              <Button variant="contained" color="warning" onClick={pauseTimer}>
                Pause
              </Button>
            )}
            <Button variant="outlined" color="error" onClick={resetTimer}>
              Reset
            </Button>
          </Stack>

          {/* Stopwatch Section */}
          <Typography variant="h5" sx={{ mt: 4 }}>
            ⏱ Stopwatch
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: 'monospace', mt: 1 }}>
            {formatStopwatch(elapsed)}
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ my: 2 }}>
            {!stopwatchRunning ? (
              <Button variant="contained" color="success" onClick={() => setStopwatchRunning(true)}>
                Start
              </Button>
            ) : (
              <Button variant="contained" color="warning" onClick={() => setStopwatchRunning(false)}>
                Stop
              </Button>
            )}
            <Button variant="outlined" onClick={resetStopwatch}>
              Reset
            </Button>
            <Button variant="contained" onClick={recordLap} disabled={!stopwatchRunning}>
              Lap
            </Button>
            <Button variant="outlined" onClick={exportLaps} disabled={!laps.length}>
              Export
            </Button>
          </Stack>

          {laps.length > 0 && (
            <Box>
              <Typography variant="subtitle1">🏁 Laps</Typography>
              <List dense>
                {laps.map((lap, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={`Lap ${i + 1}`} secondary={formatStopwatch(lap)} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* 🔙 Back Button */}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate('/more-functions')}
          >
            ⬅ Back to More Functions
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default TimerPage;
