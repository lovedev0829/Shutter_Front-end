import React from 'react';
import { TextField, InputAdornment, useTheme, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function Search({handleSearch}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <TextField
      fullWidth
      placeholder="Search here..."
      variant="outlined"
      size={isMobile ? "medium" : "small"}
      onChange={(e) => handleSearch(e.target.value)}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#fff',
          borderRadius: 1,
          minHeight: isMobile ? '44px' : '40px', // Touch-friendly height
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
        },
        '& .MuiInputBase-input': {
          padding: isMobile ? '12px 14px' : '10px 12px',
          fontSize: isMobile ? '16px' : '14px', // Prevent zoom on iOS
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ 
              color: 'text.secondary', 
              fontSize: isMobile ? 22 : 20 
            }} />
          </InputAdornment>
        ),
      }}
    />
  );
}
