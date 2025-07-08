import React, { useRef, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

export default function LoFiMusic() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggleMusic = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎵 Lo-Fi Music
      </Typography>
      <Button
        variant="contained"
        color={playing ? 'error' : 'primary'}
        startIcon={<MusicNoteIcon />}
        onClick={toggleMusic}
      >
        {playing ? 'Pause Music' : 'Play Music'}
      </Button>
      <audio ref={audioRef} loop>
        <source src="https://cdn.pixabay.com/audio/2022/03/15/audio_fa493b9e49.mp3" type="audio/mpeg" />
      </audio>
    </Box>
  );
}
