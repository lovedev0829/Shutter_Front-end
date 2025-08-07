import React from 'react';
import { Typography, Box, useTheme, useMediaQuery } from '@mui/material';

export default function TableTitle({title}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box
      sx={{
        position: 'relative',
        paddingLeft: isMobile ? 1.5 : 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: isMobile ? 3 : 4,
          height: '60%',
          backgroundColor: 'primary.main',
          borderRadius: 2,
        },
      }}
    >
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        component="h2"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          fontSize: isMobile ? '20px' : '24px',
          lineHeight: 1.2,
          margin: 0,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}
