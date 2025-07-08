import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Stack } from '@mui/material';

export default function TextCaseConverter() {
  const [text, setText] = useState('');

  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());
  const toTitle = () =>
    setText(
      text
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>🔤 Text Case Converter</Typography>
      <TextField
        fullWidth
        multiline
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here..."
        sx={{ mb: 2 }}
      />
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={toUpper}>UPPERCASE</Button>
        <Button variant="contained" onClick={toLower}>lowercase</Button>
        <Button variant="contained" onClick={toTitle}>Title Case</Button>
      </Stack>
    </Box>
  );
}
