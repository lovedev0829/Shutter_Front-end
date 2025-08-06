import React from "react";
import { TextField, Typography, Box } from '@mui/material';

export default function InputField(props) {
  return (
    <Box sx={{ 
      mb: { xs: 1.5, sm: 2 },
      width: '100%'
    }}>
      {props.displayLabel !== 'none' && (
        <Typography 
          component="label" 
          htmlFor={props.id}
          sx={{ 
            fontSize: { xs: '13px', sm: '14px' },
            fontWeight: 500,
            mb: { xs: 0.5, sm: 1 },
            display: 'block',
            color: 'text.primary'
          }}
        >
          {props.labelName} 
          {props.required && (
            <Typography component="sup" sx={{ color: 'error.main', ml: 0.5 }}>
              *
            </Typography>
          )}
        </Typography>
      )}
      <TextField
        type={props.type}
        value={props.value || ''}
        onChange={props.handleChange}
        id={props.id}
        name={props.name}
        placeholder={props.placeholderName}
        disabled={props.disabled || false}
        fullWidth
        variant="outlined"
        size={props.size || 'medium'}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            backgroundColor: props.disabled ? 'action.disabledBackground' : 'background.paper',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              borderWidth: 2,
            },
            '&.Mui-disabled': {
              backgroundColor: 'action.disabledBackground',
            }
          },
          '& .MuiInputBase-input': {
            fontSize: { xs: '14px', sm: '14px' },
            padding: { xs: '8px 10px', sm: '10px 12px' },
          }
        }}
      />
    </Box>
  );
}
