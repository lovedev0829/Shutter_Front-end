import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 180,
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    borderRadius: theme.spacing(1),
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  '& .MuiInputBase-input': {
    padding: '10px 12px',
    fontSize: '14px',
  },
}));

export default function StatusDropdown({ value = "", fn }) {
  return (
    <StyledFormControl size="small" variant="outlined">
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
    </StyledFormControl>
  );
}


