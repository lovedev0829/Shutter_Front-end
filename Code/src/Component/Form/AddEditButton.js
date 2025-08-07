import React from 'react';
import { Button, useTheme, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function AddEditButton({handleClick, title}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      startIcon={<AddIcon fontSize={isMobile ? "small" : "medium"} />}
      size={isMobile ? "medium" : "large"}
      sx={{
        borderRadius: 1,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: isMobile ? '13px' : '14px',
        padding: isMobile ? theme.spacing(1.2, 2) : theme.spacing(1, 2),
        minWidth: isMobile ? '100px' : 'auto',
        minHeight: isMobile ? '44px' : '36px', // Touch-friendly height
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          transform: 'translateY(-1px)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {title}
    </Button>
  );
}
