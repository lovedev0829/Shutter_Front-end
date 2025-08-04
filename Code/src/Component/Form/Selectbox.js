import React from "react";
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Box,
  FormHelperText 
} from '@mui/material';

export default function Selectbox(props) {
  return (
    <Box sx={{ mb: 2 }}>
      <FormControl 
        fullWidth 
        variant="outlined"
        disabled={props.disabled || false}
        error={props.error || false}
      >
        {props.labelName && (
          <Typography 
            component="label"
            sx={{ 
              fontSize: '14px',
              fontWeight: 500,
              mb: 1,
              display: 'block',
              color: props.error ? 'error.main' : 'text.primary'
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
        
        <Select
          value={props.value || ''}
          onChange={props.handleChange}
          name={props.name}
          id={props.id}
          displayEmpty
          sx={{
            borderRadius: 1,
            fontSize: '14px',
            '& .MuiSelect-select': {
              padding: '12px 14px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: props.error ? 'error.main' : 'divider',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: props.error ? 'error.main' : 'primary.main',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: props.error ? 'error.main' : 'primary.main',
              borderWidth: 2,
            },
            '&.Mui-disabled': {
              backgroundColor: 'action.disabledBackground',
            }
          }}
        >
          {props.placeholderName && (
            <MenuItem value="" disabled>
              <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>
                {props.placeholderName}
              </Typography>
            </MenuItem>
          )}
          
          {props.options?.map((option, index) => (
            <MenuItem 
              key={index} 
              value={option.value || option.id || option}
              sx={{
                fontSize: '14px',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  }
                }
              }}
            >
              {option.label || option.name || option.displayName || option}
            </MenuItem>
          ))}
        </Select>
        
        {props.helperText && (
          <FormHelperText sx={{ color: props.error ? 'error.main' : 'text.secondary' }}>
            {props.helperText}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
}
