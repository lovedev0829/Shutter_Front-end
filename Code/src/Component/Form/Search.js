import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function Search({handleSearch}) {
  return (
    <TextField
      fullWidth
      placeholder="Search here..."
      variant="outlined"
      size="small"
      onChange={(e) => handleSearch(e.target.value)}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#fff',
          borderRadius: 1,
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
          padding: '10px 12px',
          fontSize: '14px',
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          </InputAdornment>
        ),
      }}
    />
  );
}
