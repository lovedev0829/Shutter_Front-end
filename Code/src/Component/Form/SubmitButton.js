import React from "react";
import { Button, CircularProgress, Box } from '@mui/material';

export default function SubmitButton(props) {
  return (
    <Box sx={{ mt: 2 }}>
      <Button
        type={props.type || 'submit'}
        variant="contained"
        color="primary"
        disabled={props.disabled || false}
        onClick={props.handleClick}
        fullWidth={props.fullWidth || false}
        startIcon={props.loading && <CircularProgress size={16} color="inherit" />}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '14px',
          padding: '12px 24px',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&.Mui-disabled': {
            backgroundColor: 'action.disabledBackground',
            color: 'action.disabled',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {props.loading ? 'Processing...' : (props.buttonName || 'Submit')}
      </Button>
    </Box>
  );
}
