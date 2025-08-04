import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  minWidth: 250,
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

export default function Search({handleSearch}) {
  return (
    <StyledTextField
      placeholder="Search here..."
      variant="outlined"
      size="small"
      onChange={(e) => handleSearch(e.target.value)}
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
