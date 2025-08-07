import React from "react";
import { Box, ToggleButton, ToggleButtonGroup, Typography, useTheme, useMediaQuery } from "@mui/material";

export default function ReportFilter({ handleStatuschange, value, JobStatus }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      const selectedStatus = JobStatus.find(status => status.jobStatusId === newValue);
      if (selectedStatus) {
        handleStatuschange(selectedStatus.jobStatusId, selectedStatus.jobStatusName);
      }
    }
  };

  return (
    <Box sx={{ 
      mb: { xs: 2, md: 3 },
      overflow: 'hidden'
    }}>
      <ToggleButtonGroup
        value={value.orderStatus}
        exclusive
        onChange={handleChange}
        aria-label="report filter"
        orientation={isMobile ? "vertical" : "horizontal"}
        sx={{
          width: isMobile ? '100%' : 'auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          gap: { xs: 0.5, md: 0 },
          '& .MuiToggleButton-root': {
            textTransform: 'none',
            fontWeight: 500,
            border: '1px solid #e0e0e0',
            borderRadius: { xs: 1, md: 2 },
            px: { xs: 2, sm: 2.5, md: 3 },
            py: { xs: 1, md: 1 },
            mx: { xs: 0, md: 0.5 },
            my: { xs: 0, md: 0 },
            minHeight: { xs: 40, md: 'auto' },
            width: isMobile ? '100%' : 'auto',
            fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
            '&:hover': {
              backgroundColor: 'grey.100',
            },
            '&:not(:last-of-type)': {
              borderBottom: isMobile ? '1px solid #e0e0e0' : 'inherit',
            },
          },
        }}
      >
        {JobStatus?.map((val, i) => (
          <ToggleButton
            key={i}
            value={val.jobStatusId}
            aria-label={val.jobStatusName}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 'inherit',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                textAlign: 'center',
                lineHeight: 1.2,
                whiteSpace: isSmallMobile ? 'normal' : 'nowrap',
                wordBreak: isSmallMobile ? 'break-word' : 'normal'
              }}
            >
              {val.jobStatusName}
            </Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
