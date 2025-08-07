import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

export default function StatusDropdown({ value = "", fn }) {
  return (
    <FormControl 
      fullWidth 
      size="small" 
      variant="outlined"
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
      >
        <MenuItem value="2">Select Status</MenuItem>
        <MenuItem value="1">Active</MenuItem>
        <MenuItem value="0">Inactive</MenuItem>
      </Select>
    </FormControl>
  );
}


