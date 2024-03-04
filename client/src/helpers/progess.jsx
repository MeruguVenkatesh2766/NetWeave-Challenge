import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate({minimumHeight}) {
  return (
    <Box sx={{ display: 'flex', minHeight: minimumHeight, height: minimumHeight, justifyContent:'center',alignItems:'center' }}>
      <CircularProgress />
    </Box>
  );
}
