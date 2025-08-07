import React from 'react';
import { FormControl, Select, MenuItem, InputLabel, useTheme, useMediaQuery } from '@mui/material';

export default function StatusDropdown({ value = "", fn }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <FormControl 
      fullWidth 
      size={isMobile ? "medium" : "small"} 
      variant="outlined"
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
        '& .MuiInputLabel-root': {
          fontSize: isMobile ? '16px' : '14px',
        },
      }}
    >
      <InputLabel id="status-select-label">Status</InputLabel>
      <Select
        labelId="status-select-label"
        name="status"
        value={value || ""}
        label="Status"
        onChange={(e) => {
          if (fn) fn(e);
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: isMobile ? 250 : 300,
              '& .MuiMenuItem-root': {
                fontSize: isMobile ? '16px' : '14px',
                minHeight: isMobile ? '44px' : '36px', // Touch-friendly menu items
                padding: isMobile ? '12px 16px' : '8px 16px',
              },
            },
          },
        }}
      >
        <MenuItem value="2">Select Status</MenuItem>
        <MenuItem value="1">Active</MenuItem>
        <MenuItem value="0">Inactive</MenuItem>
      </Select>
    </FormControl>
  );
}


