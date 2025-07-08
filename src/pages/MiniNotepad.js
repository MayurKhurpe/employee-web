import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Paper } from '@mui/material';

export default function MiniNotepad() {
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('miniNote');
    if (saved) setNote(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('miniNote', note);
  }, [note]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>📝 Mini Notepad</Typography>
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <TextField
          multiline
          fullWidth
          minRows={8}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write something..."
        />
      </Paper>
    </Box>
  );
}
