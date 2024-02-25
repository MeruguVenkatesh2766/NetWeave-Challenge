import React from 'react';
import { Box, Typography } from '@mui/material';

const CustomBox = ({ children, heading, xAxisLabel, yAxisLabel }) => {
  return (
    <Box m={1} p={2} border={1} borderColor="primary.main">
      <Typography variant="h5" gutterBottom>
        {heading}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {xAxisLabel} (vs) {yAxisLabel}
      </Typography>
      {children}
    </Box>
  );
};

export default CustomBox;
