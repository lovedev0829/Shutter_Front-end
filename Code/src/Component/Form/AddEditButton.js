import React from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  fontSize: '14px',
  minWidth: 'auto',
  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
    transform: 'translateY(-1px)',
  },
  transition: 'all 0.2s ease-in-out',
}));

export default function AddEditButton({handleClick, title}) {
  return (
    <StyledButton
      variant="contained"
      color="primary"
      onClick={handleClick}
      startIcon={<AddIcon />}
    >
      {title}
    </StyledButton>
  );
}
