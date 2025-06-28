// 📁 src/pages/Unauthorized.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Unauthorized = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" color="error">Access Denied</Typography>
      <Typography>You are not authorized to view this page.</Typography>
    </Box>
  );
};

export default Unauthorized;
